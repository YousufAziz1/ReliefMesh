import { NextRequest, NextResponse } from 'next/server';
import { proofProvider, blockProver, chainInfo } from '@gluwa/usc-sdk';
import { JsonRpcProvider } from 'ethers';

/**
 * @file app/api/attestcoin/proof/route.ts
 * @notice Official Gluwa Universal Settlement Coordinator / Attestcoin proof generation route.
 * @dev Connects to official Creditcoin CC3 Proof Builder service (https://prover.cc3-testnet.creditcoin.network/)
 *      Uses chainKey = 1 (Sepolia Ethereum on CC3).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sourceTxHash, sourceBlockNumber } = body;

    // Validate inputs
    if (!sourceTxHash || !sourceTxHash.startsWith('0x') || sourceTxHash.length !== 66) {
      return NextResponse.json(
        {
          status: 'FAILED',
          error: 'Invalid sourceTxHash: must be a 32-byte hexadecimal string starting with 0x (66 characters).',
        },
        { status: 400 }
      );
    }

    const proverUrl =
      process.env.CREDITCOIN_PROOF_BUILDER_URL ||
      process.env.NEXT_PUBLIC_PROOF_BUILDER_URL ||
      'https://prover.cc3-testnet.creditcoin.network/';
    const creditcoinRpc =
      process.env.CREDITCOIN_RPC_URL ||
      process.env.NEXT_PUBLIC_CREDITCOIN_RPC_URL ||
      'https://rpc.cc3-testnet.creditcoin.network';
    const chainKey = parseInt(process.env.SOURCE_CHAIN_KEY || '1', 10); // 1 = Sepolia on CC3

    const ccProvider = new JsonRpcProvider(creditcoinRpc);

    // 1. Check if the block has been attested on Creditcoin CC3
    if (sourceBlockNumber) {
      try {
        const chainInfoProvider = new chainInfo.PrecompileChainInfoProvider(ccProvider);
        const bounds = await chainInfoProvider.getContinuityBounds(chainKey, Number(sourceBlockNumber));

        if (!bounds.isAttested) {
          return NextResponse.json({
            status: 'PENDING',
            sourceTxHash,
            sourceBlockNumber,
            detail: `Sepolia block #${sourceBlockNumber} is awaiting consensus attestation on Creditcoin CC3.`,
            bounds,
          });
        }
      } catch (attestErr: any) {
        // If query fails, continue to attempt proof generation
        console.warn('Attestation check warning:', attestErr?.message);
      }
    }

    // 2. Fetch inclusion proof from official Creditcoin ProofBuilder service
    const builder = new proofProvider.service.ProofBuilder(chainKey, proverUrl, 20000);
    const proofResult = await builder.getProof(sourceTxHash);

    if (proofResult.success && proofResult.data) {
      const proofData = proofResult.data;

      // 3. Verify the proof against Creditcoin CC3 PrecompileBlockProver (0x...0FD2)
      let precompileVerified = false;
      try {
        const prover = new blockProver.PrecompileBlockProver(ccProvider);
        precompileVerified = await prover.verifySingle(
          proofData.chainKey,
          proofData.headerNumber,
          proofData.txBytes,
          proofData.merkleProof,
          proofData.continuityProof
        );
      } catch (proverErr: any) {
        console.warn('PrecompileBlockProver pre-verification check:', proverErr?.message);
      }

      return NextResponse.json({
        status: 'VERIFIED',
        sourceTxHash,
        sourceBlockNumber: proofData.headerNumber || sourceBlockNumber,
        proofData: {
          chainKey: proofData.chainKey,
          headerNumber: proofData.headerNumber,
          txIndex: proofData.txIndex,
          txHash: proofData.txHash,
          txBytes: proofData.txBytes,
          merkleProof: proofData.merkleProof,
          continuityProof: proofData.continuityProof,
          cached: proofData.cached,
          generatedAt: proofData.generatedAt,
        },
        precompileVerified,
        timestamp: new Date().toISOString(),
        isLiveProof: true,
      });
    } else {
      return NextResponse.json({
        status: 'FAILED',
        sourceTxHash,
        error: proofResult.error || 'Failed to generate proof from Creditcoin ProofBuilder.',
      });
    }
  } catch (err: any) {
    return NextResponse.json(
      {
        status: 'FAILED',
        error: err?.message || 'Internal server error while processing proof request.',
      },
      { status: 500 }
    );
  }
}
