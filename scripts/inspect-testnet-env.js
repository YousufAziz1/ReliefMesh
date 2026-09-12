const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');

// Simple .env parser
function loadEnv(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      env[key] = val;
    }
  }
  return env;
}

async function main() {
  console.log('===========================================================');
  console.log('       RELIEFMESH LIVE TESTNET ENVIRONMENT AUDIT          ');
  console.log('===========================================================\n');

  const envLocal = loadEnv(path.join(__dirname, '../.env.local'));
  const envMain = loadEnv(path.join(__dirname, '../.env'));
  const env = { ...envMain, ...envLocal, ...process.env };

  // 1. Check Secret Credentials
  console.log('--- 1. CREDENTIALS & SECRETS INSPECTION ---');
  const gluwaKey = env.GLUWA_PROVER_API_KEY;
  const archiveRpc = env.SOURCE_ARCHIVE_RPC_URL;
  const backendKey = env.BACKEND_PRIVATE_KEY;

  console.log(`GLUWA_PROVER_API_KEY:    ${gluwaKey ? 'CONFIGURED (' + gluwaKey.slice(0, 6) + '...)' : 'MISSING'}`);
  console.log(`SOURCE_ARCHIVE_RPC_URL:  ${archiveRpc ? 'CONFIGURED (' + archiveRpc.slice(0, 20) + '...)' : 'MISSING'}`);
  console.log(`BACKEND_PRIVATE_KEY:     ${backendKey ? 'CONFIGURED (' + backendKey.slice(0, 6) + '...)' : 'MISSING'}`);

  // 2. Sepolia RPC Connectivity
  console.log('\n--- 2. ETHEREUM SEPOLIA RPC CONNECTIVITY ---');
  const sepoliaRpcs = [
    env.NEXT_PUBLIC_SOURCE_RPC_URL || 'https://rpc.sepolia.org',
    'https://ethereum-sepolia-rpc.publicnode.com',
    'https://rpc2.sepolia.org',
    'https://1rpc.io/sepolia',
  ];
  let sepoliaConnected = false;
  let sepoliaBlock = null;
  let sepoliaChainId = null;
  let activeSepoliaRpc = null;

  for (const rpc of sepoliaRpcs) {
    try {
      const provider = new ethers.JsonRpcProvider(rpc);
      const network = await provider.getNetwork();
      sepoliaChainId = Number(network.chainId);
      sepoliaBlock = await provider.getBlockNumber();
      sepoliaConnected = true;
      activeSepoliaRpc = rpc;
      console.log(`  ✓ Sepolia RPC URL:    ${rpc}`);
      console.log(`  ✓ Chain ID:           ${sepoliaChainId} (Expected: 11155111)`);
      console.log(`  ✓ Latest Block:       #${sepoliaBlock}`);
      break;
    } catch (err) {
      console.log(`  ⚠ Sepolia RPC (${rpc}) Failed: ${err.message.slice(0, 80)}...`);
    }
  }

  // 3. Creditcoin CC3 RPC Connectivity
  console.log('\n--- 3. CREDITCOIN CC3 TESTNET RPC CONNECTIVITY ---');
  const cc3Rpc = env.NEXT_PUBLIC_CREDITCOIN_RPC_URL || 'https://rpc.cc3-testnet.creditcoin.network';
  let cc3Connected = false;
  let cc3Block = null;
  let cc3ChainId = null;
  let cc3Provider = null;

  try {
    cc3Provider = new ethers.JsonRpcProvider(cc3Rpc);
    const network = await cc3Provider.getNetwork();
    cc3ChainId = Number(network.chainId);
    cc3Block = await cc3Provider.getBlockNumber();
    cc3Connected = true;
    console.log(`  ✓ Creditcoin CC3 RPC: ${cc3Rpc}`);
    console.log(`  ✓ Chain ID:           ${cc3ChainId} (Expected: 102031)`);
    console.log(`  ✓ Latest Block:       #${cc3Block}`);
  } catch (err) {
    console.log(`  ✗ Creditcoin CC3 RPC Connection Failed: ${err.message}`);
  }

  // 4. Deployed Contract Bytecode Verification on CC3
  console.log('\n--- 4. CONTRACT ADDRESSES & BYTECODE VERIFICATION ON CC3 ---');
  const contracts = {
    ReliefCampaign: env.NEXT_PUBLIC_RELIEF_CAMPAIGN_ADDRESS || '0x4A1b459a3F89a29F257764f1c1fB40bE18eB48f5',
    AttestcoinVerifier: env.NEXT_PUBLIC_ATTESTCOIN_VERIFIER_ADDRESS || '0x99A59E4bB2860d5b5b0351586714E8f43D1A5a56',
    ResponderRegistry: env.NEXT_PUBLIC_RESPONDER_REGISTRY_ADDRESS || '0x32A46Fe4f9B3C268482F81b49162985392D4d4a8',
    AidDeliveryEscrow: env.NEXT_PUBLIC_AID_ESCROW_ADDRESS || '0x67C2F9817B45b7367858d4a938D891E1689eB442',
    AidPackageRegistry: env.NEXT_PUBLIC_AID_PACKAGE_ADDRESS || '0x12B9D4610b647F45672A489371D5810238A49F44',
  };

  if (cc3Connected && cc3Provider) {
    for (const [name, addr] of Object.entries(contracts)) {
      try {
        const checksumAddr = ethers.getAddress(addr.toLowerCase());
        const code = await cc3Provider.getCode(checksumAddr);
        const hasCode = code && code !== '0x';
        console.log(`  ${name}: ${checksumAddr} -> Bytecode: ${hasCode ? `DEPLOYED (${code.length / 2 - 1} bytes)` : 'EMPTY (0x - NOT DEPLOYED)'}`);
      } catch (err) {
        console.log(`  ${name}: ${addr} -> Error querying code: ${err.message}`);
      }
    }
  } else {
    console.log('  Skipped: Creditcoin CC3 RPC not reachable.');
  }

  // 5. Relayer Wallet Balance
  console.log('\n--- 5. RELAYER WALLET BALANCE (Creditcoin CC3) ---');
  if (backendKey && backendKey.startsWith('0x')) {
    try {
      const wallet = new ethers.Wallet(backendKey);
      console.log(`  Address: ${wallet.address}`);
      if (cc3Connected && cc3Provider) {
        const bal = await cc3Provider.getBalance(wallet.address);
        console.log(`  Balance: ${ethers.formatEther(bal)} tCTC`);
      }
    } catch (err) {
      console.log(`  Error inspecting relayer key: ${err.message}`);
    }
  } else {
    console.log('  BACKEND_PRIVATE_KEY is not configured.');
  }

  // 6. Sepolia Vault Address
  console.log('\n--- 6. CONFIGURED SEPOLIA VAULT ADDRESS ---');
  const vaultAddr = env.NEXT_PUBLIC_SEPOLIA_VAULT_ADDRESS || '0x71C8391264b192837461928374614f92';
  console.log(`  Vault Address: ${vaultAddr}`);
  if (sepoliaConnected && activeSepoliaRpc) {
    try {
      const provider = new ethers.JsonRpcProvider(activeSepoliaRpc);
      const checksumVault = ethers.getAddress(vaultAddr.toLowerCase());
      const bal = await provider.getBalance(checksumVault);
      console.log(`  Vault Balance: ${ethers.formatEther(bal)} SepoliaETH`);
    } catch (err) {
      console.log(`  Error querying vault balance: ${err.message}`);
    }
  }

  // 7. Attestcoin Proof Service Connectivity
  console.log('\n--- 7. ATTESTCOIN PROOF SERVICE CONNECTIVITY ---');
  const proverUrl = env.NEXT_PUBLIC_PROOF_BUILDER_URL || 'https://attestcoin-prover.gluwa.org';
  console.log(`  Prover URL: ${proverUrl}`);
  try {
    const res = await fetch(proverUrl, { method: 'GET', signal: AbortSignal.timeout(6000) }).catch(e => ({ status: 'FETCH_ERROR', message: e.message }));
    if (res.status === 'FETCH_ERROR') {
      console.log(`  Prover Connectivity: Endpoint unreachable (${res.message})`);
    } else {
      console.log(`  Prover Connectivity: HTTP Status ${res.status}`);
    }
  } catch (err) {
    console.log(`  Prover Connectivity: ${err.message}`);
  }

  console.log('\n===========================================================');
  console.log('                      AUDIT COMPLETE                       ');
  console.log('===========================================================');
}

main().catch(err => console.error(err));
