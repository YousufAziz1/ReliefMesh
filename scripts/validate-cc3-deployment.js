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
  console.log('       CREDITCOIN CC3 DEPLOYMENT VALIDATION SUITE          ');
  console.log('===========================================================\n');

  const env = { ...loadEnv(path.join(__dirname, '../.env.local')), ...process.env };
  const cc3Rpc = env.NEXT_PUBLIC_CREDITCOIN_RPC_URL || 'https://rpc.cc3-testnet.creditcoin.network';
  const expectedChainId = 102031;

  const provider = new ethers.JsonRpcProvider(cc3Rpc);
  const network = await provider.getNetwork();
  const chainId = Number(network.chainId);

  console.log(`Connected to: ${cc3Rpc}`);
  console.log(`Chain ID:     ${chainId} (Expected: ${expectedChainId})\n`);

  if (chainId !== expectedChainId) {
    console.error(`❌ Wrong network: Expected ${expectedChainId}, got ${chainId}`);
    process.exit(1);
  }

  // Load deployment addresses from deployments file or env
  const deploymentsFile = path.join(__dirname, '../deployments/cc3-testnet.json');
  let contractAddrs = {};

  if (fs.existsSync(deploymentsFile)) {
    const data = JSON.parse(fs.readFileSync(deploymentsFile, 'utf8'));
    contractAddrs = data.contracts || {};
    console.log(`✓ Loaded deployments record from: deployments/cc3-testnet.json (Deployed at: ${data.deployedAt})`);
  } else {
    contractAddrs = {
      ReliefCampaign: env.NEXT_PUBLIC_RELIEF_CAMPAIGN_ADDRESS,
      AttestcoinVerifier: env.NEXT_PUBLIC_ATTESTCOIN_VERIFIER_ADDRESS,
      ResponderRegistry: env.NEXT_PUBLIC_RESPONDER_REGISTRY_ADDRESS,
      AidDeliveryEscrow: env.NEXT_PUBLIC_AID_ESCROW_ADDRESS,
      AidPackageRegistry: env.NEXT_PUBLIC_AID_PACKAGE_ADDRESS,
    };
    console.log('⚠ No deployments/cc3-testnet.json found. Inspecting addresses from .env.local:');
  }

  const outDir = path.join(__dirname, '../contracts/out');
  let allContractsValid = true;

  for (const [name, addr] of Object.entries(contractAddrs)) {
    if (!addr || !addr.startsWith('0x')) {
      console.log(`  ✗ ${name}: Address not configured.`);
      allContractsValid = false;
      continue;
    }

    try {
      const checksumAddr = ethers.getAddress(addr.toLowerCase());
      const code = await provider.getCode(checksumAddr);

      if (!code || code === '0x') {
        console.log(`  ✗ ${name} (${checksumAddr}): Bytecode EMPTY (0x). Contract is not deployed on CC3.`);
        allContractsValid = false;
      } else {
        console.log(`  ✓ ${name} (${checksumAddr}): DEPLOYED (${(code.length / 2 - 1).toLocaleString()} bytes)`);

        // Test ABI read call if artifact exists
        const artifactPath = path.join(outDir, `${name}.json`);
        if (fs.existsSync(artifactPath)) {
          const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
          const contract = new ethers.Contract(checksumAddr, artifact.abi, provider);

          try {
            const owner = await contract.owner();
            console.log(`     -> owner: ${owner}`);
          } catch {}

          if (name === 'ReliefCampaign') {
            try {
              const verifier = await contract.authorizedVerifier();
              console.log(`     -> authorizedVerifier: ${verifier}`);
            } catch {}
          } else if (name === 'AttestcoinVerifier' || name === 'AttestcoinDonationVerifier') {
            try {
              const campaign = await contract.campaignContract();
              const oracle = await contract.attestcoinOracle();
              console.log(`     -> campaignContract: ${campaign}`);
              console.log(`     -> attestcoinOracle: ${oracle}`);
            } catch {}
          } else if (name === 'AidDeliveryEscrow') {
            try {
              const registry = await contract.responderRegistry();
              console.log(`     -> responderRegistry: ${registry}`);
            } catch {}
          }
        }
      }
    } catch (err) {
      console.log(`  ✗ ${name} (${addr}): Error inspecting contract: ${err.message}`);
      allContractsValid = false;
    }
  }

  console.log('\n-----------------------------------------------------------');
  if (allContractsValid) {
    console.log('✓ VALIDATION RESULT: ALL CONTRACTS ARE ACTIVE ON CC3 TESTNET');
  } else {
    console.log('❌ VALIDATION RESULT: CONTRACTS ARE NOT YET DEPLOYED ON CC3 TESTNET');
    console.log('   Run: npm run deploy:contracts (once BACKEND_PRIVATE_KEY is funded)');
  }
  console.log('-----------------------------------------------------------\n');
}

main().catch(err => console.error(err));
