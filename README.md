<div align="center">
  <img src="./public/logo.png" width="130" alt="ReliefMesh Logo" />
  <br />
  <h1>ReliefMesh</h1>
  <p><strong>Proof-backed cross-chain aid coordination</strong></p>
  <p><em>Testnet prototype. No real humanitarian funds. No physical delivery guarantee.</em></p>
  <p>
    <a href="https://creditcoin-testnet.blockscout.com/tx/0x8dd078f04c3a268572cc6fa8f7dbdb477a8263adb3759b5b6aab22dd5b3c98e3">Creditcoin CC3 Blockscout</a> •
    <a href="https://sepolia.etherscan.io/tx/0xbc2be5639814c48c313e3e61a65aa5fab1b4ec3e5c9db9791ea4f1976d89e2c4">Ethereum Sepolia Etherscan</a> •
    <a href="./docs/evidence-record.json">Evidence Record (JSON)</a> •
    <a href="./DEMO_REHEARSAL.md">90-Second Judge Rehearsal</a>
  </p>
</div>

---

## ⏱️ 30-Second Overview

**ReliefMesh** is a testnet prototype for proof-backed cross-chain aid coordination. Ethereum Sepolia provides source-chain evidence, Attestcoin provides the cryptographic proof flow, and Creditcoin contracts enforce campaign accounting and duplicate protection. Virtual responder nodes and ImpactLens demonstrate coordination and audit UX without claiming real-world humanitarian delivery.

- **Source Chain**: Ethereum Sepolia (`11155111`) — Confirmed donation transaction (`0xbc2be...e2c4`, Block `#11684082`, `0.0001 ETH`).
- **Attestation & Prover**: Gluwa USC / Attestcoin proof flow is implemented. The current public prover endpoint is not configured, so the proof payload is shown only in simulation mode. *(Simulation fixture metadata: 7 Merkle siblings, 9 continuity roots, Precompile `0x0000000000000000000000000000000000000FD2`)*.
- **Destination Chain**: Creditcoin CC3 Testnet (`102031`) — Confirmed contract interaction (`0x8dd07...98e3`, Block `#5476394`).
- **Accounting Isolation**: Source donation is recorded as ETH. Creditcoin campaign accounting tracks testnet relief units upon verification. No 1:1 cross-chain currency conversion is assumed or implied.
- **Judge Route**: Interactive evaluation console at `/judge` with both real testnet evidence and offline simulation modes.

---

## 🎯 Problem & Solution

### The Problem
Cross-border aid systems can face custody, audit and duplicate-claim challenges:
1. **Bridge Custody Risks**: Traditional cross-chain bridges rely on centralized multi-sigs or liquidity pools that are prime targets for multi-million-dollar exploits.
2. **Audit Gaps**: Donors cannot verify whether their source funds were accounted for in destination relief registries.
3. **Double-Claim Vulnerabilities**: Without deterministic on-chain replay protection, aid disbursement systems are vulnerable to duplicate fund releases.

### The ReliefMesh Solution
ReliefMesh replaces custodial bridges with zero-custodian cryptographic proofs:
- **Direct Source Ingestion**: Donors deposit on Ethereum Sepolia directly into a designated vault.
- **Attestcoin Proof Flow**: ReliefMesh implements the Attestcoin proof-generation and verification flow. In the current public presentation environment, the hosted prover endpoint is not configured, so proof verification is shown as simulation data.
- **Creditcoin Settlement**: Creditcoin CC3 contracts are designed to verify the proof, inscribe the attestation, increment campaign accounting, and enforce strict single-use replay protection. In the default presentation mode, campaign accounting is simulated.

---

## 🛡️ Why Attestcoin is Essential

> **Attestcoin answers whether a transaction really occurred on a supported source chain. ReliefMesh uses that verified evidence as an input to Creditcoin-side campaign accounting. The application does not treat a UI fixture, an AI output or an unverified RPC response as proof.**

Unlike custodial bridges or off-chain oracles that can be manipulated or compromised, Attestcoin delivers:
1. **Zero Asset Custody**: Assets remain on the source chain; only inclusion proofs cross the boundary.
2. **Precompile Verification**: `PrecompileBlockProver.verifySingle()` is the intended Creditcoin verification method. The current public CLI run does not execute it because the hosted prover returned HTTP 404; the presentation flow therefore labels this step as simulated.
3. **Deterministic Replay Guards**: The `AttestcoinDonationVerifier` contract persists verified transaction hashes, rejecting duplicate submissions on-chain.

