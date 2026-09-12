<div align="center">
  <img src="./public/logo.png" width="120" alt="ReliefMesh Logo" />
  <br />
</div>

# ReliefMesh — Verified Cross-Chain Aid Network

> **TESTNET INTEGRATED PROTOCOL & SIMULATION MVP**  
> *Non-commercial Web3 humanitarian aid liquidity routing demonstration. Built on Google Stitch UI/UX design specifications.*

---

## 🌍 Overview

**ReliefMesh** is a testnet prototype for proof-backed cross-chain aid coordination connecting **Ethereum Sepolia** and **Creditcoin CC3 Testnet** via **Attestcoin (Gluwa USC)** inclusion proofs. It demonstrates how Attestcoin can verify source-chain evidence while Creditcoin contracts enforce campaign accounting and duplicate protection.

When disasters occur, emergency funding must move with mathematical speed, zero custodial bridge risk, and cryptographic accountability. ReliefMesh delivers:

1. **Cross-Chain Attestation**: Donors contribute on Ethereum Sepolia; inclusion proofs are mined by Attestcoin without bridge custodians.
2. **Consensus Settlement**: Campaign accounting is inscribed on Creditcoin CC3 Testnet (`ReliefCampaign.sol`).
3. **Milestone Escrow**: Testnet rewards are released to virtual responder nodes upon valid delivery proof hash submission (`AidDeliveryEscrow.sol`).
4. **Mathematical Replay Protection**: Duplicate transactions and duplicate delivery claims are permanently blocked on-chain.
5. **ImpactLens AI**: A deterministic, read-only analytical auditor that evaluates network health and evidence without financial control.

---

## Live integration status

The application has two modes:

### Simulation mode

Simulation mode is enabled by default for offline judging. It uses clearly labelled simulated states and never presents them as live on-chain verification.

### Live testnet mode

Live mode requires:

- A funded Creditcoin CC3 relayer wallet
- A valid Creditcoin RPC endpoint
- A supported Ethereum Sepolia RPC
- The current Attestcoin/USC proof-builder endpoint
- Any authentication credential required by the currently deployed prover service

If the prover service returns an authentication error, the application stops at `NOT CONFIGURED` and does not display `VERIFIED`.

No simulated state is claimed as a real Attestcoin verification.

Live prover integration is implemented but currently requires environment credentials that are not included in this public repository.

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
| `GLUWA_PROVER_API_KEY` | **Server (Optional)** | Optional authentication key if hosted prover requires credentials (not required for standard public endpoint) |
| `SOURCE_ARCHIVE_RPC_URL` | **Server (Optional)** | Archive node on Ethereum Sepolia for raw Merkle proofs |

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

## 📜 Deployed Smart Contracts (`contracts/src/`) & Live Testnet Addresses

All 5 core contracts are compiled with Solidity `^0.8.20` and deployed on **Creditcoin CC3 Testnet** (Chain ID: `102031`):

