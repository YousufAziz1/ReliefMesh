# 3-Minute Hackathon Demo Rehearsal Script

Use this exact timing, mode-selection guide, and spoken narrative when pitching ReliefMesh to judges or recording an evaluation video.

---

## Mode Selection Guide

ReliefMesh provides an interactive **Mode Selector** in the persistent header:

| Mode | Header Indicator | Ideal For | Behavior |
| :--- | :--- | :--- | :--- |
| **DEMO / SIMULATION MODE** | `🧪 SIMULATION ACTIVE` | Rapid 3-minute pitch, offline review, judging walkthroughs | Deterministic 6-step verification, mock scenario buttons (`Duplicate Replay`, `Gas Reversion`), zero testnet gas needed |
| **REAL TESTNET MODE** | `🌐 REAL TESTNET` | Live blockchain validation, technical audits | Real Wagmi wallet connection, real SepoliaETH transactions, `@gluwa/usc-sdk` proof builder, live CC3 settlement |

---

## 3-Minute Pitch Script

### Minute 0:00 - 0:45: The Problem & Stitch Visual System
- **Active Route**: `/` (Protocol Overview)
- **Header State**: `SIMULATION ACTIVE` (or `REAL TESTNET` if showing MetaMask)
- **Spoken Pitch**:
  > "Traditional humanitarian aid takes days to clear banking rails, loses up to 30% to administrative leakage, and lacks transparent on-chain accounting.
  > ReliefMesh is an autonomous cross-chain aid routing network connecting Ethereum Sepolia to Creditcoin CC3 Testnet using Attestcoin consensus proofs.
  > Notice our interface: it strictly adheres to the approved Google Stitch visual system—clean white cards, charcoal typography, and an enterprise teal accent, without generic dark mode crypto clutter."

---

### Minute 0:45 - 1:30: Cross-Chain Donation Pipeline & Attestcoin
- **Active Route**: `/donations` (Donation Console)
- **Action**:
  - **In Demo Mode**: Click `✓ Simulate Success` to show the full 6-step pipeline in 3 seconds. Then click `⚠ Duplicate Replay` to demonstrate instant rejection of replayed hashes.
  - **In Real Testnet Mode**: Click `Send Testnet Donation`, sign the real transaction in MetaMask on Ethereum Sepolia, and show the real block confirmation and Etherscan link.
- **Spoken Pitch**:
  > "When a donor contributes on Ethereum Sepolia, instead of trusting a centralized multisig bridge, Gluwa's Attestcoin engine builds a cryptographic storage inclusion proof against the Sepolia block header.
  > Watch our 6-step verification pipeline: source broadcast, block attestation, inclusion proof generation, Creditcoin CC3 contract inscription, and treasury accounting credit.
  > If someone attempts to re-submit an existing transaction hash, the smart contract intercepts it with mathematical replay defense."

---

### Minute 1:30 - 2:15: Virtual Responder Nodes & Milestone Escrow
- **Active Route**: `/responders`
- **Action**: Inspect the 3 Virtual Responder Nodes (NODE-ALPHA, NODE-BETA, NODE-GAMMA), then view the **AidDeliveryEscrow** panel. Click `Test Duplicate Claim` to prove that replay attempts are rejected.
- **Spoken Pitch**:
  > "In the field, virtual responder nodes coordinate humanitarian package delivery.
  > Once a delivery is verified, the responder submits a SHA-256 evidence proof hash to `AidDeliveryEscrow.sol` on Creditcoin CC3.
  > The contract verifies the responder is registered and active, checks that the proof hash has never been used, and releases a bounded testnet reward.
  > Clicking 'Test Duplicate Claim' demonstrates that second claims for the same delivery are immediately rejected by the contract."

---

### Minute 2:15 - 3:00: ImpactLens AI & Judge Mode Walkthrough
- **Active Route**: `/judge`
- **Action**: Click `START 3-MINUTE DEMO` and use the `Next Step` button to walk through all 8 protocol checkpoints.
- **Spoken Pitch**:
  > "Finally, ImpactLens AI provides deterministic, read-only analytical evaluation of our ledger and evidence streams. It detects anomalies and audits compliance without ever having custody over treasury funds.
  > Judges can run our built-in 8-step Judge Mode anytime to audit every smart contract address, Merkle proof, and state transition.
  > ReliefMesh proves that humanitarian aid can be fast, cross-chain, and mathematically fraud-resistant."
