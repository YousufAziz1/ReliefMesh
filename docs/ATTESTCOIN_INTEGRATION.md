# Attestcoin & Creditcoin CC3 Integration Specification

## 1. Architecture Overview

ReliefMesh implements cross-chain consensus-backed humanitarian aid settlement linking **Ethereum Sepolia** (Source Chain) and **Creditcoin CC3 Testnet** (Settlement Chain) using the official Gluwa Universal Settlement Coordinator SDK (`@gluwa/usc-sdk`) and Attestcoin inclusion proofs.

```
+---------------------------+       +------------------------------------+
|  Ethereum Sepolia (11155111)|       |     Creditcoin CC3 Testnet (102031)|
|                           |       |                                    |
| 1. Donor calls wallet     |       | 5. Verifier precompile checks      |
|    sendTransaction()      |       |    BlockProver (0x...0FD2)         |
|                           |       |                                    |
| 2. Tx mined in Block #N   |       | 6. AttestcoinDonationVerifier.sol  |
|    Receipt confirmed      |       |    prevents duplicate replay       |
+-------------+-------------+       +-----------------+------------------+
              |                                       ▲
              ▼                                       |
+-------------+---------------------------------------+------------------+
|                     ReliefMesh Server Integration                      |
|                                                                        |
| 3. /api/attestcoin/proof:                                              |
|    Calls @gluwa/usc-sdk proofProvider.service.ProofBuilder             |
|    Builds Merkle Patricia inclusion proof from Sepolia Block Header    |
|                                                                        |
| 4. /api/creditcoin/verify:                                             |
|    Submits proof to AttestcoinDonationVerifier.verifyDonationProof()   |
|    Updates ReliefCampaign verified pool only after receipt confirmation|
+------------------------------------------------------------------------+
```

---

## 2. Official Gluwa USC SDK & Precompiles

ReliefMesh imports and interfaces directly with `@gluwa/usc-sdk` (`v0.18.0`):

1. **Creditcoin CC3 BlockProver Precompile**:
   ```
   BLOCK_PROVER_PRECOMPILE_ADDRESS = 0x0000000000000000000000000000000000000FD2
   ```
   Exported by `sdk.blockProver.BLOCK_PROVER_PRECOMPILE_ADDRESS`. Handles precompile cryptographic verification directly on Creditcoin CC3 validator nodes.

2. **Creditcoin CC3 ChainInfo Precompile**:
   ```
   CHAIN_INFO_PRECOMPILE_ADDRESS = 0x0000000000000000000000000000000000000fd3
   ```
   Exported by `sdk.chainInfo.CHAIN_INFO_PRECOMPILE_ADDRESS`. Resolves source chain continuity and consensus parameters.

3. **Proof Generation Classes**:
   - `sdk.proofProvider.service.ProofBuilder(chainKey, builderUrl, timeout)`: Queries the live Gluwa USC remote proof service for rapid attestation retrieval.
   - `sdk.proofProvider.raw.RawProofBuilder(chainKey, blockProvider, chainInfoProvider, encoding)`: Builds raw Merkle inclusion proofs locally using archive block headers.

---

## 3. Server-Side Security Isolation

To prevent credential leakage to browser client bundles:
- Private keys (`BACKEND_PRIVATE_KEY`) and prover keys (`GLUWA_PROVER_API_KEY`) are restricted exclusively to server-side Next.js route handlers (`app/api/...`).
- Client code never receives or processes private relayer keys.

### Server API Endpoints:
1. `POST /api/attestcoin/proof`:
   - Validates `sourceTxHash` and `sourceBlockNumber`.
   - Checks `GLUWA_PROVER_API_KEY` and `SOURCE_ARCHIVE_RPC_URL`.
   - If credentials are not present, returns HTTP 200 with `{ status: 'NOT_CONFIGURED', error: '...' }`.
   - **Never fakes verification**.

2. `POST /api/creditcoin/verify`:
   - Validates parameters and checks `BACKEND_PRIVATE_KEY`.
   - Inspects `isDonationVerified(sourceTxHash)` on Creditcoin CC3.
   - If transaction was already verified, reverts with `409 Conflict: DUPLICATE_TRANSACTION`.
   - Executes `verifyDonationProof(...)` and waits for 1 block confirmation.
   - Triggers `ReliefCampaign.recordVerifiedDonation()`.

---

## 4. UI Truthfulness & States

ReliefMesh enforces 6 truthful pipeline statuses:

| Status Code | Description | UI Display |
| :--- | :--- | :--- |
| `NOT_STARTED` | User has not yet broadcast a transaction | Gray / Pending |
| `PENDING` | Transaction prompted in browser wallet (MetaMask) | Blue pulse |
| `PROCESSING` | Transaction broadcast; awaiting block mining or receipt | Blue animate |
| `VERIFIED` | Real cryptographic proof verified & inscribed on CC3 | Deep Teal check |
| `FAILED` | Reverted on-chain (e.g. duplicate replay attack) | Red error with reason |
| `NOT_CONFIGURED`| Live credentials/RPC/gas missing from environment | Amber warning + prompt |

---

## 5. Live Production Credentials Checklist

To run live end-to-end with zero simulation fallbacks, provide:

```env
# Server-only secrets in .env.local
BACKEND_PRIVATE_KEY=0x...           # Funded Creditcoin CC3 account (tCTC)
GLUWA_PROVER_API_KEY=glu_...        # Authenticated Gluwa USC service key
SOURCE_ARCHIVE_RPC_URL=https://...  # Ethereum Sepolia Archive Node
```
