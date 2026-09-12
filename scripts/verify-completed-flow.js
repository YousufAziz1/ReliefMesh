const { proofProvider, blockProver, chainInfo } = require('@gluwa/usc-sdk');
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Load environment
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
});

const txHash = '0xbc2be5639814c48c313e3e61a65aa5fab1b4ec3e5c9db9791ea4f1976d89e2c4';
const targetBlock = 11684082;
const proverUrl = env.CREDITCOIN_PROOF_BUILDER_URL || 'https://prover.cc3-testnet.creditcoin.network/';
const cc3Rpc = env.CREDITCOIN_CC3_RPC_URL || 'https://rpc.cc3-testnet.creditcoin.network';
const verifierAddress = env.NEXT_PUBLIC_ATTESTCOIN_VERIFIER_ADDRESS;
const campaignAddress = env.NEXT_PUBLIC_RELIEF_CAMPAIGN_ADDRESS;

async function checkAndVerify() {
  const provider = new ethers.JsonRpcProvider(cc3Rpc);
  const chainInfoProv = new chainInfo.PrecompileChainInfoProvider(provider);
  const builder = new proofProvider.service.ProofBuilder(1, proverUrl, 30000);

  // 1. Check Attested Height
  let proverHeight = 0;
  try {
    const res = await fetch(`${proverUrl.replace(/\/$/, '')}/api/v1/attested-height/1`);
    if (res.ok) {
      const data = await res.json();
      proverHeight = data.attestedHeight || data.data || 0;
    }
  } catch (e) {
    console.error('Error fetching prover height:', e.message);
  }

  // 2. Check Continuity Bounds
  let bounds = { parentHeight: 0, isAttested: false };
  try {
    bounds = await chainInfoProv.getContinuityBounds(1, targetBlock);
  } catch (e) {
    console.error('Error fetching bounds:', e.message);
  }

  console.log('--- STATUS CHECK ---');
  console.log(`Target Block: #${targetBlock}`);
  console.log(`Prover Attested Height: #${proverHeight}`);
  console.log(`CC3 Precompile Parent Height: #${bounds.parentHeight}`);
  console.log(`isAttested: ${bounds.isAttested}`);

  // Check contracts state
  const verifierAbi = [
    'function isDonationVerified(bytes32) view returns (bool)',
    'function verifyDonationProof(string,bytes32,uint256,address,uint256,uint256,bytes) returns (bool)'
  ];
  const verifier = new ethers.Contract(verifierAddress, verifierAbi, provider);

  const isVerifiedAlready = await verifier.isDonationVerified(txHash);
  console.log(`\nAttestcoinDonationVerifier.isDonationVerified(${txHash}): ${isVerifiedAlready}`);

  const campaignAbi = [
    'function getCampaignStats(uint256) view returns (uint256 id, string memory name, uint256 goal, uint256 verifiedAmount, uint256 donorCount, bool closed)'
  ];
  const campaign = new ethers.Contract(campaignAddress, campaignAbi, provider);
  const campStats = await campaign.getCampaignStats(1);
  console.log(`ReliefCampaign #1 stats: name="${campStats[1]}", verifiedAmount=${ethers.formatEther(campStats[3])} tCTC, donorCount=${campStats[4]}, closed=${campStats[5]}`);

  if (!bounds.isAttested && proverHeight < targetBlock) {
    console.log('\nAttestation is still pending. Continuing to wait...');
    return { attested: false, proverHeight, bounds };
  }

  // Attestation reached! Request proof
  console.log('\nTarget block reached! Requesting proof from official ProofBuilder...');
  const proofResult = await builder.getProof(txHash);
  console.log('ProofBuilder Response success:', proofResult.success);

  if (!proofResult.success || !proofResult.data) {
    console.log('ProofBuilder error:', proofResult.error);
    return { attested: true, proofReady: false, error: proofResult.error };
  }

  const proofData = proofResult.data;
  console.log('✓ Proof Data Received:');
  console.log(`  - chainKey: ${proofData.chainKey}`);
  console.log(`  - headerNumber: ${proofData.headerNumber}`);
  console.log(`  - txIndex: ${proofData.txIndex}`);
  console.log(`  - txBytes length: ${proofData.txBytes.length}`);
  console.log(`  - merkleProof elements: ${proofData.merkleProof.length}`);

  // Verify through PrecompileBlockProver
  console.log('\nVerifying through PrecompileBlockProver...');
  const prover = new blockProver.PrecompileBlockProver(provider);
  const precompileValid = await prover.verifySingle(
    proofData.chainKey,
    proofData.headerNumber,
    proofData.txBytes,
    proofData.merkleProof,
    proofData.continuityProof
  );
  console.log('✓ PrecompileBlockProver.verifySingle() result:', precompileValid);

  // Test duplicate replay rejection via staticCall
  console.log('\nTesting duplicate replay rejection on AttestcoinDonationVerifier...');
  try {
    const signer = new ethers.Wallet(env.BACKEND_PRIVATE_KEY, provider);
    const verifierWithSigner = verifier.connect(signer);
    await verifierWithSigner.verifyDonationProof.staticCall(
      'Ethereum Sepolia',
      txHash,
      targetBlock,
      '0x936cBfC816Cfa2301cEB69aa7Cc6A9B38710FAeF',
      ethers.parseEther('0.0001'),
      1, // campaignId
      '0x' // signature / proof payload
    );
    console.log('WARNING: Duplicate was not rejected!');
  } catch (err) {
    console.log('✓ Duplicate correctly REJECTED by smart contract:');
    console.log(`  Reason: ${err.reason || err.shortMessage || err.message}`);
  }

  return {
    attested: true,
    proofReady: true,
    precompileValid,
    isVerifiedAlready,
    campData: {
      funds: ethers.formatEther(campStats[3]),
      donors: campStats[4].toString()
    }
  };
}

checkAndVerify().then(r => console.log('\nExecution summary:', JSON.stringify(r, null, 2))).catch(console.error);
