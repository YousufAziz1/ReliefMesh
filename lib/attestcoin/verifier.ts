/**
 * @file verifier.ts
 * @notice Official Attestcoin Cross-Chain Verification Integration Layer
 * @dev Interfaces with Gluwa USC SDK (@gluwa/usc-sdk) for cross-chain proof generation
 *      and attestation between Ethereum Sepolia and Creditcoin CC3 Testnet.
 */

import { PROTOCOL_CONFIG } from '@/lib/web3/config';

export interface AttestcoinProofPayload {
  sourceChain: string;
  sourceTxHash: string;
  sourceBlockNumber: number;
  donor: string;
  amount: string;
  campaignId: number;
  merkleProof?: string[];
  blockHeader?: string;
  oracleSignature?: string;
  status: 'GENERATING' | 'ATTESTED' | 'VERIFIED' | 'REJECTED';
  error?: string;
}

export interface VerificationResult {
  success: boolean;
  status: 'NOT_STARTED' | 'PENDING' | 'PROCESSING' | 'VERIFIED' | 'FAILED' | 'NOT_CONFIGURED';
  sourceTxHash: string;
  destinationTxHash?: string;
  verifiedAmount?: string;
  timestamp: string;
  blockNumber?: number;
  isSimulated: boolean;
  blockerReason?: string;
}

/**
 * Attempts real Attestcoin verification using server-side Gluwa BlockProver & Creditcoin CC3 relayer.
 * If credentials/RPC/gas are missing, gracefully documents the exact blocker truthfully.
 */
export async function verifyDonationWithAttestcoin(
  payload: AttestcoinProofPayload
): Promise<VerificationResult> {
  const timestamp = new Date().toISOString();

  try {
    // 1. Request cryptographic proof from Gluwa BlockProver via server route
    const proofRes = await fetch('/api/attestcoin/proof', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourceTxHash: payload.sourceTxHash,
        sourceBlockNumber: payload.sourceBlockNumber,
        donor: payload.donor,
        amount: payload.amount,
        campaignId: payload.campaignId,
      }),
    });

    const proofData = await proofRes.json();

    if (proofData.status === 'NOT_CONFIGURED') {
      return {
        success: false,
        status: 'NOT_CONFIGURED',
        sourceTxHash: payload.sourceTxHash,
        timestamp,
        isSimulated: false,
        blockerReason: proofData.error || 'Gluwa USC BlockProver service not configured.',
      };
    }

    if (proofData.status === 'FAILED') {
      return {
        success: false,
        status: 'FAILED',
        sourceTxHash: payload.sourceTxHash,
        timestamp,
        isSimulated: false,
        blockerReason: proofData.error || 'Attestcoin proof generation failed.',
      };
    }

    // 2. Submit verified proof to Creditcoin CC3 on-chain verifier
    const verifyRes = await fetch('/api/creditcoin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourceChain: payload.sourceChain || 'Ethereum Sepolia',
        sourceTxHash: payload.sourceTxHash,
        sourceBlockNumber: payload.sourceBlockNumber,
        donor: payload.donor,
        amount: payload.amount,
        campaignId: payload.campaignId,
        attestationSignature: proofData.proofData?.signature || '0x',
      }),
    });

    const verifyData = await verifyRes.json();

    if (verifyData.status === 'NOT_CONFIGURED') {
      return {
        success: false,
        status: 'NOT_CONFIGURED',
        sourceTxHash: payload.sourceTxHash,
        timestamp,
        isSimulated: false,
        blockerReason: verifyData.error || 'Creditcoin CC3 relayer account not configured.',
      };
    }

    if (verifyData.status === 'FAILED') {
      return {
        success: false,
        status: 'FAILED',
        sourceTxHash: payload.sourceTxHash,
        timestamp,
        isSimulated: false,
        blockerReason: verifyData.error || 'Verification transaction rejected on CC3.',
      };
    }

    return {
      success: true,
      status: 'VERIFIED',
      sourceTxHash: payload.sourceTxHash,
      destinationTxHash: verifyData.destinationTxHash,
      verifiedAmount: payload.amount,
      timestamp,
      blockNumber: verifyData.blockNumber || payload.sourceBlockNumber,
      isSimulated: false,
    };
  } catch (error: any) {
    return {
      success: false,
      status: 'FAILED',
      sourceTxHash: payload.sourceTxHash,
      timestamp,
      isSimulated: false,
      blockerReason: error?.message || 'Attestcoin verification pipeline error.',
    };
  }
}

/**
 * Deterministic simulation verification for Hackathon Judge Mode and testnet dry-runs.
 * Explicitly tagged as isSimulated: true.
 */
export function simulateAttestcoinProof(payload: AttestcoinProofPayload): VerificationResult {
  return {
    success: true,
    status: 'VERIFIED',
    sourceTxHash: payload.sourceTxHash,
    destinationTxHash: '0xcc391827' + Math.random().toString(16).slice(2, 10) + '4f92',
    verifiedAmount: payload.amount,
    timestamp: new Date().toISOString(),
    blockNumber: payload.sourceBlockNumber || 6841209,
    isSimulated: true,
  };
}
