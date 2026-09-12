import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { defineChain } from 'viem';

// Creditcoin CC3 Testnet Definition
export const creditcoinTestnet = defineChain({
  id: 102031,
  name: 'Creditcoin CC3 Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Testnet Creditcoin',
    symbol: 'tCTC',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_CREDITCOIN_RPC_URL || 'https://rpc.cc3-testnet.creditcoin.network'],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_CREDITCOIN_RPC_URL || 'https://rpc.cc3-testnet.creditcoin.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Creditcoin Explorer',
      url: 'https://creditcoin-testnet.subscan.io',
    },
  },
  testnet: true,
});

export const wagmiConfig = createConfig({
  chains: [sepolia, creditcoinTestnet],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SOURCE_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com'),
    [creditcoinTestnet.id]: http(process.env.NEXT_PUBLIC_CREDITCOIN_RPC_URL || 'https://rpc.cc3-testnet.creditcoin.network'),
  },
});

export const PROTOCOL_CONFIG = {
  isDemoMode: process.env.NEXT_PUBLIC_DEMO_MODE !== 'false', // Defaults to true for hackathon demo
  sepoliaVaultAddress: (process.env.NEXT_PUBLIC_SEPOLIA_VAULT_ADDRESS || '0x71C8391264b192837461928374614f9283746192') as `0x${string}`,
  sourceChain: {
    name: 'Ethereum Sepolia',
    id: 11155111,
    currency: 'SepoliaETH',
    rpcUrl: process.env.NEXT_PUBLIC_SOURCE_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com',
    explorer: 'https://sepolia.etherscan.io',
  },
  destinationChain: {
    name: 'Creditcoin CC3 Testnet',
    id: 102031,
    currency: 'tCTC',
    rpcUrl: process.env.NEXT_PUBLIC_CREDITCOIN_RPC_URL || 'https://rpc.cc3-testnet.creditcoin.network',
    explorer: 'https://creditcoin-testnet.subscan.io',
  },
  contracts: {
    campaign: (process.env.NEXT_PUBLIC_RELIEF_CAMPAIGN_ADDRESS || '0x995fa0F23037E1435dbBb3FDB224eAfe1964d815') as `0x${string}`,
    attestcoinVerifier: (process.env.NEXT_PUBLIC_ATTESTCOIN_VERIFIER_ADDRESS || '0x2C5334DDEaFfc6A56554401EcabD56b0E75Cf3B2') as `0x${string}`,
    responderRegistry: (process.env.NEXT_PUBLIC_RESPONDER_REGISTRY_ADDRESS || '0xb43743EAD07BE2A0fECF8Ab5a698Ab8c2f914d47') as `0x${string}`,
    aidEscrow: (process.env.NEXT_PUBLIC_AID_ESCROW_ADDRESS || '0xE84d28f690117C5b543225EBd7d3afd51131Ff44') as `0x${string}`,
    packageRegistry: (process.env.NEXT_PUBLIC_AID_PACKAGE_ADDRESS || '0x7e77382E958b80948928B8e073cC63B6EFB865D2') as `0x${string}`,
  },
  sourceChainKey: 1, // Sepolia Ethereum on CC3
  proofBuilderUrl: process.env.CREDITCOIN_PROOF_BUILDER_URL || process.env.NEXT_PUBLIC_PROOF_BUILDER_URL || 'https://prover.cc3-testnet.creditcoin.network/',
  testnetDisclaimers: {
    globalNotice: 'TESTNET PROTOCOL SIMULATION ONLY — NOT A CLAIM ON PHYSICAL HUMANITARIAN AID',
    virtualNodes: 'VIRTUAL DEPLOYMENT NODE — SIMULATION METRICS',
    rwaNotice: 'RWA INVENTORY REPRESENTATION — ZERO PHYSICAL DELIVERY LEGAL LIABILITY',
  }
};
