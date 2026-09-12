const fs = require('fs');
const path = require('path');
const solc = require('solc');

console.log('===========================================================');
console.log('       RELIEFMESH SOLIDITY COMPILATION PIPELINE            ');
console.log('===========================================================\n');

const contractsDir = path.join(__dirname, '../contracts/src');
const outDir = path.join(__dirname, '../contracts/out');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const contractFiles = [
  'ReliefCampaign.sol',
  'AttestcoinDonationVerifier.sol',
  'ResponderRegistry.sol',
  'AidDeliveryEscrow.sol',
  'AidPackageRegistry.sol'
];

const sources = {};
for (const file of contractFiles) {
  const filePath = path.join(contractsDir, file);
  sources[file] = { content: fs.readFileSync(filePath, 'utf8') };
}

const input = {
  language: 'Solidity',
  sources,
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    },
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode', 'evm.deployedBytecode', 'metadata']
      }
    }
  }
};

console.log(`Compiling ${contractFiles.length} Solidity contracts with solc v${solc.version()}...`);
const output = JSON.parse(solc.compile(JSON.stringify(input)));

let hasErrors = false;
if (output.errors) {
  for (const err of output.errors) {
    if (err.severity === 'error') {
      console.error(`  ✗ ERROR [${err.sourceLocation ? err.sourceLocation.file : 'General'}]: ${err.formattedMessage}`);
      hasErrors = true;
    } else {
      console.warn(`  ⚠ WARNING: ${err.message}`);
    }
  }
}

if (hasErrors) {
  console.error('\nCompilation failed with errors.');
  process.exit(1);
}

console.log('\n--- COMPILED CONTRACT ARTIFACTS ---');
const compiledContracts = {};

for (const [sourceFile, contracts] of Object.entries(output.contracts)) {
  for (const [contractName, contractData] of Object.entries(contracts)) {
    const bytecode = contractData.evm.bytecode.object;
    const deployedBytecode = contractData.evm.deployedBytecode.object;
    const abi = contractData.abi;

    const artifactPath = path.join(outDir, `${contractName}.json`);
    const artifact = {
      contractName,
      sourceFile,
      abi,
      bytecode: '0x' + bytecode,
      deployedBytecode: '0x' + deployedBytecode,
      compiler: {
        version: solc.version()
      }
    };

    fs.writeFileSync(artifactPath, JSON.stringify(artifact, null, 2));
    compiledContracts[contractName] = artifact;

    console.log(`  ✓ ${contractName.padEnd(28)} | Bytecode: ${(bytecode.length / 2).toLocaleString()} bytes | File: contracts/out/${contractName}.json`);
  }
}

console.log('\n===========================================================');
console.log('       ALL 5 CONTRACTS COMPILED SUCCESSFULLY              ');
console.log('===========================================================\n');