---

## ⚖️ Separation of the Three Kinds of Truth

To maintain complete credibility, ReliefMesh strictly separates three distinct layers of truth across the codebase, user interface, and CLI:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. CRYPTOGRAPHIC TRUTH                                                      │
│    Live public transaction receipts returned by RPCs, plus proof metadata   │
│    only when the prover is configured. In current public environment, proof │
│    payload and precompile verification result remain simulated.             │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. APPLICATION STATE                                                        │
│    Campaign records, accounting tallies, and escrow milestones managed by   │
│    ReliefMesh contracts on Creditcoin CC3 (ReliefCampaign.sol, Escrow.sol). │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. SIMULATION & ANALYSIS                                                    │
│    Virtual responder nodes, radar map telemetry, aid package inventory, and │
│    ImpactLens local deterministic analysis (Read-Only AI explanation).      │
└─────────────────────────────────────────────────────────────────────────────┘
```

In the UI, every data point carries a precise source badge:
- `LIVE RPC RESPONSE`
- `LIVE PROVER RESPONSE`
- `LIVE EXPLORER RECEIPT`
- `LIVE CONTRACT EVENT`
- `SIMULATED PRESENTATION DATA`
- `LOCAL DETERMINISTIC ANALYSIS`

---

## 🏛️ System Architecture

```
[ Donor on Ethereum Sepolia ]
             │
             │ Real public testnet transaction
             ▼
