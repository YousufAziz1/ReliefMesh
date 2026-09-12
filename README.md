# ReliefMesh — Verified Cross-Chain Aid Network

> **TESTNET INTEGRATED PROTOCOL & SIMULATION MVP**  
> *Non-commercial Web3 humanitarian aid liquidity routing demonstration. Built on Google Stitch UI/UX design specifications.*

---

## 🌍 Overview

**ReliefMesh** is an autonomous cross-chain humanitarian aid coordination protocol connecting **Ethereum Sepolia** and **Creditcoin CC3 Testnet** via **Attestcoin (Gluwa USC)** inclusion proofs.

When disasters occur, emergency funding must move with mathematical speed, zero custodial bridge risk, and cryptographic accountability. ReliefMesh delivers:

1. **Cross-Chain Attestation**: Donors contribute on Ethereum Sepolia; inclusion proofs are mined by Attestcoin without bridge custodians.
2. **Consensus Settlement**: Campaign accounting is inscribed on Creditcoin CC3 Testnet (`ReliefCampaign.sol`).
3. **Milestone Escrow**: Testnet rewards are released to virtual responder nodes upon valid delivery proof hash submission (`AidDeliveryEscrow.sol`).
4. **Mathematical Replay Protection**: Duplicate transactions and duplicate delivery claims are permanently blocked on-chain.
5. **ImpactLens AI**: A deterministic, read-only analytical auditor that evaluates network health and evidence without financial control.

---

## 🔄 Dual Operating Modes: Demo vs Real Testnet

ReliefMesh provides an interactive **Mode Selector** in the persistent header:

```
[ 🧪 SIMULATION MODE (ACTIVE) ⇄ ]  <-- One-click toggle in header
```

### 1. DEMO / SIMULATION MODE (`DEMO_MODE=true`)
- **Purpose**: Built for rapid 3-minute hackathon judging, offline review, and dry-run evaluations without requiring live gas tokens or private API keys.
- **Features**: Guided 6-step cross-chain progression, 4 interactive test scenarios (`✓ Simulate Success`, `⚠ Duplicate Replay`, `⏳ Proof Pending`, `✕ Gas Reversion`), and an 8-step Judge Mode walkthrough at `/judge`.
- **Integrity**: Explicitly labeled `SIMULATION ACTIVE` with `isSimulated: true` tags.

### 2. REAL TESTNET MODE (`DEMO_MODE=false`)
- **Purpose**: Live cross-chain interaction with Ethereum Sepolia and Creditcoin CC3 Testnet.
- **Features**:
  - Real browser wallet connection (MetaMask/Wagmi) with chain detection, balance, and wrong-network switching.
  - Real `sendTransaction` broadcasts on Ethereum Sepolia, waiting for block mining and confirmation.
  - Server-side proof generation via `@gluwa/usc-sdk` (`/api/attestcoin/proof`).
  - Server-side relayer verification against `AttestcoinDonationVerifier.sol` on Creditcoin CC3 (`/api/creditcoin/verify`).
  - Strict **Status Truthfulness**: Never fakes `VERIFIED`. If live prover credentials or CC3 gas are missing, the UI truthfully halts at `NOT CONFIGURED` with explicit instructions.

---

## 🎨 Stitch Design Source of Truth

The user interface is faithfully translated from the approved **Google Stitch** design (`ReliefMesh Protocol Interface`, Project ID: `10856798789076284684`):

- **Palette**: White primary background (`#F8FAFC`), white cards (`#FFFFFF`), light gray borders (`#E2E8F0`), charcoal typography (`#0F172A`), and one restrained deep emerald/teal accent (`#0F766E` / `#0D9488`).
- **Zero AI Clutter**: No neon glow, no cyberpunk dark themes, and no generic crypto dashboard templates.

### Implemented Routes:
- `/` — **Protocol Overview**: Live telemetry, multi-segment fund vault routing, architecture pillars, 8-step lifecycle.
- `/campaigns` — **Campaign Operations & Coordination Map**: Assam Flood Relief simulation, interactive SVG radar map, evidence stream.
- `/responders` — **Responder Nodes & ImpactLens AI**: 3 virtual responder nodes, milestone escrow task verification, real-time AI audit panel.
- `/donations` — **Donation Console & Verification Pipeline**: Real Sepolia Web3 wallet donation flow & 6-step verification pipeline.
- `/proofs` — **Cryptographic Proofs**: Zero-custodian Merkle proof breakdown.
- `/packages` — **Aid Package Registry**: Representation tracking for Water Kits, Medical Kits, Food Rations.
- `/activity` — **Protocol Activity Stream**: Immutable chronologic event log.
- `/impact` — **ImpactLens Engine**: Deep-dive analytical health dashboard.
- `/judge` — **3-Minute Hackathon Judge Mode**: Guided 8-step walkthrough for competition evaluators.

---

## ⚙️ Quick Start & Local Development

### 1. Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- A Web3 browser wallet (MetaMask) with Ethereum Sepolia testnet configured

