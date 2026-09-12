# ReliefMesh — Judge Rehearsal Guide & Demo Scripts

**Project**: ReliefMesh (Proof-backed cross-chain aid coordination with Attestcoin & Creditcoin CC3)  
**Primary Track**: 90-Second Rapid Judge Mode (Default Path)  
**Secondary Track**: 3-Minute Comprehensive Technical Review  
**Live Demo Route**: `/judge` (Interactive Judge Console)  
**Local / Preview URL**: `http://localhost:3000/judge`

---

## ⚡ Default Path: 90-Second Judge Pitch (Strict Hackathon Format)

Judges evaluate dozens of projects. The 90-second path gets directly to the core trust boundary without wasting time on generic navigation.

| Time Window | Focus Step | Visual on Screen (`/judge`) | Spoken Script (Word-for-Word) |
| :--- | :--- | :--- | :--- |
| **0:00 – 0:10** (10s) | **Header / Disclaimer** | Top Mode Banner & Testnet Notice | *"Judges, cross-border emergency aid coordination lacks cryptographic verification across chains. ReliefMesh is a testnet prototype for proof-backed cross-chain aid coordination. No real funds, no physical delivery guarantee."* |
| **0:10 – 0:25** (15s) | **Step 01: Sepolia Tx** | Step 01 card with Etherscan link | *"Here is the real source evidence on Ethereum Sepolia: transaction `0xbc2be...` mined into block `#11684082` depositing `0.0001 ETH`. Confirmed on public Etherscan with zero bridge custody."* |
| **0:25 – 0:50** (25s) | **Steps 02 & 03: Attestcoin** | Steps 02 & 03 cards (Prover & Roots) | *"The Ethereum Sepolia transaction and Creditcoin contract receipt are publicly verifiable testnet references. The hosted prover endpoint is not configured in this presentation environment, so proof metadata and precompile verification are shown as simulation states rather than being presented as live cryptographic proof."* |
| **0:50 – 1:05** (15s) | **Steps 05 & 06: CC3 State** | Steps 05 & 06 cards (Blockscout & Units) | *"On Creditcoin CC3, the contract interaction settled in block `#5476394`. Notice our strict accounting isolation: testnet relief units are credited upon proof verification—no 1:1 ETH-to-tCTC currency conversion is assumed or implied."* |
| **1:05 – 1:18** (13s) | **Step 07: Replay Defense** | Click **"Test Replay Revert"** button | *(Click button)* *"Watch our replay defense: when an attacker re-submits the exact same transaction hash, the smart contract intercepts it and immediately reverts on-chain with `AttestcoinVerifier: duplicate source transaction`. Replay is impossible."* |
| **1:18 – 1:30** (12s) | **Step 08: ImpactLens** | Step 08 card & parity audit | *"ImpactLens provides a read-only deterministic audit with zero financial authority. ReliefMesh demonstrates how source-chain evidence, Attestcoin proof flow and Creditcoin-side accounting can work together. This is a testnet prototype, not a live humanitarian fund or physical delivery system. Thank you!"* |

> **🌟 Best Pitch Positioning for Evaluators:**  
> *"ReliefMesh is a testnet prototype for proof-backed cross-chain aid coordination. It combines real public testnet transaction references with an explicit simulation/live separation and demonstrates how Attestcoin proof flow, Creditcoin accounting and replay protection can work together."*

---

## 📋 Judge View Summary (Evidence Cheat Sheet)

| Component | Target Architecture | Real On-Chain Evidence / Live Reference | Truth Status |
|---|---|---|---|
| **Ethereum Sepolia** | Source Donor Network | Tx: [`0xbc2be5639814c48c313e3e61a65aa5fab1b4ec3e5c9db9791ea4f1976d89e2c4`](https://sepolia.etherscan.io/tx/0xbc2be5639814c48c313e3e61a65aa5fab1b4ec3e5c9db9791ea4f1976d89e2c4) (Block `#11684082`, `0.0001 ETH`) | **LIVE VERIFIED** |
| **Creditcoin CC3** | Contract Interaction | Inscription Tx: [`0x8dd078f04c3a268572cc6fa8f7dbdb477a8263adb3759b5b6aab22dd5b3c98e3`](https://creditcoin-testnet.blockscout.com/tx/0x8dd078f04c3a268572cc6fa8f7dbdb477a8263adb3759b5b6aab22dd5b3c98e3) (Block `#5476394`) | **LIVE VERIFIED** |
| **Attestcoin Prover** | Gluwa Universal Settlement | Prover Endpoint: `https://prover.cc3-testnet.creditcoin.network/` (Public endpoint returns HTTP 404 in presentation environment) | **NOT_CONFIGURED / PENDING** |
| **Proof Metadata** | Merkle Branch & Continuity | 7 Merkle siblings, 9 continuity roots, Precompile `0x...FD2` reference | **SIMULATED PRESENTATION DATA** |
| **Campaign Accounting** | ReliefCampaign Registry | Campaign #1: *"Assam Flood Relief — Testnet Simulation"*, Accounting: testnet units recorded upon verification; no ETH-to-tCTC peg assumed; Donors: `1` | **SIMULATED** |
| **Duplicate Protection**| Replay Attack Defense | Revert String: `"AttestcoinVerifier: duplicate source transaction"`, Replay attempt blocked on-chain | **CONTRACT TEST VERIFIED** |
| **ImpactLens** | Deterministic Auditor | Read-only deterministic audit engine with optional AI explanation layer (0 ledger discrepancies, Grade A+ certificate) | **LOCAL DETERMINISTIC** |

---

## 🧭 Live Demo Navigation Tips for Presenter

1. Open `http://localhost:3000/judge`
2. Click **"Start 90-Second Demo"** to start the 1:30 countdown timer.
3. Show the prominent header banner:
   - `LIVE TESTNET MODE — DATA FROM CURRENT RPC/API RESPONSES` vs `SIMULATION MODE — OFFLINE PRESENTATION DATA; NOT LIVE VERIFICATION`
4. Hover over evidence values to show source badges:
   - `LIVE RPC RESPONSE`
   - `LIVE PROVER RESPONSE`
   - `LIVE EXPLORER RECEIPT`
   - `LIVE CONTRACT EVENT`
   - `LOCAL DETERMINISTIC ANALYSIS`
5. On Step 07, click **"Test Replay Revert"** live in front of the judge. The red badge and revert toast will demonstrate that duplicate transactions cannot penetrate the accounting layer.
6. Open terminal and run `npm run verify:evidence` if the judge requests an independent CLI audit.