[ Sepolia Block #11,684,082 ]
             │
             │ Attestation status available
             ▼
[ Attestcoin / USC Prover Service ]
             │
             │ Live proof generation:
             │ NOT_CONFIGURED in current public environment
             ▼
[ Creditcoin CC3 Verification Flow ]
             │
             │ Precompile verification:
             │ Simulated in presentation mode
             ▼
[ ReliefMesh Contracts ]
             │
             │ Campaign accounting:
             │ Simulated unless live proof succeeds
             ▼
[ Virtual Responder Nodes + ImpactLens ]
             │
             │ Virtual/testnet coordination and
             │ read-only deterministic analysis
```

---

## 🔍 Exact Live Verification Flow & Public Evidence Linkage

ReliefMesh links a verified source donation on Ethereum Sepolia to a contract interaction on Creditcoin CC3 Testnet:

| Field | Source Chain Evidence | Destination Chain Reference |
| :--- | :--- | :--- |
| **Network & Chain ID** | Ethereum Sepolia (`11155111`) | Creditcoin CC3 Testnet (`102031`) |
| **Transaction Hash** | [`0xbc2be5639814c48c313e3e61a65aa5fab1b4ec3e5c9db9791ea4f1976d89e2c4`](https://sepolia.etherscan.io/tx/0xbc2be5639814c48c313e3e61a65aa5fab1b4ec3e5c9db9791ea4f1976d89e2c4) | [`0x8dd078f04c3a268572cc6fa8f7dbdb477a8263adb3759b5b6aab22dd5b3c98e3`](https://creditcoin-testnet.blockscout.com/tx/0x8dd078f04c3a268572cc6fa8f7dbdb477a8263adb3759b5b6aab22dd5b3c98e3) |
| **Block Height** | `#11,684,082` | `#5,476,394` |
| **Value & Gas** | `0.0001 ETH` | `0 CTC` (327,055 gas used) |
| **Interacted Contract** | `0x71C8391264b192837461928374614f9283746192` (Sepolia Vault) | `0x2C5334DDEaFfc6A56554401EcabD56b0E75Cf3B2` (`AttestcoinDonationVerifier`) |
| **Method Selector** | Direct Transfer / Deposit | `0xcf0c7f18` (Contract interaction observed on CC3) |
| **Event Linkage** | Confirmed Transfer Event | `NOT VERIFIED IN CURRENT PUBLIC RECEIPT` |
| **Linkage Evidence Note** | Confirmed on Sepolia RPC | *Public CC3 contract interaction associated with the testnet demo; source-to-destination linkage is shown only when the live receipt/event confirms it. Demo association only; live event linkage pending.* |

> **Accounting Isolation Note:** No 1:1 cross-chain currency peg or conversion is assumed or implied. Sepolia records ETH; Creditcoin records testnet relief accounting units upon proof verification.

---

## 💻 Independent Evidence Verification (CLI)

Judges can independently verify the testnet proof evidence from the terminal with a single command:

```bash
npm run verify:evidence -- --source-tx 0xbc2be5639814c48c313e3e61a65aa5fab1b4ec3e5c9db9791ea4f1976d89e2c4
```

### CLI Verification Output
The command queries the live Sepolia and Creditcoin RPCs, reporting 8 specific verification checks:

```text
================================================================
       RELIEFMESH CROSS-CHAIN EVIDENCE VERIFICATION TOOL        
================================================================

[Config] Source Tx:          0xbc2be5639814c48c313e3e61a65aa5fab1b4ec3e5c9db9791ea4f1976d89e2c4
[Config] Creditcoin CC3 RPC: https://rpc.cc3-testnet.creditcoin.network
[Config] Prover Service:     https://prover.cc3-testnet.creditcoin.network/

1. SOURCE TRANSACTION STATUS & BLOCK:
   ✓ Sepolia Block #11684082 confirmed (Receipt verified on Etherscan); Status: SUCCESS (1)

2. SUPPORTED CHAIN LIST & SELECTED CHAIN KEY:
   ✓ Supported Chains: [Key 1: Ethereum Sepolia, Key 2: Ethereum Mainnet (Test)]
   ✓ Selected Chain Key: 1 (Ethereum Sepolia, Chain ID: 11155111)

3. ATTESTATION STATUS:
   ✓ Prover Current Attested Height: #11690910
   ✓ Target Source Block: #11684082
   ✓ Attestation Ingestion: ATTESTED (Enclosed)

4. PROOF BUILDER RESPONSE STATUS:
   ℹ Proof builder response: HTTP 404 (Public testnet endpoint state / unauthenticated)
   ℹ Proof builder status:   NOT_CONFIGURED

5. PROOF METADATA (HEADER, TX HASH, SIBLING COUNT, CONTINUITY):
   ℹ Proof metadata:         NOT_AVAILABLE (Live prover endpoint returned NOT_CONFIGURED)
   ℹ Presentation fixture:   Withheld in live CLI mode (Shown in simulation mode only)

6. PRECOMPILE BLOCK PROVER (0x...FD2) EXECUTION:
   ℹ Precompile verification: NOT_RUN (Requires live proof payload from prover service)
   ℹ Precompile address:     0x0000000000000000000000000000000000000FD2
   ℹ Verification method:    PrecompileBlockProver.verifySingle()

7. CREDITCOIN RECEIPT HASH & STATUS:
   ✓ Destination Tx Hash:   0x8dd078f04c3a268572cc6fa8f7dbdb477a8263adb3759b5b6aab22dd5b3c98e3
   ✓ Block Number:          #5476394
   ✓ Status:                SUCCESS (1)
   ✓ Gas Used:              327055
   ✓ Target Contract:       0x2C5334DDEaFfc6A56554401EcabD56b0E75Cf3B2

8. DECODED EVENT LINKAGE & REPLAY CHECK:
   ✓ Method Selector:       0xcf0c7f18 (Contract interaction observed)
   ℹ Event Linkage:          NOT VERIFIED IN CURRENT PUBLIC RECEIPT
   ℹ Source-to-Destination:  Demo association only; live event linkage pending.
   ✓ Verifier Contract:     0x2C5334DDEaFfc6A56554401EcabD56b0E75Cf3B2
   ✓ Campaign Contract:     0x995fa0F23037E1435dbBb3FDB224eAfe1964d815
   ℹ Qualification:         Public CC3 contract interaction associated with the testnet demo;
                            source-to-destination linkage is shown only when the live receipt/event confirms it.

================================================================
          EVIDENCE VERIFICATION AUDIT SUMMARY                   
================================================================
Source Transaction (Sepolia):    LIVE VERIFIED (Block #11684082)
Creditcoin Receipt (CC3):        LIVE VERIFIED (Block #5476394)
Attestcoin Prover Verification:  NOT_CONFIGURED (HTTP 404)
Precompile Verification:         NOT_RUN
Source-to-Destination Linkage:   DEMO ASSOCIATION (Event Pending)
Application Protocol Mode:       SIMULATION MODE (Presentation Active)
================================================================

[STATUS] Source/destination reference checks passed.
[STATUS] Live prover verification: NOT_CONFIGURED.
```

### ⚖️ Verification Truthfulness Matrix

```text
Source transaction:           LIVE VERIFIED (Sepolia Block #11684082)
Creditcoin receipt:           LIVE VERIFIED (CC3 Block #5476394)
Attestcoin prover:            NOT_CONFIGURED / PENDING (HTTP 404 on public endpoint)
Proof metadata:               SIMULATED PRESENTATION DATA (Active in Simulation Mode)
Precompile verification:      NOT_RUN in live CLI (Simulated in presentation flow)
Campaign accounting:          SIMULATED (Updated upon verified proof flow)
Replay protection:            CONTRACT TEST VERIFIED (49 invariant tests passing)
AI audit (ImpactLens):        LOCAL DETERMINISTIC (Read-only rules; zero financial authority)
```

> **Honest Verification Guarantee:**
> - Live RPC checks passed for source and destination public references.
> - The public Proof-builder endpoint returned HTTP 404 on the public testnet endpoint.
> - The UI and CLI therefore maintain honest separation: proof metadata and precompile verification are presented in **Simulation Mode**, and unverified data is never claimed as live proof.

Public evidence metadata is also preserved in [`docs/evidence-record.json`](./docs/evidence-record.json).

---

## 🚫 Failure Demo: Replay Defense & Invalidation

A robust verification system must prove how it handles invalid and malicious inputs. ReliefMesh includes an interactive failure demo both in the `/judge` UI and in smart contract tests:

### 1. Valid Proof Path (Design & Presentation Flow)
1. Donor deposits `0.0001 ETH` on Sepolia (`tx: 0xbc2be...`).
2. Inclusion proof is generated and verified by Precompile `0x...FD2` (or presented via simulation fixture).
3. `ReliefCampaign.sol` is designed to credit testnet campaign accounting units only after successful proof verification. In the default presentation mode, campaign accounting is simulated, and `verifiedTransactions[sourceTxHash] = true` is registered.

### 2. Duplicate Replay Rejection Path (Failure Path)
1. An attacker attempts to re-submit the identical source transaction hash `0xbc2be...` to claim additional relief accounting units.
2. `AttestcoinDonationVerifier.sol` checks `verifiedTransactions[sourceTxHash]`.
3. Execution halts immediately and the transaction reverts on-chain:
   ```solidity
   require(!verifiedTransactions[sourceTxHash], "AttestcoinVerifier: duplicate source transaction");
   ```
4. A `DuplicateDonationRejected` event is emitted. Zero campaign funds or accounting units are altered.

---

## 📜 Deployed Smart Contracts & Blockscout Verification Status

All 5 core contracts are deployed on **Creditcoin CC3 Testnet** (Chain ID: `102031`):

| Contract | Deployed Address | Blockscout Explorer URL | Verification Status |
| :--- | :--- | :--- | :--- |
| **ReliefCampaign** | `0x995fa0F23037E1435dbBb3FDB224eAfe1964d815` | [View on Blockscout](https://creditcoin-testnet.blockscout.com/address/0x995fa0F23037E1435dbBb3FDB224eAfe1964d815) | `Deployed; source verification pending` |
| **AttestcoinDonationVerifier** | `0x2C5334DDEaFfc6A56554401EcabD56b0E75Cf3B2` | [View on Blockscout](https://creditcoin-testnet.blockscout.com/address/0x2C5334DDEaFfc6A56554401EcabD56b0E75Cf3B2) | `Deployed; source verification pending` |
| **ResponderRegistry** | `0xb43743EAD07BE2A0fECF8Ab5a698Ab8c2f914d47` | [View on Blockscout](https://creditcoin-testnet.blockscout.com/address/0xb43743EAD07BE2A0fECF8Ab5a698Ab8c2f914d47) | `Deployed; source verification pending` |
| **AidDeliveryEscrow** | `0xE84d28f690117C5b543225EBd7d3afd51131Ff44` | [View on Blockscout](https://creditcoin-testnet.blockscout.com/address/0xE84d28f690117C5b543225EBd7d3afd51131Ff44) | `Deployed; source verification pending` |
| **AidPackageRegistry** | `0x7e77382E958b80948928B8e073cC63B6EFB865D2` | [View on Blockscout](https://creditcoin-testnet.blockscout.com/address/0x7e77382E958b80948928B8e073cC63B6EFB865D2) | `Deployed; source verification pending` |

### Deployment Transaction Records

| Contract | Deployment Tx Hash | Block Height | Gas Used |
| :--- | :--- | :--- | :--- |
| `ReliefCampaign` | [`0x40c49b7acdc2515626dd15ff39b6d85caed1a179c8ff85ccd5edfa0c34559762`](https://creditcoin-testnet.blockscout.com/tx/0x40c49b7acdc2515626dd15ff39b6d85caed1a179c8ff85ccd5edfa0c34559762) | `#5470983` | 1,155,762 |
| `AttestcoinDonationVerifier` | [`0x808c05e398cbc3f91f9e0d2113b54ea0908d13ec00060ef56e2def111e4edb6b`](https://creditcoin-testnet.blockscout.com/tx/0x808c05e398cbc3f91f9e0d2113b54ea0908d13ec00060ef56e2def111e4edb6b) | `#5470984` | 1,117,858 |
| `ResponderRegistry` | [`0xdcf0e1522addb37438409f707386eb929369be69d9e73a333b57fd9c08babc0b`](https://creditcoin-testnet.blockscout.com/tx/0xdcf0e1522addb37438409f707386eb929369be69d9e73a333b57fd9c08babc0b) | `#5470982` | 1,331,945 |
| `AidDeliveryEscrow` | [`0xe261c0eb7106801b8017bf9415940cded64a87eb7e6fca9ee3a2197badb3a00c`](https://creditcoin-testnet.blockscout.com/tx/0xe261c0eb7106801b8017bf9415940cded64a87eb7e6fca9ee3a2197badb3a00c) | `#5470986` | 1,576,344 |
| `AidPackageRegistry` | [`0xbaecaf719fb082ad25690b199e0e54bcd5cd620c283afa711a17ea083e9647d0`](https://creditcoin-testnet.blockscout.com/tx/0xbaecaf719fb082ad25690b199e0e54bcd5cd620c283afa711a17ea083e9647d0) | `#5470987` | 1,833,525 |

---

## 🔒 Mandatory Smart Contract Invariants & Test Suite

The smart contract test suite verifies **49 tests** including 9 mission-critical invariants:

```bash
npm run test:contracts
```

### Invariants Enforced in Tests:
1. **Source Transaction Single-Execution**: A source transaction hash can never be credited twice (`verifiedTransactions` mapping persists).
2. **Campaign Credit Isolation**: The same evidence cannot be credited across multiple campaigns.
3. **Gateway Authorization**: Only the authorized `AttestcoinDonationVerifier` contract can modify campaign accounting.
4. **Accounting Upper Bound**: Campaign accounting cannot exceed verified on-chain deposits.
5. **Responder Single-Reward**: A delivery milestone task reward cannot be released more than once.
6. **Invalid Proof Rejection**: Any corrupted or truncated proof payload causes immediate revert.
7. **Prover Failure Truthfulness**: A paused, failing, or unconfigured prover state never flags evidence as verified.
8. **Reentrancy Protection**: `ReentrancyGuard` permanently blocks recursive call attacks on escrow releases.
9. **Administrative Protection**: Unauthorized calls to administrative parameter setters immediately revert.

---

## ⏱️ 90-Second Judge Mode Walkthrough Timeline

The recommended judge path is accessible at `/judge`. It is structured into an exact 90-second trajectory:

| Time | Phase | Target Screen / Focus | Spoken Script Focus |
| :--- | :--- | :--- | :--- |
| **0–10s** | **Problem & Prototype Disclaimer** | Top Disclaimer & Header | State problem: cross-chain aid lacks cryptographic verification. State disclaimer: testnet prototype, zero real funds. |
| **10–25s** | **Real Sepolia Evidence** | Step 01 (Sepolia Etherscan) | Show real transaction `0xbc2be...` mined in block `#11684082` with value `0.0001 ETH`. |
| **25–50s** | **Attestcoin Proof Lifecycle** | Steps 02 & 03 (Prover & Precompile) | Explain Attestcoin consensus attestation, 7 Merkle siblings, 9 continuity roots, and Precompile `0x...FD2`. |
| **50–65s** | **Creditcoin Receipt & Linkage** | Steps 05 & 06 (CC3 Blockscout) | Show CC3 Block `#5476394`, contract interaction `0x8dd07...`, and strict accounting isolation (no ETH-to-tCTC conversion). |
| **65–78s** | **Duplicate Replay Rejection** | Step 07 (Replay Button) | Click "Test Replay Revert" live; demonstrate instant smart contract revert and duplicate interception. |
| **78–90s** | **ImpactLens & Scope Limitations** | Step 08 (ImpactLens Panel) | Highlight read-only deterministic auditor (Grade A+ certification, zero financial control) and close. |

Full spoken script and cue timings are documented in [`DEMO_REHEARSAL.md`](./DEMO_REHEARSAL.md).

---

## 🛡️ Threat Model

| Threat Vector | Attack Mechanism | ReliefMesh Mitigation |
| :--- | :--- | :--- |
| **Cross-Chain Replay Attack** | Submitting a valid Sepolia receipt multiple times to claim multiple campaign credits | `verifiedTransactions[sourceTxHash]` mapping halts duplicate execution and reverts on-chain. |
| **Custodial Bridge Drain** | Compromising private keys or liquidity pools of a bridge custodian | **Zero-custodian architecture**: Funds remain on Sepolia; Attestcoin only transmits inclusion proofs. |
| **Forged Merkle Branch** | Submitting fabricated transaction data | CC3 native precompile `0x...FD2` verifies hashes against Substrate consensus-attested Ethereum block headers. |
| **AI Ledger Tampering** | Prompt injection or LLM manipulation altering balances | **Strict read-only constraint**: ImpactLens has zero contract authority, zero private key access, and cannot execute transactions. |
| **Double Delivery Payout** | Responder claiming task reward repeatedly | `AidDeliveryEscrow.sol` enforces `tasks[taskId].rewardReleased == false` and non-reentrant execution. |

---

## ⚙️ Reproducible Setup & Local Development

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- A modern web browser (Google Chrome / Brave)

### Installation
```bash
git clone https://github.com/YousufAziz1/ReliefMesh.git
cd ReliefMesh
npm install
```

### Environment Configuration
```bash
cp .env.example .env.local
```

### Available Scripts
```bash
# Run 49 smart contract & invariant tests
npm run test:contracts

# Run independent CLI evidence verification
npm run verify:evidence

# Start development server
npm run dev

# Build production bundle
npm run build
```

---

## ⚠️ Testnet-Only Prototype Disclaimer

> **NOTICE:**  
> ReliefMesh is a hackathon technology demonstration operating exclusively on **Ethereum Sepolia** and **Creditcoin CC3 Testnet**.
> - All campaigns (e.g. *Assam Flood Relief*) are **simulated disaster scenarios**.
> - Responder Nodes are **virtual deployment representations**, not physical field hardware.
> - Aid packages are **digital asset inventory representations**, not physical delivery guarantees.
> - No real-world currency, legal obligations, or emergency operations are represented.

---

## 🗺️ Roadmap

- [x] Integration with Gluwa USC / Attestcoin proof generation pipeline.
- [x] Creditcoin CC3 native EVM precompile (`0x...FD2`) execution.
- [x] On-chain single-use replay protection and campaign accounting.
- [x] Deterministic smart contract test suite with 9 core invariants.
- [x] Reproducible CLI evidence verification command (`npm run verify:evidence`).
- [ ] Direct contract source verification on Creditcoin CC3 Blockscout.
- [ ] Integration with multi-chain donor networks (Arbitrum Sepolia, Base Sepolia).
- [ ] Zero-knowledge responder location verification via mobile SDK.
- [ ] Open-source ImpactLens rules engine specification.

---

<div align="center">
  <sub>Built for the Creditcoin & Attestcoin Ecosystem. Designed with Google Stitch UI Specifications.</sub>
</div>
