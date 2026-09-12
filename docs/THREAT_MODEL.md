# ReliefMesh Threat Model & Security Posture

## 1. Adversarial Analysis

| Threat Vector | Attack Scenario | ReliefMesh Mitigation |
| :--- | :--- | :--- |
| **Proof Replay Attack** | Attacker takes a valid Sepolia donation hash and submits it repeatedly to Creditcoin CC3 to drain campaign funds or mint infinite credit. | `AttestcoinDonationVerifier.sol` stores `mapping(bytes32 => bool) verifiedTransactions`. Reverts immediately on duplicate transaction submission. |
| **Duplicate Delivery Claim** | Responder node completes 1 delivery, takes the signed photo/GPS proof hash, and files 10 separate claims across multiple tasks. | `AidDeliveryEscrow.sol` enforces `mapping(bytes32 => bool) usedProofHashes`. Emits `DuplicateClaimRejected` and reverts. |
| **Rogue Responder Deactivation** | Deactivated or compromised responder tries to claim pending task rewards. | `releaseReward()` checks `ResponderRegistry.getResponder().active == true`. |
| **AI Prompt Injection / Hallucination** | Malicious input attempts to trick an LLM into approving aid release or creating false emergency declarations. | AI has zero state-mutation privileges. ImpactLens is strictly read-only and backed by deterministic mathematical fallback rules. |
| **Bridge Custodian Exploitation** | Multi-sig bridge validators get compromised or collude to steal funds. | Zero custodian bridge. ReliefMesh uses Attestcoin inclusion proofs mined directly against Ethereum block headers. |
| **Private Key Exposure** | Developer accidentally exposes node operator or relayer keys in client-side bundle. | Strict Next.js separation: `BACKEND_PRIVATE_KEY` is never exposed with `NEXT_PUBLIC_` prefix. Client interacts solely through user's own Web3 wallet. |
