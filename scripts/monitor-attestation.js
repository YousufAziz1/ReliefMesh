const { proofProvider, blockProver, chainInfo } = require('@gluwa/usc-sdk');
const { ethers } = require('ethers');

async function monitor() {
  const targetBlock = 11684082;
  const txHash = '0xbc2be5639814c48c313e3e61a65aa5fab1b4ec3e5c9db9791ea4f1976d89e2c4';
  const proverUrl = 'https://prover.cc3-testnet.creditcoin.network/';
  const cc3Rpc = 'https://rpc.cc3-testnet.creditcoin.network';
  const provider = new ethers.JsonRpcProvider(cc3Rpc);
  const chainInfoProv = new chainInfo.PrecompileChainInfoProvider(provider);
  const builder = new proofProvider.service.ProofBuilder(1, proverUrl, 20000);

  let attestedHeight = 0;
  for (let attempt = 1; attempt <= 15; attempt++) {
    try {
      const res = await fetch(`${proverUrl.replace(/\/$/, '')}/api/v1/attested-height/1`);
      if (res.ok) {
        const data = await res.json();
        attestedHeight = data.attestedHeight || data.data || 0;
      }
    } catch (e) {}

    let bounds = { parentHeight: 0, isAttested: false };
    try {
      bounds = await chainInfoProv.getContinuityBounds(1, targetBlock);
    } catch (e) {}

    const now = new Date().toLocaleTimeString();
    console.log(`[${now} - Check ${attempt}] Prover: #${attestedHeight} | CC3 parent: #${bounds.parentHeight} | isAttested: ${bounds.isAttested} (Target: #${targetBlock})`);

    if (bounds.isAttested || attestedHeight >= targetBlock) {
      console.log('\n✓ Target block is ATTESTED! Requesting proof from ProofBuilder...');
      const proofResult = await builder.getProof(txHash);
      if (proofResult.success && proofResult.data) {
        console.log('✓ Proof generation SUCCEEDED!');
        console.log(`  - txIndex: ${proofResult.data.txIndex}`);
        console.log(`  - txBytes len: ${proofResult.data.txBytes?.length}`);
        console.log(`  - merkleProof nodes: ${proofResult.data.merkleProof?.length}`);

        // Verify via PrecompileBlockProver
        const prover = new blockProver.PrecompileBlockProver(provider);
        const verified = await prover.verifySingle(
          proofResult.data.chainKey,
          proofResult.data.headerNumber,
          proofResult.data.txBytes,
          proofResult.data.merkleProof,
          proofResult.data.continuityProof
        );
        console.log('✓ PrecompileBlockProver.verifySingle() result:', verified);
        return { success: true, proofData: proofResult.data, verified, attestedHeight };
      } else {
        console.log('ProofBuilder status:', proofResult.error || 'Assembling proof...');
      }
    }

    if (attempt < 15) {
      await new Promise((r) => setTimeout(r, 20000));
    }
  }

  return { success: false, attestedHeight };
}

monitor()
  .then((result) => {
    console.log('\nMonitoring cycle result:', JSON.stringify(result, null, 2));
  })
  .catch(console.error);
