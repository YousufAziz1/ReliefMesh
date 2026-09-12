export interface CampaignData {
  id: number;
  name: string;
  goal: number;
  verifiedDonations: number;
  pendingEscrow: number;
  dispatchedGrants: number;
  remainingDelta: number;
  donorCount: number;
  responderCount: number;
  completedDeliveries: number;
  rewardsDispatched: number;
  activeStatus: boolean;
  region: string;
  startDate: string;
  lastBlockUpdate: number;
}

export interface ResponderNode {
  id: string;
  name: string;
  role: string;
  zone: string;
  battery: number;
  status: 'ONLINE' | 'STANDBY' | 'DISPATCHED' | 'OFFLINE';
  deliveries: number;
  rewardsEarned: number;
  latestProofHash: string;
  reputation: number;
  coordinates: { x: number; y: number };
}

export interface AidPackage {
  id: string;
  campaignId: number;
  assetType: 'Water Kit' | 'Medical Kit' | 'Food Package';
  zone: string;
  status: 'Delivered' | 'In Transit' | 'Queued' | 'Audited';
  deliveryProofHash: string;
  dispatchedAt: string;
  verifiedBy: string;
}

export interface ProtocolActivity {
  id: string;
  type: 'DONATION_VERIFIED' | 'PROOF_GENERATED' | 'RESPONDER_REGISTERED' | 'DELIVERY_COMPLETED' | 'REWARD_RELEASED' | 'DUPLICATE_REJECTED';
  title: string;
  description: string;
  timestamp: string;
  wallet: string;
  txHash: string;
  amount?: string;
  status: 'SUCCESS' | 'BLOCKED' | 'PENDING';
}

export interface CrossChainProof {
  proofId: string;
  sourceChain: string;
  sourceTxHash: string;
  sourceBlock: number;
  donor: string;
  amount: string;
  attestcoinOracle: string;
  merkleRoot: string;
  destinationChain: string;
  destinationTxHash: string;
  timestamp: string;
  verified: boolean;
}

export const INITIAL_CAMPAIGN: CampaignData = {
  id: 1,
  name: "Assam Flood Relief — Testnet Simulation",
  goal: 1000,
  verifiedDonations: 320,
  pendingEscrow: 180,
  dispatchedGrants: 128,
  remainingDelta: 372,
  donorCount: 14,
  responderCount: 3,
  completedDeliveries: 5,
  rewardsDispatched: 128,
  activeStatus: true,
  region: "Assam Valley / Brahmaputra Basin",
  startDate: "2026-09-01",
  lastBlockUpdate: 1482904,
};

export const INITIAL_RESPONDERS: ResponderNode[] = [
  {
    id: "NODE-ALPHA",
    name: "Water Distribution Node",
    role: "Hydration & Rapid Purification",
    zone: "Brahmaputra North - Sector 1",
    battery: 94,
    status: "ONLINE",
    deliveries: 2,
    rewardsEarned: 48,
    latestProofHash: "0x8a9fc4219b48c823ea47b912a7810459c381fbc0293847e091b489a29184c4a1",
    reputation: 99,
    coordinates: { x: 38, y: 42 }
  },
  {
    id: "NODE-BETA",
    name: "Medical Supply Node",
    role: "First-Response Triage Packs",
    zone: "Guwahati Sector 4 - Mobile Post",
    battery: 88,
    status: "ONLINE",
    deliveries: 2,
    rewardsEarned: 52,
    latestProofHash: "0x3d12e901a847b294c8104918e9102948c71b489a01948572b947c9182390d4e2",
    reputation: 98,
    coordinates: { x: 62, y: 35 }
  },
  {
    id: "NODE-GAMMA",
    name: "Food Delivery Node",
    role: "High-Calorie Nutrient Rations",
    zone: "Silchar East - Distribution Point C",
    battery: 76,
    status: "STANDBY",
    deliveries: 1,
    rewardsEarned: 28,
    latestProofHash: "0x7c41b109c48572019485729104859182c81947b1029485710294857102948571",
    reputation: 95,
    coordinates: { x: 50, y: 68 }
  }
];

