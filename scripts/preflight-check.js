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

async function runPreflight() {
  const envLocal = loadEnv(path.join(__dirname, '../.env.local'));
  const envMain = loadEnv(path.join(__dirname, '../.env'));
  const env = { ...envMain, ...envLocal, ...process.env };

  const results = {
    backendPrivateKey: env.BACKEND_PRIVATE_KEY ? 'CONFIGURED' : 'MISSING',
    sourceArchiveRpc: env.SOURCE_ARCHIVE_RPC_URL ? 'CONFIGURED' : 'MISSING',
    sourceChainKey: env.SOURCE_CHAIN_KEY || '1 (Sepolia)',
    proofBuilderUrl: env.CREDITCOIN_PROOF_BUILDER_URL || 'https://prover.cc3-testnet.creditcoin.network/',
    relayerAddress: null,
    relayerBalance: null,
    sepoliaRpcStatus: 'UNREACHABLE',
    sepoliaLatestBlock: null,
    cc3RpcStatus: 'UNREACHABLE',
    cc3LatestBlock: null,
    gluwaProverStatus: 'UNREACHABLE',
    gluwaAttestedHeight: null,
    placeholderBytecode: {},
    deploymentScriptReady: false,
    validationScriptReady: false,
    compiledArtifactsReady: false,
    demoModeActive: env.NEXT_PUBLIC_DEMO_MODE !== 'false',
  };

  // 1. Relayer address & balance
  if (env.BACKEND_PRIVATE_KEY && env.BACKEND_PRIVATE_KEY.startsWith('0x') && env.BACKEND_PRIVATE_KEY.length === 66) {
    try {
      const wallet = new ethers.Wallet(env.BACKEND_PRIVATE_KEY);
      results.relayerAddress = wallet.address;
    } catch {}
  }

  // 2. Sepolia RPC Connectivity
  const sepoliaRpcs = [
    env.SOURCE_ARCHIVE_RPC_URL,
    env.NEXT_PUBLIC_SOURCE_RPC_URL,
    'https://ethereum-sepolia-rpc.publicnode.com',
  ].filter(Boolean);

  for (const rpc of sepoliaRpcs) {
    try {
      const provider = new ethers.JsonRpcProvider(rpc);
      const block = await provider.getBlockNumber();
      results.sepoliaRpcStatus = 'REACHABLE';
      results.sepoliaLatestBlock = block;
      break;
    } catch {}
  }

  // 3. Creditcoin CC3 RPC Connectivity
  const cc3Rpc = env.CREDITCOIN_RPC_URL || env.NEXT_PUBLIC_CREDITCOIN_RPC_URL || 'https://rpc.cc3-testnet.creditcoin.network';
  let cc3Provider = null;
  try {
    cc3Provider = new ethers.JsonRpcProvider(cc3Rpc);
    const block = await cc3Provider.getBlockNumber();
    results.cc3RpcStatus = 'REACHABLE';
    results.cc3LatestBlock = block;

    if (results.relayerAddress) {
      const bal = await cc3Provider.getBalance(results.relayerAddress);
      results.relayerBalance = ethers.formatEther(bal) + ' tCTC';
    }
  } catch {}

  // 4. Gluwa Official Prover Connectivity & Attested Height
  const proverUrl = env.CREDITCOIN_PROOF_BUILDER_URL || 'https://prover.cc3-testnet.creditcoin.network/';
  try {
    const res = await fetch(`${proverUrl.replace(/\/$/, '')}/api/v1/attested-height/1`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const data = await res.json();
      results.gluwaProverStatus = 'REACHABLE (200 OK - No Auth Required)';
      results.gluwaAttestedHeight = data.attestedHeight;
    } else {
      results.gluwaProverStatus = `HTTP ${res.status}`;
    }
  } catch (e) {
    results.gluwaProverStatus = `UNREACHABLE (${e.message})`;
  }

  // 5. Check placeholder contract bytecode on CC3
  const placeholders = {
    ReliefCampaign: env.NEXT_PUBLIC_RELIEF_CAMPAIGN_ADDRESS || '0x4A1b459a3F89a29F257764f1c1fB40bE18eB48f5',
    AttestcoinVerifier: env.NEXT_PUBLIC_ATTESTCOIN_VERIFIER_ADDRESS || '0x99A59E4bB2860d5b5b0351586714E8f43D1A5a56',
    ResponderRegistry: env.NEXT_PUBLIC_RESPONDER_REGISTRY_ADDRESS || '0x32A46Fe4f9B3C268482F81b49162985392D4d4a8',
    AidDeliveryEscrow: env.NEXT_PUBLIC_AID_ESCROW_ADDRESS || '0x67C2F9817B45b7367858d4a938D891E1689eB442',
    AidPackageRegistry: env.NEXT_PUBLIC_AID_PACKAGE_ADDRESS || '0x12B9D4610b647F45672A489371D5810238A49F44',
  };

  if (cc3Provider) {
    for (const [name, addr] of Object.entries(placeholders)) {
      try {
        const code = await cc3Provider.getCode(ethers.getAddress(addr.toLowerCase()));
        results.placeholderBytecode[name] = code === '0x' ? '0x (EMPTY)' : `${code.length} bytes`;
      } catch (e) {
        results.placeholderBytecode[name] = 'Error querying';
      }
    }
  }

  // 6. AI Oracle (ImpactLens Gemini) Connectivity Check
  const aiKey = env.AI_API_KEY;
  const aiModel = env.AI_MODEL || 'gemini-1.5-flash';
  results.aiOracleStatus = aiKey ? 'CONFIGURED' : 'MISSING';
  results.aiModel = aiModel;
  if (aiKey) {
    try {
      const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${aiModel}?key=${aiKey}`, {
        signal: AbortSignal.timeout(5000),
      });
      if (aiRes.ok) {
        results.aiOracleConnectivity = `REACHABLE (${aiModel} Ready)`;
      } else {
        results.aiOracleConnectivity = `HTTP ${aiRes.status}`;
      }
    } catch (e) {
      results.aiOracleConnectivity = `UNREACHABLE (${e.message})`;
    }
  }

  // 7. Scripts and Artifacts Readiness
  results.deploymentScriptReady = fs.existsSync(path.join(__dirname, 'deploy-cc3-testnet.js'));
  results.validationScriptReady = fs.existsSync(path.join(__dirname, 'validate-cc3-deployment.js'));

  const requiredArtifacts = [
    'ReliefCampaign.json',
    'AttestcoinDonationVerifier.json',
    'ResponderRegistry.json',
    'AidDeliveryEscrow.json',
    'AidPackageRegistry.json',
  ];
  const outDir = path.join(__dirname, '../contracts/out');
  results.compiledArtifactsReady = requiredArtifacts.every((f) => fs.existsSync(path.join(outDir, f)));

  console.log(JSON.stringify(results, null, 2));
}

runPreflight().catch(console.error);