| Contract | Address | Explorer |
|---|---|---|
| ReliefCampaign | `0x995fa0F23037E1435dbBb3FDB224eAfe1964d815` | [`creditcoin-testnet.blockscout.com/address/0x995fa0F23037E1435dbBb3FDB224eAfe1964d815`](https://creditcoin-testnet.blockscout.com/address/0x995fa0F23037E1435dbBb3FDB224eAfe1964d815) |
| AttestcoinDonationVerifier | `0x2C5334DDEaFfc6A56554401EcabD56b0E75Cf3B2` | [`creditcoin-testnet.blockscout.com/address/0x2C5334DDEaFfc6A56554401EcabD56b0E75Cf3B2`](https://creditcoin-testnet.blockscout.com/address/0x2C5334DDEaFfc6A56554401EcabD56b0E75Cf3B2) |
| ResponderRegistry | `0xb43743EAD07BE2A0fECF8Ab5a698Ab8c2f914d47` | [`creditcoin-testnet.blockscout.com/address/0xb43743EAD07BE2A0fECF8Ab5a698Ab8c2f914d47`](https://creditcoin-testnet.blockscout.com/address/0xb43743EAD07BE2A0fECF8Ab5a698Ab8c2f914d47) |
| AidDeliveryEscrow | `0xE84d28f690117C5b543225EBd7d3afd51131Ff44` | [`creditcoin-testnet.blockscout.com/address/0xE84d28f690117C5b543225EBd7d3afd51131Ff44`](https://creditcoin-testnet.blockscout.com/address/0xE84d28f690117C5b543225EBd7d3afd51131Ff44) |
| AidPackageRegistry | `0x7e77382E958b80948928B8e073cC63B6EFB865D2` | [`creditcoin-testnet.blockscout.com/address/0x7e77382E958b80948928B8e073cC63B6EFB865D2`](https://creditcoin-testnet.blockscout.com/address/0x7e77382E958b80948928B8e073cC63B6EFB865D2) |

### Deployment Transactions (Creditcoin CC3 Testnet)

| Contract | Deployment Tx Hash | Block Height |
|---|---|---|
| ReliefCampaign | [`0x40c49b7acdc2515626dd15ff39b6d85caed1a179c8ff85ccd5edfa0c34559762`](https://creditcoin-testnet.blockscout.com/tx/0x40c49b7acdc2515626dd15ff39b6d85caed1a179c8ff85ccd5edfa0c34559762) | `#5470983` |
| AttestcoinDonationVerifier | [`0x808c05e398cbc3f91f9e0d2113b54ea0908d13ec00060ef56e2def111e4edb6b`](https://creditcoin-testnet.blockscout.com/tx/0x808c05e398cbc3f91f9e0d2113b54ea0908d13ec00060ef56e2def111e4edb6b) | `#5470984` |
| ResponderRegistry | [`0xdcf0e1522addb37438409f707386eb929369be69d9e73a333b57fd9c08babc0b`](https://creditcoin-testnet.blockscout.com/tx/0xdcf0e1522addb37438409f707386eb929369be69d9e73a333b57fd9c08babc0b) | `#5470982` |
| AidDeliveryEscrow | [`0xe261c0eb7106801b8017bf9415940cded64a87eb7e6fca9ee3a2197badb3a00c`](https://creditcoin-testnet.blockscout.com/tx/0xe261c0eb7106801b8017bf9415940cded64a87eb7e6fca9ee3a2197badb3a00c) | `#5470986` |
| AidPackageRegistry | [`0xbaecaf719fb082ad25690b199e0e54bcd5cd620c283afa711a17ea083e9647d0`](https://creditcoin-testnet.blockscout.com/tx/0xbaecaf719fb082ad25690b199e0e54bcd5cd620c283afa711a17ea083e9647d0) | `#5470987` |

---

## 🏆 Verified End-to-End Testnet Proof Reference

- **Sepolia Source Transaction**: [`0xbc2be5639814c48c313e3e61a65aa5fab1b4ec3e5c9db9791ea4f1976d89e2c4`](https://sepolia.etherscan.io/tx/0xbc2be5639814c48c313e3e61a65aa5fab1b4ec3e5c9db9791ea4f1976d89e2c4) (Block `#11684082`, `0.0001 ETH`)
- **Creditcoin CC3 Inscription**: [`0x8dd078f04c3a268572cc6fa8f7dbdb477a8263adb3759b5b6aab22dd5b3c98e3`](https://creditcoin-testnet.blockscout.com/tx/0x8dd078f04c3a268572cc6fa8f7dbdb477a8263adb3759b5b6aab22dd5b3c98e3) (Block `#5476394`)
- **Creditcoin Verification Result**: Confirmed on CC3 block `#5476394` via `AttestcoinDonationVerifier.sol` (available in the live application when the configured relayer and prover are active).
- **Asset Accounting Separation**: Source-chain evidence is `0.0001 ETH on Ethereum Sepolia`. Creditcoin campaign accounting records testnet units upon successful proof verification. No ETH-to-tCTC conversion is assumed or implied.
- **CC3 Native Precompile**: `0x0000000000000000000000000000000000000FD2` (`PrecompileBlockProver`)
- **Official CC3 Prover**: `https://prover.cc3-testnet.creditcoin.network/`
- **Replay Protection**: Verified on-chain (`AttestcoinVerifier: duplicate source transaction`)
- **ImpactLens Engine**: Read-only deterministic audit engine with optional AI explanation layer (no transaction authority).
- **Interactive 3-Minute Judge Mode**: Route `/judge` with rehearsal script in [`DEMO_REHEARSAL.md`](./DEMO_REHEARSAL.md)

---

## ⚠️ Testnet & Simulation Disclaimer

> **IMPORTANT DISCLAIMER:**  
> This protocol is a hackathon technology demonstration operating on **Ethereum Sepolia** and **Creditcoin CC3 Testnet**.
> - All campaigns (e.g. *Assam Flood Relief*) are **simulated testnet scenarios**.
> - Responder Nodes are **virtual deployment representations**, not physical DePIN devices.
> - Aid packages are **RWA digital inventory records**, not physical delivery guarantees or legal claims.
> - No real-world currency, legal obligations, or emergency operations are represented.