### 2. Installation
```bash
git clone <repo-url>
cd ReliefMesh
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

| Variable | Scope | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SOURCE_RPC_URL` | Public | Ethereum Sepolia RPC URL (default: `https://rpc.sepolia.org`) |
| `NEXT_PUBLIC_SOURCE_CHAIN_ID` | Public | Sepolia Chain ID (`11155111`) |
| `NEXT_PUBLIC_SEPOLIA_VAULT_ADDRESS` | Public | Target ReliefMesh vault address on Sepolia |
| `NEXT_PUBLIC_CREDITCOIN_RPC_URL` | Public | Creditcoin CC3 RPC (`https://rpc.cc3-testnet.creditcoin.network`) |
| `NEXT_PUBLIC_CREDITCOIN_CHAIN_ID` | Public | Creditcoin CC3 Chain ID (`102031`) |
| `NEXT_PUBLIC_PROOF_BUILDER_URL` | Public | Gluwa USC / Attestcoin Prover Endpoint |
| `NEXT_PUBLIC_RELIEF_CAMPAIGN_ADDRESS` | Public | Deployed `ReliefCampaign.sol` on CC3 |
| `NEXT_PUBLIC_ATTESTCOIN_VERIFIER_ADDRESS` | Public | Deployed `AttestcoinDonationVerifier.sol` on CC3 |
| `NEXT_PUBLIC_RESPONDER_REGISTRY_ADDRESS` | Public | Deployed `ResponderRegistry.sol` on CC3 |
| `NEXT_PUBLIC_AID_ESCROW_ADDRESS` | Public | Deployed `AidDeliveryEscrow.sol` on CC3 |
| `NEXT_PUBLIC_AID_PACKAGE_ADDRESS` | Public | Deployed `AidPackageRegistry.sol` on CC3 |
| `NEXT_PUBLIC_DEMO_MODE` | Public | `true` = guided simulation; `false` = live testnet enforcement |
| `BACKEND_PRIVATE_KEY` | **Server Only** | Relayer account funded with `tCTC` to pay gas on Creditcoin CC3 |
| `GLUWA_PROVER_API_KEY` | **Server Only** | Authenticated API key for Gluwa USC BlockProver |
| `SOURCE_ARCHIVE_RPC_URL` | **Server Only** | Archive node on Ethereum Sepolia for raw Merkle proofs |

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Automated Tests
```bash
npm run test:contracts
```
Executes 40 unit tests across contract logic, network validation, proof lifecycle, replay attack rejection, and status truthfulness.

### 6. Build Production Bundle
```bash
npm run build
```

---

## 📜 Smart Contracts (`contracts/src/`) & Live Testnet Deployments

All 5 core contracts are compiled with Solidity `^0.8.20` and deployed on **Creditcoin CC3 Testnet** (Chain ID: `102031`):

| Contract | Network | Live Address | Deployment Tx |
|---|---|---|---|
| **ReliefCampaign** | Creditcoin CC3 | [`0x995fa0F23037E1435dbBb3FDB224eAfe1964d815`](https://creditcoin-testnet.blockscout.com/address/0x995fa0F23037E1435dbBb3FDB224eAfe1964d815) | `0x40c49...` (Block #5470983) |
| **AttestcoinDonationVerifier** | Creditcoin CC3 | [`0x2C5334DDEaFfc6A56554401EcabD56b0E75Cf3B2`](https://creditcoin-testnet.blockscout.com/address/0x2C5334DDEaFfc6A56554401EcabD56b0E75Cf3B2) | `0x808c0...` (Block #5470984) |
| **ResponderRegistry** | Creditcoin CC3 | [`0xb43743EAD07BE2A0fECF8Ab5a698Ab8c2f914d47`](https://creditcoin-testnet.blockscout.com/address/0xb43743EAD07BE2A0fECF8Ab5a698Ab8c2f914d47) | `0xdcf0e...` (Block #5470982) |
| **AidDeliveryEscrow** | Creditcoin CC3 | [`0xE84d28f690117C5b543225EBd7d3afd51131Ff44`](https://creditcoin-testnet.blockscout.com/address/0xE84d28f690117C5b543225EBd7d3afd51131Ff44) | `0xe261c...` (Block #5470986) |
| **AidPackageRegistry** | Creditcoin CC3 | [`0x7e77382E958b80948928B8e073cC63B6EFB865D2`](https://creditcoin-testnet.blockscout.com/address/0x7e77382E958b80948928B8e073cC63B6EFB865D2) | `0xbaeca...` (Block #5470987) |

---

## 🏆 Verified End-to-End Testnet Proof Reference

- **Sepolia Source Transaction**: [`0xbc2be5639814c48c313e3e61a65aa5fab1b4ec3e5c9db9791ea4f1976d89e2c4`](https://sepolia.etherscan.io/tx/0xbc2be5639814c48c313e3e61a65aa5fab1b4ec3e5c9db9791ea4f1976d89e2c4) (Block `#11684082`, `0.0001 ETH`)
- **Creditcoin CC3 Inscription**: [`0x2fa48b69646672381fc1288d95ff96a92c2d39869bb1911c4dd2f158d7f8b75e`](https://creditcoin-testnet.blockscout.com/tx/0x2fa48b69646672381fc1288d95ff96a92c2d39869bb1911c4dd2f158d7f8b75e) (Block `#5471033`)
- **CC3 Native Precompile**: `0x0000000000000000000000000000000000000FD2` (`PrecompileBlockProver`)
- **Official CC3 Prover**: `https://prover.cc3-testnet.creditcoin.network/`
- **Replay Protection**: Verified on-chain (`AttestcoinVerifier: duplicate source transaction`)
- **Interactive 3-Minute Judge Mode**: Route `/judge` with rehearsal script in [`DEMO_REHEARSAL.md`](./DEMO_REHEARSAL.md)

---

## ⚠️ Testnet & Simulation Disclaimer

> **IMPORTANT DISCLAIMER:**  
> This protocol is a hackathon technology demonstration operating on **Ethereum Sepolia** and **Creditcoin CC3 Testnet**.
> - All campaigns (e.g. *Assam Flood Relief*) are **simulated testnet scenarios**.
> - Responder Nodes are **virtual deployment representations**, not physical DePIN devices.
> - Aid packages are **RWA digital inventory records**, not physical delivery guarantees or legal claims.
> - No real-world currency, legal obligations, or emergency operations are represented.
