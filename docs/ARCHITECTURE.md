# ReliefMesh Architecture Specification

## 1. High-Level Topology

```
+---------------------------+             +-------------------------------+
|     Ethereum Sepolia      |             |     Attestcoin Network        |
|  (Source Donation Layer)  |             |      (Gluwa USC Prover)       |
+-------------+-------------+             +---------------+---------------+
              |                                           |
              | 1. Donor sends testnet ETH                | 2. Mined block header
              |    emits Donation event                   |    extracts Merkle proof
              v                                           v
+-------------+-------------------------------------------+---------------+
|                                                                         |
|                     Creditcoin CC3 Testnet Consensus                    |
|                                                                         |
|   +---------------------------------+  Calls  +---------------------+   |
|   |   AttestcoinDonationVerifier    | ------> |    ReliefCampaign   |   |
|   | (Enforces 0 Replays + Evidence) |         | (Treasury Ledger)   |   |
|   +---------------------------------+         +----------+----------+   |
|                                                          |              |
|                                                 Routes   v              |
|   +---------------------------------+  Locks  +---------------------+   |
|   |        ResponderRegistry        | <------ |  AidDeliveryEscrow  |   |
|   |    (Node Identity & Status)     |         | (Milestone Rewards) |   |
|   +---------------------------------+         +---------------------+   |
+-------------------------------------------------------------------------+
                                    |
                                    v
                 +--------------------------------------+
                 |      ImpactLens AI Audit Engine      |
                 | (Read-Only Deterministic Evaluation) |
                 +--------------------------------------+
```

## 2. Cross-Chain Verification Invariant

No transaction on Creditcoin CC3 is credited without:
1. **Source Hash Uniqueness**: `verifiedTransactions[sourceTxHash] == false`.
2. **Attestcoin Oracle Proof**: Cryptographic signature matching the trusted BlockProver / Gluwa USC oracle.
3. **Block Depth Confirmation**: Verified against block headers with finality on Sepolia.

## 3. Milestone Escrow Invariant

No responder reward is dispatched without:
1. Active responder status in `ResponderRegistry`.
2. Task in `Created` state.
3. Unused `deliveryProofHash`. Resubmission of identical hash reverts with `duplicate proof hash`.
4. Authorized approver signature.

## 4. AI Separation of Concerns

ImpactLens strictly executes as a read-only analytical filter:
- Reads `ReliefCampaign.getCampaignStats()`
- Reads `AidDeliveryEscrow` task statuses
- Reads `AidPackageRegistry.getAllPackages()`
- Checks for duplicate hashes and anomalies
- Does **NOT** have private keys, transaction broadcast authority, or balance mutation capabilities.
