# ReliefMesh Testnet Limitations & Live Execution Prerequisites

## 1. Executive Summary

ReliefMesh provides a fully transparent architecture that distinguishes between:
1. **Demo / Simulation Mode** (`DEMO_MODE=true`): A deterministic, interactive environment for Hackathon judges and offline reviewers to evaluate all 6 verification stages, duplicate replay defense, and AI auditing without requiring live testnet gas or private API keys.
2. **Real Testnet Mode** (`DEMO_MODE=false` or toggled in UI): Directly connects to **Ethereum Sepolia** and **Creditcoin CC3 Testnet** using browser wallets (MetaMask/Wagmi) and server-side relayers.

ReliefMesh enforces **strict status truthfulness**:
- The frontend **never claims** `VERIFIED`, `SETTLED`, `PROOF GENERATED`, or `REWARD RELEASED` unless the real cryptographic proof or on-chain transaction receipt has actually succeeded.
- If live services, credentials, or gas funds are missing, the UI faithfully halts at `NOT CONFIGURED` with explicit explanations.

---

## 2. Live Execution Prerequisites

To execute the entire end-to-end pipeline against live testnets with zero simulation fallbacks, the operator must provide the following configuration:

### A. Client-Side (Browser Wallet)
| Requirement | Value / Description | Purpose |
| :--- | :--- | :--- |
| **Web3 Wallet** | MetaMask, Rabby, or Coinbase Wallet | Signs donor transactions on Ethereum Sepolia |
| **Network** | Ethereum Sepolia (`chainId: 11155111`) | Source blockchain for aid donations |
| **SepoliaETH Faucet** | >= 0.01 SepoliaETH | Gas and donation value for source transactions |
| **Vault Address** | `NEXT_PUBLIC_SEPOLIA_VAULT_ADDRESS` | Receiving address for donor funds on Sepolia |

### B. Server-Side (Relayer & Prover Secrets)
| Environment Variable | Source / Provider | Purpose |
| :--- | :--- | :--- |
| `GLUWA_PROVER_API_KEY` | Gluwa USC / BlockProver Portal | Authenticates with the official Attestcoin BlockProver service |
| `SOURCE_ARCHIVE_RPC_URL` | Alchemy or Infura Sepolia Archive Node | Required by `@gluwa/usc-sdk` to read historical block headers and storage trie roots |
| `BACKEND_PRIVATE_KEY` | Creditcoin CC3 Testnet Account | Funded with testnet `tCTC` to pay gas for `verifyDonationProof` and `approveDelivery` |
| `NEXT_PUBLIC_CREDITCOIN_RPC_URL` | `https://rpc.cc3-testnet.creditcoin.network` | Submits relayer transactions to Creditcoin CC3 validator node |
| `NEXT_PUBLIC_ATTESTCOIN_VERIFIER_ADDRESS` | Deployed `AttestcoinDonationVerifier.sol` on CC3 | On-chain verification contract linked to Gluwa precompile |

---

## 3. Current Live Testnet Status & Blockers

| Component | Testnet Status | Active Capability | Remaining Live Blocker |
| :--- | :--- | :--- | :--- |
| **Wallet Connection** | **100% Live** | Connects MetaMask/Injected wallet, validates Sepolia `11155111`, displays balance, switches networks | None |
| **Sepolia Donation** | **100% Live** | Real `sendTransaction` via Wagmi, prompts MetaMask signature, awaits on-chain block mining, extracts real tx hash & block | Requires user wallet with SepoliaETH |
| **Attestcoin Proof** | **Integrated SDK** | `@gluwa/usc-sdk` integration implemented; server route `/api/attestcoin/proof` ready | Requires live `GLUWA_PROVER_API_KEY` and archive RPC |
| **Creditcoin CC3 Verification** | **Contracts Ready** | Solidity contracts tested with 40 unit tests; server relayer `/api/creditcoin/verify` ready | Requires funded `BACKEND_PRIVATE_KEY` with testnet `tCTC` gas |
| **Campaign Accounting** | **100% Isolated** | Accounting increments **only** after verification receipt; never before | None (tested with automated tests) |
| **Milestone Escrow** | **100% Protected** | Active responder validation, duplicate proof hash rejection, bounded rewards | Requires CC3 gas to broadcast live `approveDelivery` |
| **Status Truthfulness** | **100% Enforced** | Halts at `NOT CONFIGURED` if credentials missing; zero fake green success screens | None |

---

## 4. Why Demo Mode Is Preserved

During hackathon presentations, internet connectivity, testnet faucets, RPC rate limits, and external prover downtime frequently cause live demos to stall. ReliefMesh solves this by providing:

1. A **Header Mode Switcher** allowing instant toggling between `🧪 SIMULATION ACTIVE` and `🌐 REAL TESTNET`.
2. Dedicated scenario buttons (`✓ Simulate Success`, `⚠ Duplicate Replay`, `⏳ Proof Pending`, `✕ Gas Reversion`) so evaluators can inspect contract-level failure handling without waiting 5 minutes for block confirmations.
3. Complete cryptographic transparency: every simulated event is explicitly tagged `isSimulated: true`.
