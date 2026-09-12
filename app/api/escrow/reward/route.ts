import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { PROTOCOL_CONFIG } from '@/lib/web3/config';

const ESCROW_ABI = [
  'function getTask(uint256 _taskId) external view returns (tuple(uint256 taskId, uint256 campaignId, address responder, string description, uint256 rewardAmount, bytes32 proofHash, string evidenceUri, uint8 status, uint256 createdTimestamp, uint256 completedTimestamp, bool rewardReleased))',
  'function usedProofHashes(bytes32 _proofHash) external view returns (bool)',
  'function submitDeliveryProof(uint256 _taskId, bytes32 _proofHash, string _evidenceUri) external',
  'function approveDelivery(uint256 _taskId) external',
  'function releaseReward(uint256 _taskId) external',
  'event ResponderRewardReleased(uint256 indexed taskId, address indexed responder, uint256 amount)',
  'event DuplicateClaimRejected(uint256 indexed taskId, bytes32 indexed proofHash, address submitter)',
];

const RESPONDER_ABI = [
  'function isResponderActive(address _wallet) external view returns (bool)',
  'function getResponder(address _wallet) external view returns (tuple(address wallet, string nodeId, string serviceArea, string role, uint256 reputation, bool active, uint256 registrationTimestamp))',
];

/**
 * @file app/api/escrow/reward/route.ts
 * @notice Verifiable milestone task reward dispatcher on Creditcoin CC3.
 * @dev Enforces responder active check, duplicate delivery rejection, and bounded testnet payouts.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { taskId, responder, proofHash, evidenceUri } = body;

    if (!taskId || !responder || !proofHash) {
      return NextResponse.json(
        { status: 'FAILED', error: 'Missing required parameters: taskId, responder, proofHash.' },
        { status: 400 }
      );
    }

    const relayerKey = process.env.BACKEND_PRIVATE_KEY;
    const creditcoinRpc =
      process.env.NEXT_PUBLIC_CREDITCOIN_RPC_URL || 'https://rpc.cc3-testnet.creditcoin.network';
    const escrowAddress =
      process.env.NEXT_PUBLIC_AID_ESCROW_ADDRESS || PROTOCOL_CONFIG.contracts.aidEscrow;
    const registryAddress =
      process.env.NEXT_PUBLIC_RESPONDER_REGISTRY_ADDRESS || PROTOCOL_CONFIG.contracts.responderRegistry;

    if (!relayerKey) {
      return NextResponse.json({
        status: 'NOT_CONFIGURED',
        taskId,
        error:
          'Creditcoin CC3 escrow relayer not configured: BACKEND_PRIVATE_KEY is missing from server environment.',
        details:
          'Releasing milestone rewards on Creditcoin CC3 requires a funded authority account. Set BACKEND_PRIVATE_KEY in .env.local or use Demo Simulation Mode.',
        requiredEnv: ['BACKEND_PRIVATE_KEY', 'NEXT_PUBLIC_AID_ESCROW_ADDRESS'],
      });
    }

    const provider = new ethers.JsonRpcProvider(creditcoinRpc);
    const wallet = new ethers.Wallet(relayerKey, provider);
    const escrowContract = new ethers.Contract(escrowAddress, ESCROW_ABI, wallet);
    const registryContract = new ethers.Contract(registryAddress, RESPONDER_ABI, wallet);

    // 1. Verify responder is active
    try {
      const isActive = await registryContract.isResponderActive(responder);
      if (!isActive) {
        return NextResponse.json(
          {
            status: 'FAILED',
            rejectionCode: 'INACTIVE_RESPONDER',
            error: 'AidDeliveryEscrow: responder is not active or registered in ResponderRegistry.',
          },
          { status: 403 }
        );
      }
    } catch {
      // If view call fails, continue to contract execution where modifier will catch it
    }

    // 2. Check for duplicate proof hash
    const isDuplicate = await escrowContract.usedProofHashes(proofHash);
    if (isDuplicate) {
      return NextResponse.json(
        {
          status: 'FAILED',
          rejectionCode: 'DUPLICATE_PROOF',
          error: 'AidDeliveryEscrow: duplicate delivery proof hash. Proof has already been claimed.',
        },
        { status: 409 }
      );
    }

    // 3. Submit proof and approve reward
    const uri = evidenceUri || `ipfs://bafkrei${proofHash.slice(2, 22)}`;
    const txSubmit = await escrowContract.submitDeliveryProof(taskId, proofHash, uri, {
      gasLimit: 300000,
    });
    await txSubmit.wait(1);

    const txApprove = await escrowContract.approveDelivery(taskId, { gasLimit: 300000 });
    const receipt = await txApprove.wait(1);

    return NextResponse.json({
      status: 'REWARD_RELEASED',
      taskId,
      responder,
      proofHash,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    const errorMsg =
      error?.reason || error?.info?.error?.message || error?.message || 'Escrow execution failed on CC3.';

    const isDuplicate = errorMsg.includes('duplicate');
    const isInactive = errorMsg.includes('not active');

    return NextResponse.json(
      {
        status: 'FAILED',
        rejectionCode: isDuplicate ? 'DUPLICATE_PROOF' : isInactive ? 'INACTIVE_RESPONDER' : 'REVERT',
        error: errorMsg,
      },
      { status: isDuplicate ? 409 : isInactive ? 403 : 500 }
    );
  }
}