export const INITIAL_PACKAGES: AidPackage[] = [
  {
    id: "PKG-WTR-01",
    campaignId: 1,
    assetType: "Water Kit",
    zone: "Brahmaputra North - Zone A",
    status: "Delivered",
    deliveryProofHash: "0x8a9fc4219b48c823ea47b912a7810459c381fbc0293847e091b489a29184c4a1",
    dispatchedAt: "10 mins ago",
    verifiedBy: "Node Alpha / Attestcoin"
  },
  {
    id: "PKG-MED-02",
    campaignId: 1,
    assetType: "Medical Kit",
    zone: "Guwahati Sector 4 - Post 2",
    status: "Delivered",
    deliveryProofHash: "0x3d12e901a847b294c8104918e9102948c71b489a01948572b947c9182390d4e2",
    dispatchedAt: "24 mins ago",
    verifiedBy: "Node Beta / Attestcoin"
  },
  {
    id: "PKG-FOD-03",
    campaignId: 1,
    assetType: "Food Package",
    zone: "Silchar East - Sector C",
    status: "In Transit",
    deliveryProofHash: "0x7c41b109c48572019485729104859182c81947b1029485710294857102948571",
    dispatchedAt: "42 mins ago",
    verifiedBy: "Node Gamma / Pending Final GPS Attestation"
  }
];

export const INITIAL_ACTIVITIES: ProtocolActivity[] = [
  {
    id: "ACT-01",
    type: "DONATION_VERIFIED",
    title: "Donation Verified on Creditcoin CC3",
    description: "50.00 tCTC cross-chain attestation confirmed via Attestcoin inclusion proof.",
    timestamp: "4 mins ago",
    wallet: "0x71C8...4f92",
    txHash: "0x9812...c4e1",
    amount: "+50.00 tCTC",
    status: "SUCCESS"
  },
  {
    id: "ACT-02",
    type: "PROOF_GENERATED",
    title: "Attestcoin Inclusion Proof Mined",
    description: "Merkle inclusion proof verified for Ethereum Sepolia block #6,841,209.",
    timestamp: "6 mins ago",
    wallet: "0xAttest...Oracle",
    txHash: "0x4fe1...921b",
    status: "SUCCESS"
  },
  {
    id: "ACT-03",
    type: "DELIVERY_COMPLETED",
    title: "Water Kit Milestone Inscribed",
    description: "Node Alpha delivered 200 water purification kits to Brahmaputra North.",
    timestamp: "12 mins ago",
    wallet: "0xNode...Alpha",
    txHash: "0x8a9f...c421",
    status: "SUCCESS"
  },
  {
    id: "ACT-04",
    type: "REWARD_RELEASED",
    title: "Escrow Milestone Reward Dispatched",
    description: "48.00 tCTC released from AidDeliveryEscrow to Node Alpha.",
    timestamp: "12 mins ago",
    wallet: "0xEscrow...Vault",
    txHash: "0x33b1...77a8",
    amount: "+48.00 tCTC",
    status: "SUCCESS"
  },
  {
    id: "ACT-05",
    type: "DUPLICATE_REJECTED",
    title: "Duplicate Delivery Claim Rejected",
    description: "Used proof hash 0x8a9f...c421 resubmission was intercepted and reverted.",
    timestamp: "18 mins ago",
    wallet: "0xMalicious...Actor",
    txHash: "0xREVERT...0000",
    status: "BLOCKED"
  }
];

export const INITIAL_PROOFS: CrossChainProof[] = [
  {
    proofId: "PRF-SEPOLIA-CC3-001",
    sourceChain: "Ethereum Sepolia",
    sourceTxHash: "0x4f82a938c1192837482937461928374619283746192837461928374619283746",
    sourceBlock: 6841209,
    donor: "0x71C8391264b19283746192837461928374614f92",
    amount: "50.00 tCTC equivalent",
    attestcoinOracle: "0xGluwaAttestcoinOraclePrecompileCC3_000001",
    merkleRoot: "0x981247b912c48192837461928374619283746192837461928374619283746192",
    destinationChain: "Creditcoin CC3 Testnet",
    destinationTxHash: "0xcc39182736481928374619283746192837461928374619283746192837461928",
    timestamp: "2026-09-11 22:45:10 UTC",
    verified: true
  }
];
