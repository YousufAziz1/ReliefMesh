# ReliefMesh — 3-Minute Hackathon Demo Script & Judge Rehearsal Guide

**Project**: ReliefMesh (Cross-Chain Humanitarian Aid Protocol with Attestcoin & Creditcoin CC3)  
**Target Duration**: Exactly 3 Minutes (180 Seconds)  
**Live Demo Route**: `/judge` (Interactive Judge Mode)  
**Production URL / Localhost**: `http://localhost:3000/judge`

---

## Judge View Summary (Cheat Sheet for Presenter)

| Component | Target Architecture | Real On-Chain Evidence / Live Reference | Status |
|---|---|---|---|
| **Ethereum Sepolia** | Source Donor Network | Tx: [`0xbc2be5639814c48c313e3e61a65aa5fab1b4ec3e5c9db9791ea4f1976d89e2c4`](https://sepolia.etherscan.io/tx/0xbc2be5639814c48c313e3e61a65aa5fab1b4ec3e5c9db9791ea4f1976d89e2c4) (Block `#11684082`, `0.0001 ETH`) | **CONFIRMED REAL** |
| **Attestcoin / USC** | Gluwa Universal Settlement | CC3 Prover Attestation `#11684090` (`https://prover.cc3-testnet.creditcoin.network/`), 7 Merkle siblings, 9 continuity roots | **CONFIRMED REAL** |
| **Creditcoin CC3** | Consensus & Inscription | Precompile `0x0000000000000000000000000000000000000FD2`, Inscription Tx: [`0x8dd078f04c3a268572cc6fa8f7dbdb477a8263adb3759b5b6aab22dd5b3c98e3`](https://creditcoin-testnet.blockscout.com/tx/0x8dd078f04c3a268572cc6fa8f7dbdb477a8263adb3759b5b6aab22dd5b3c98e3) (Block `#5476394`) | **CONFIRMED REAL** |
| **Campaign Accounting** | ReliefCampaign Registry | Campaign #1: *"Assam Flood Relief — Testnet Simulation"*, Accounting: testnet units recorded upon verification; no ETH-to-tCTC peg assumed; Donors: `1` | **CONFIRMED REAL** |
| **Duplicate Protection**| Replay Attack Defense | Revert String: `"AttestcoinVerifier: duplicate source transaction"`, Replay attempt blocked on-chain | **CONFIRMED REAL** |
| **ImpactLens** | Deterministic Auditor | Read-only deterministic audit engine with optional AI explanation layer (0 ledger discrepancies, Grade A+ certificate) | **CONFIRMED REAL** |

---

## Exact 3-Minute Spoken Pitch Script

### [0:00 – 0:20] THE PROBLEM (20 seconds)
> *"Judges, over $30 billion is donated annually to humanitarian relief, but cross-border emergency distribution lacks cryptographic verification and ledger transparency between donor chains and local relief registries.*  
> *Donors on Ethereum have no verifiable cryptographic proof that their funds were reconciled, while field relief records frequently lack on-chain provenance."*

---

### [0:20 – 0:45] THE ARCHITECTURE (25 seconds)
> *"Introducing **ReliefMesh**: a testnet prototype for proof-backed cross-chain aid coordination.*  
> *It demonstrates how Attestcoin can verify source-chain evidence while Creditcoin contracts enforce campaign accounting and duplicate protection.*  
> *With ReliefMesh, donors contribute on Ethereum Sepolia. Using Gluwa Universal Settlement proofs and Creditcoin’s native EVM precompile, we cryptographically prove cross-chain inclusion without custodial bridge honeypots."*

---

### [0:45 – 1:20] SOURCE EVIDENCE & ATTESTCOIN (35 seconds)
*(Presenter navigates to `/judge` and points to Steps 01, 02, and 03)*
> *"Let's examine the real on-chain evidence live on testnet right now.*  
> *In Step 01, the source transaction is confirmed on Ethereum Sepolia: hash `0xbc2be...` mined into block `#11684082` with value 0.0001 ETH.*  
> *In Step 02, Creditcoin CC3 consensus attestation verified header continuity through block `#11684090`.*  
> *In Step 03, the official Gluwa ProofBuilder generated this 2,242-byte cryptographic Merkle inclusion proof with 7 sibling hashes and 9 continuity roots.*  
> *The application exposes the full Attestcoin proof lifecycle and halts at NOT CONFIGURED if live credentials are not active."*

---

### [1:20 – 1:50] CREDITCOIN SETTLEMENT & ACCOUNTING (30 seconds)
*(Presenter points to Steps 04, 05, and 06)*
> *"In Step 04, Creditcoin CC3’s native precompile contract at address `0x...FD2`—the `PrecompileBlockProver`—mathematically verified the inclusion proof on-chain and returned `true`.*  
> *In Step 05, the verification settled on Creditcoin CC3 testnet in block `#5476394`.*  
> *In Step 06, our `ReliefCampaign` contract updated campaign accounting. Notice the strict accounting isolation: no automatic ETH-to-tCTC conversion is assumed or implied—the campaign records testnet accounting units upon proof verification."*

---

### [1:50 – 2:15] DUPLICATE DEFENSE (25 seconds)
*(Presenter clicks 'Test Replay Revert' on Step 07)*
> *"The registry rejects duplicate source transactions for this campaign.*  
> *Watch what happens when we re-submit the already-verified transaction hash `0xbc2be...`: the smart contract immediately checks `verifiedTransactions` and reverts on-chain with the exact error:*  
> *`AttestcoinVerifier: duplicate source transaction`.*  
> *Execution halts, a `DuplicateDonationRejected` event is emitted, and the treasury remains completely secure."*

---

### [2:15 – 2:40] IMPACTLENS AUDITOR (25 seconds)
*(Presenter points to Step 08)*
> *"In Step 08, meet **ImpactLens**: our read-only deterministic audit engine.*  
> *ImpactLens operates under strict read-only constraints: it has zero transaction authority and cannot move funds.*  
> *Instead, it combines deterministic ledger verification rules with an optional AI explanation layer, confirming 100% ledger parity between Sepolia deposits and Creditcoin CC3 records."*

---

### [2:40 – 3:00] TESTNET PROTOTYPE CONCLUSION (20 seconds)
> *"To summarize: this is a testnet prototype demonstrating proof-backed cross-chain aid coordination.*  
> *All 5 contracts are deployed on Creditcoin CC3 testnet, integrated with Attestcoin consensus proofs and native precompiles.*  
> *Thank you, judges! We are now ready for your questions."*

---

## Live Demo Navigation Guide

1. Open `http://localhost:3000/judge`
2. Click **"Start 3-Minute Demo"** to initiate the auto-play timer or click individual step pills (`01` to `08`).
3. Notice the explicit source badges: **`LIVE EXPLORER RECEIPT`**, **`LIVE RPC`**, **`LIVE CONTRACT EVENT`**, and **`LOCAL DETERMINISTIC ANALYSIS`**.
4. Click the Etherscan and CC3 Blockscout links to inspect the transactions on public block explorers.
5. Click **"Test Replay Revert"** to demonstrate on-chain duplicate transaction rejection live in the browser.
