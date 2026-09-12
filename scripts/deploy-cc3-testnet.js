const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');

function loadEnv(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
    }
  }
  return env;
}

async function main() {
  console.log('===========================================================');
  console.log('       CREDITCOIN CC3 TESTNET DEPLOYMENT ENGINE            ');
  console.log('===========================================================\n');

  const envPath = path.join(__dirname, '../.env.local');
  const env = { ...loadEnv(envPath), ...process.env };

  const relayerKey = env.BACKEND_PRIVATE_KEY;
  const cc3Rpc = env.NEXT_PUBLIC_CREDITCOIN_RPC_URL || 'https://rpc.cc3-testnet.creditcoin.network';
  const expectedChainId = 102031;

  if (!relayerKey) {
    console.log('❌ DEPLOYMENT BLOCKED: BACKEND_PRIVATE_KEY is missing from environment.');
    console.log('\nTo deploy contracts to Creditcoin CC3 Testnet:');
    console.log('  1. Generate or configure an EVM account on Creditcoin CC3.');
    console.log('  2. Fund it with testnet tCTC gas tokens via Creditcoin faucet.');
    console.log('  3. Add BACKEND_PRIVATE_KEY=<your-key> to .env.local.');
    console.log('  4. Re-run: node scripts/deploy-cc3-testnet.js\n');
    console.log('ReliefMesh will NOT fabricate placeholder deployments without a real transaction.');
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(cc3Rpc);
  const network = await provider.getNetwork();
  const chainId = Number(network.chainId);

  if (chainId !== expectedChainId) {
    console.error(`❌ Wrong network chain ID: ${chainId}. Expected Creditcoin CC3 (${expectedChainId}).`);
    process.exit(1);
  }

  const wallet = new ethers.Wallet(relayerKey, provider);
  const balance = await provider.getBalance(wallet.address);
  const balanceEth = parseFloat(ethers.formatEther(balance));

  console.log(`✓ Deployer Wallet:  ${wallet.address}`);
  console.log(`✓ Network:          Creditcoin CC3 Testnet (Chain ID: ${chainId})`);
  console.log(`✓ Balance:          ${balanceEth.toFixed(4)} tCTC\n`);

  if (balanceEth < 0.05) {
    console.error(`❌ INSUFFICIENT GAS: Deployer balance (${balanceEth} tCTC) is below minimum threshold (0.05 tCTC).`);
    process.exit(1);
  }

  const outDir = path.join(__dirname, '../contracts/out');
  const loadArtifact = (name) => JSON.parse(fs.readFileSync(path.join(outDir, `${name}.json`), 'utf8'));

  const deployments = {
    network: 'Creditcoin CC3 Testnet',
    chainId,
    deployer: wallet.address,
    deployedAt: new Date().toISOString(),
    contracts: {},
    transactions: {},
  };

  // Helper deployer function
  async function deployContract(name, args = []) {
    console.log(`Deploying ${name}...`);
    const artifact = loadArtifact(name);
    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
    const contract = await factory.deploy(...args);
    const deploymentTx = contract.deploymentTransaction();
    console.log(`  Tx Hash: ${deploymentTx.hash}`);
    const receipt = await deploymentTx.wait(1);
    const address = await contract.getAddress();
    console.log(`  ✓ Deployed at: ${address} (Block #${receipt.blockNumber})\n`);

    deployments.contracts[name] = address;
    deployments.transactions[name] = {
      txHash: deploymentTx.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
    };
    return contract;
  }

  // 1. Deploy ResponderRegistry
  const responderRegistry = await deployContract('ResponderRegistry');
  const responderRegistryAddress = await responderRegistry.getAddress();

  // 2. Deploy ReliefCampaign (temporarily address(0) authorized verifier)
  const reliefCampaign = await deployContract('ReliefCampaign', [ethers.ZeroAddress]);
  const reliefCampaignAddress = await reliefCampaign.getAddress();

  // 3. Deploy AttestcoinDonationVerifier linked to ReliefCampaign
  const attestcoinOracle = '0x0000000000000000000000000000000000000FD2';
  const verifier = await deployContract('AttestcoinDonationVerifier', [reliefCampaignAddress, attestcoinOracle]);
  const verifierAddress = await verifier.getAddress();

  // 4. Configure ReliefCampaign with Authorized Verifier
  console.log('Configuring ReliefCampaign authorized verifier...');
  const txAuth = await reliefCampaign.setAuthorizedVerifier(verifierAddress);
  await txAuth.wait(1);
  console.log(`  ✓ ReliefCampaign verifier linked to: ${verifierAddress}\n`);

  // 5. Deploy AidDeliveryEscrow linked to ResponderRegistry
  const escrow = await deployContract('AidDeliveryEscrow', [responderRegistryAddress]);
  const escrowAddress = await escrow.getAddress();

  // 6. Deploy AidPackageRegistry
  const packageRegistry = await deployContract('AidPackageRegistry');
  const packageRegistryAddress = await packageRegistry.getAddress();

  // Populate aliases
  deployments.contracts['AttestcoinVerifier'] = verifierAddress;

  // Verify on-chain bytecode for all deployed contracts
  console.log('Verifying on-chain contract bytecode on Creditcoin CC3...');
  for (const [name, addr] of Object.entries(deployments.contracts)) {
    const code = await provider.getCode(addr);
    if (!code || code === '0x') {
      throw new Error(`Bytecode verification failed for ${name} at ${addr}! Code is empty 0x.`);
    }
    console.log(`  ✓ ${name} at ${addr}: ${code.length} chars bytecode confirmed on CC3`);
  }
  console.log('');

  // Verify all contract relationships
  console.log('Verifying inter-contract relationships...');
  const activeVerifier = await reliefCampaign.authorizedVerifier();
  if (activeVerifier.toLowerCase() !== verifierAddress.toLowerCase()) {
    throw new Error(`Relationship mismatch: ReliefCampaign.authorizedVerifier (${activeVerifier}) != AttestcoinDonationVerifier (${verifierAddress})`);
  }
  console.log(`  ✓ ReliefCampaign.authorizedVerifier == AttestcoinDonationVerifier (${activeVerifier})`);

  const linkedCampaign = await verifier.campaignContract();
  if (linkedCampaign.toLowerCase() !== reliefCampaignAddress.toLowerCase()) {
    throw new Error(`Relationship mismatch: AttestcoinDonationVerifier.campaignContract != ReliefCampaign`);
  }
  console.log(`  ✓ AttestcoinDonationVerifier.campaignContract == ReliefCampaign (${linkedCampaign})`);

  const linkedEscrowRegistry = await escrow.responderRegistry();
  if (linkedEscrowRegistry.toLowerCase() !== responderRegistryAddress.toLowerCase()) {
    throw new Error(`Relationship mismatch: AidDeliveryEscrow.responderRegistry != ResponderRegistry`);
  }
  console.log(`  ✓ AidDeliveryEscrow.responderRegistry == ResponderRegistry (${linkedEscrowRegistry})\n`);

  // Save deployments json
  const deploymentsDir = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentsDir)) fs.mkdirSync(deploymentsDir, { recursive: true });
  const deploymentsPath = path.join(deploymentsDir, 'cc3-testnet.json');
  fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2));
  console.log(`✓ Deployment metadata saved to: ${deploymentsPath}\n`);

  // Update .env.local with new deployed addresses
  console.log('Updating .env.local with real deployed addresses...');
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf8');
    const updates = {
      NEXT_PUBLIC_RELIEF_CAMPAIGN_ADDRESS: reliefCampaignAddress,
      NEXT_PUBLIC_ATTESTCOIN_VERIFIER_ADDRESS: verifierAddress,
      NEXT_PUBLIC_RESPONDER_REGISTRY_ADDRESS: responderRegistryAddress,
      NEXT_PUBLIC_AID_ESCROW_ADDRESS: escrowAddress,
      NEXT_PUBLIC_AID_PACKAGE_ADDRESS: packageRegistryAddress,
    };

    for (const [key, val] of Object.entries(updates)) {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${key}=${val}`);
      } else {
        envContent += `\n${key}=${val}`;
      }
    }
    fs.writeFileSync(envPath, envContent);
    console.log('✓ .env.local updated with new deployed contract addresses.\n');
  }

  console.log('===========================================================');
  console.log('       DEPLOYMENT COMPLETED & INDEPENDENTLY CONFIRMED      ');
  console.log('===========================================================');
}

main().catch((err) => {
  console.error('Deployment error:', err.message);
  process.exit(1);
});
