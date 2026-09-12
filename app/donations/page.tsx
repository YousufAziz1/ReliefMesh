'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import { PROTOCOL_CONFIG } from '@/lib/web3/config';
import { useProtocolMode, config } from '@/app/providers';
import { useAccount, useConnect, useSwitchChain, useChainId, useSendTransaction, useBalance } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { parseEther } from 'viem';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { verifyDonationWithAttestcoin } from '@/lib/attestcoin/verifier';

type PipelineStepStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'ERROR' | 'NOT_CONFIGURED';

interface PipelineStep {
  id: number;
  title: string;
  subtitle: string;
  status: PipelineStepStatus;
  hash?: string;
  block?: number;
  timestamp?: string;
  detail?: string;
  explorerUrl?: string;
}

export default function DonationsPage() {
  const { isDemoMode, toggleDemoMode } = useProtocolMode();
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const chainId = useChainId();
  const { switchChain, switchChainAsync } = useSwitchChain();
  const { data: balanceData } = useBalance({ address });
  const { sendTransactionAsync } = useSendTransaction();

  const isSepolia = chainId === sepolia.id;

  const [amount, setAmount] = useState('0.01');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentScenario, setCurrentScenario] = useState<'SUCCESS' | 'DUPLICATE' | 'PENDING' | 'REVERT'>('SUCCESS');

  // Campaign live accounting state
  const [verifiedTotal, setVerifiedTotal] = useState(320);
  const [donorCount, setDonorCount] = useState(4);

  const initialSteps: PipelineStep[] = [
    {
      id: 1,
      title: 'Donation Created',
      subtitle: 'Source Transaction Broadcast on Ethereum Sepolia',
      status: 'PENDING',
      detail: 'Awaiting donor wallet confirmation on Ethereum Sepolia.',
    },
    {
      id: 2,
      title: 'Transaction Mined',
      subtitle: 'Ethereum Sepolia Block Confirmation',
      status: 'PENDING',
      detail: 'Waiting for Ethereum consensus and block confirmation.',
    },
    {
      id: 3,
      title: 'Block Attested',
      subtitle: 'Gluwa USC / Attestcoin Oracle Header Attestation',
      status: 'PENDING',
      detail: 'Ethereum Sepolia block header recorded by Gluwa BlockProver.',
    },
    {
      id: 4,
      title: 'Proof Generated',
      subtitle: 'Cryptographic Storage Inclusion Proof',
      status: 'PENDING',
      detail: 'Merkle Patricia storage inclusion proof generated.',
    },
    {
      id: 5,
      title: 'Verified on Creditcoin',
      subtitle: 'CC3 Smart Contract Verification Inscribed',
      status: 'PENDING',
      detail: 'AttestcoinDonationVerifier on Creditcoin CC3 records proof.',
    },
    {
      id: 6,
      title: 'Campaign Updated',
      subtitle: 'ReliefMesh Treasury Accounting Credited',
      status: 'PENDING',
      detail: 'ReliefCampaign accounting increments verified aid pool.',
    },
  ];

  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>(initialSteps);
  const [pendingDonation, setPendingDonation] = useState<{
    txHash: string;
    minedBlock: number;
    amount: string;
    donor: string;
  } | null>(null);

  // Restore active or previous donation from localStorage on page load
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('reliefmesh_pending_donation');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.txHash && parsed.minedBlock) {
          setPendingDonation(parsed);
          setPipelineSteps((prev) =>
            prev.map((s) =>
              s.id === 1
                ? {
                    ...s,
                    status: 'COMPLETED',
                    hash: parsed.txHash,
                    timestamp: 'Confirmed',
                    detail: `Signed and broadcast to Sepolia by ${parsed.donor ? parsed.donor.slice(0, 6) + '...' + parsed.donor.slice(-4) : 'wallet'}.`,
                    explorerUrl: `https://sepolia.etherscan.io/tx/${parsed.txHash}`,
                  }
                : s.id === 2
                ? {
                    ...s,
                    status: 'COMPLETED',
                    block: parsed.minedBlock,
                    timestamp: 'Confirmed',
                    detail: `Confirmed in Sepolia block #${parsed.minedBlock}.`,
                  }
                : s.id === 3
                ? {
                    ...s,
                    status: 'ACTIVE',
                    detail: `Ready to check Creditcoin CC3 attestation status for block #${parsed.minedBlock}.`,
                  }
                : s
            )
          );
        }
      }
    } catch {}
  }, []);

  // ---------------------------------------------------------------------------
  // ROBUST ATTESTATION CHECK & CREDITCOIN SETTLEMENT PIPELINE
  // ---------------------------------------------------------------------------
  const executeAttestationCheck = async (
    targetTxHash: string,
    minedBlockNumber: number,
    donationAmount: string,
    donorAddress: string
  ) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    setPipelineSteps((prev) =>
      prev.map((s) =>
        s.id === 3
          ? {
              ...s,
              status: 'ACTIVE',
              detail: `Connecting to Gluwa USC oracle & Creditcoin CC3 consensus for block #${minedBlockNumber}...`,
            }
          : s.id >= 4
          ? {
              ...s,
              status: 'PENDING',
              detail: 'Awaiting block attestation on Creditcoin CC3.',
            }
          : s
      )
    );

    try {
      let verificationResult = await verifyDonationWithAttestcoin({
        sourceChain: 'Ethereum Sepolia',
        sourceTxHash: targetTxHash,
        sourceBlockNumber: minedBlockNumber,
        donor: donorAddress,
        amount: donationAmount,
        campaignId: 1,
        status: 'GENERATING',
      });

      let finalResult = verificationResult;
      let attempt = 0;
      const maxAttempts = 30; // 5 minutes total (checking every 10s)

      while (finalResult.status === 'PENDING' && attempt < maxAttempts) {
        attempt++;
        const currentHeight = finalResult.bounds?.parentHeight;
        const remainingBlocks = currentHeight ? Math.max(0, minedBlockNumber - currentHeight) : null;
        const progressDetail =
          remainingBlocks !== null && remainingBlocks > 0
            ? `Creditcoin CC3 Oracle: Sepolia block #${currentHeight} (target #${minedBlockNumber}, ${remainingBlocks} blocks to sync). Checking every 10s (attempt ${attempt}/${maxAttempts})...`
            : `Creditcoin CC3 attested height reached! Ingesting cryptographic proof (attempt ${attempt}/${maxAttempts})...`;

        setPipelineSteps((prev) =>
          prev.map((s) =>
            s.id === 3
              ? {
                  ...s,
                  status: 'ACTIVE',
                  timestamp: `Syncing (${attempt}/${maxAttempts})`,
                  detail: progressDetail,
                }
              : s.id >= 4
              ? {
                  ...s,
                  status: 'PENDING',
                  detail: 'Awaiting attestation finalization on Creditcoin CC3.',
                }
              : s
          )
        );

        await new Promise((r) => setTimeout(r, 10000));

        finalResult = await verifyDonationWithAttestcoin({
          sourceChain: 'Ethereum Sepolia',
          sourceTxHash: targetTxHash,
          sourceBlockNumber: minedBlockNumber,
          donor: donorAddress,
          amount: donationAmount,
          campaignId: 1,
          status: 'GENERATING',
        });
      }

      if (finalResult.status === 'NOT_CONFIGURED') {
        setPipelineSteps((prev) =>
          prev.map((s) =>
            s.id === 3 || s.id === 4
              ? {
                  ...s,
                  status: 'NOT_CONFIGURED',
                  timestamp: 'Halted',
                  detail: finalResult.blockerReason || 'Gluwa BlockProver not configured in server environment.',
                }
              : s.id >= 5
              ? {
                  ...s,
                  status: 'PENDING',
                  detail: 'Execution suspended: Requires live Gluwa USC credentials and CC3 gas account.',
                }
              : s
          )
        );
        setIsProcessing(false);
        setErrorMessage(
          `TRANSPARENT STATUS: Source transaction ${targetTxHash.slice(0, 10)}... confirmed on Sepolia! Attestcoin proof generation requires active Creditcoin ProofBuilder service. Switch to Demo Simulation Mode or Judge Mode (/judge) to review the full 6-step settlement sequence.`
        );
        return;
      }

      if (finalResult.status === 'PENDING') {
        setPipelineSteps((prev) =>
          prev.map((s) =>
            s.id === 3
              ? {
                  ...s,
                  status: 'ACTIVE',
                  timestamp: 'Syncing',
                  detail: `Block #${minedBlockNumber} confirmed on Sepolia! Attestation time depends on source-chain finality and current testnet prover state. Click 'Check CC3 Attestation' anytime to continue checking!`,
                }
              : s
          )
        );
        setIsProcessing(false);
        setSuccessMessage(
          `SEPOLIA CONFIRMED! Block #${minedBlockNumber} confirmed. Creditcoin CC3 consensus attestation is actively processing. You can click 'Check CC3 Attestation' to continue without re-donating, or review Judge Mode (/judge) for instant verified demonstration.`
        );
        return;
      }

      if (finalResult.status === 'FAILED') {
        setPipelineSteps((prev) =>
          prev.map((s) =>
            s.id >= 3
              ? {
                  ...s,
                  status: 'ERROR',
                  timestamp: 'Failed',
                  detail: finalResult.blockerReason || 'Verification rejected.',
                }
              : s
          )
        );
        setIsProcessing(false);
        setErrorMessage(`VERIFICATION FAILED: ${finalResult.blockerReason}`);
        return;
      }

      // Step 3 & 4 & 5 & 6 Completed!
      setPipelineSteps((prev) =>
        prev.map((s) =>
          s.id === 3
            ? {
                ...s,
                status: 'COMPLETED',
                timestamp: 'Just now',
                detail: 'Block header attested by Gluwa BlockProver oracle on Creditcoin CC3.',
              }
            : s.id === 4
            ? {
                ...s,
                status: 'COMPLETED',
                timestamp: 'Just now',
                detail: 'Cryptographic Merkle inclusion proof generated and verified via PrecompileBlockProver.',
              }
            : s.id === 5
            ? {
                ...s,
                status: 'COMPLETED',
                hash: finalResult.destinationTxHash,
                timestamp: 'Just now',
                detail: 'AttestcoinDonationVerifier validated signature and inscribed on Creditcoin CC3.',
                explorerUrl: finalResult.destinationTxHash
                  ? `https://creditcoin-testnet.subscan.io/tx/${finalResult.destinationTxHash}`
                  : undefined,
              }
            : s.id === 6
            ? {
                ...s,
                status: 'COMPLETED',
                timestamp: 'Just now',
                detail: `+${donationAmount} tCTC verified and credited to ReliefCampaign on Creditcoin CC3.`,
              }
            : s
        )
      );

      // Clean up localStorage since settlement succeeded
      try {
        localStorage.removeItem('reliefmesh_pending_donation');
      } catch {}

      setVerifiedTotal((prev) => prev + Number(donationAmount));
      setDonorCount((prev) => prev + 1);
      setIsProcessing(false);
      setSuccessMessage(`VERIFIED: Donated ${donationAmount} SepoliaETH verified across chains and inscribed on Creditcoin CC3!`);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err?.message || 'Error executing Creditcoin CC3 attestation check.');
    }
  };

  // ---------------------------------------------------------------------------
  // REAL TESTNET DONATION EXECUTION FLOW
  // ---------------------------------------------------------------------------
  const handleRealDonation = async () => {
    if (!isConnected || !address) {
      setErrorMessage('Please connect your Web3 wallet to send testnet funds.');
      return;
    }
    if (!isSepolia) {
      setErrorMessage('Wrong network. Please switch to Ethereum Sepolia.');
      try {
        switchChain({ chainId: sepolia.id });
      } catch {}
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Reset steps
    setPipelineSteps(initialSteps.map((s, idx) => ({
      ...s,
      status: idx === 0 ? 'ACTIVE' : 'PENDING',
      hash: undefined,
      block: undefined,
      timestamp: undefined,
    })));

    try {
      // 1. Trigger real wallet transaction on Ethereum Sepolia
      setPipelineSteps((prev) =>
        prev.map((s) =>
          s.id === 1 ? { ...s, status: 'ACTIVE', detail: 'Prompting signature in browser wallet...' } : s
        )
      );

      // Enforce network is strictly Sepolia before sending
      if (chainId !== sepolia.id) {
        if (switchChainAsync) {
          await switchChainAsync({ chainId: sepolia.id });
        } else {
          switchChain({ chainId: sepolia.id });
        }
      }

      const parsedValue = parseEther(amount || '0.001');
      const txHash = await sendTransactionAsync({
        to: PROTOCOL_CONFIG.sepoliaVaultAddress,
        value: parsedValue,
        chainId: sepolia.id, // STRICTLY ENFORCE SEPOLIA (11155111) TO PREVENT MAINNET ROUTING
      });

      // Step 1 Completed with real tx hash
      setPipelineSteps((prev) =>
        prev.map((s) =>
          s.id === 1
            ? {
                ...s,
                status: 'COMPLETED',
                hash: txHash,
                timestamp: 'Just now',
                detail: `Signed and broadcast to Sepolia mempool by ${address.slice(0, 6)}...${address.slice(-4)}.`,
                explorerUrl: `https://sepolia.etherscan.io/tx/${txHash}`,
              }
            : s.id === 2
            ? { ...s, status: 'ACTIVE', detail: 'Waiting for Ethereum Sepolia block confirmation...' }
            : s
        )
      );

      // 2. Wait for confirmation on Ethereum Sepolia
      const receipt = await waitForTransactionReceipt(config, {
        hash: txHash,
        chainId: sepolia.id,
      });

      const minedBlock = Number(receipt.blockNumber);

      // Step 2 Completed with real block number
      setPipelineSteps((prev) =>
        prev.map((s) =>
          s.id === 2
            ? {
                ...s,
                status: 'COMPLETED',
                block: minedBlock,
                timestamp: 'Just now',
                detail: `Confirmed in Sepolia block #${minedBlock} with status ${receipt.status}.`,
              }
            : s.id === 3
            ? { ...s, status: 'ACTIVE', detail: 'Requesting Gluwa USC BlockProver attestation...' }
            : s
        )
      );

      // Save to localStorage so browser reload preserves progress
      const donationPayload = {
        txHash,
        minedBlock,
        amount,
        donor: address,
      };
      try {
        localStorage.setItem('reliefmesh_pending_donation', JSON.stringify(donationPayload));
      } catch {}
      setPendingDonation(donationPayload);

      // 3. Execute attestation & settlement pipeline
      await executeAttestationCheck(txHash, minedBlock, amount, address);
    } catch (err: any) {
      setIsProcessing(false);
      const isUserRejected = err?.message?.includes('User rejected') || err?.code === 4001;
      setErrorMessage(
        isUserRejected
          ? 'Transaction canceled by user in wallet.'
          : err?.message || 'Error executing Sepolia donation.'
      );
      setPipelineSteps((prev) =>
        prev.map((s) => (s.status === 'ACTIVE' ? { ...s, status: 'ERROR', detail: err?.message } : s))
      );
    }
  };

  // ---------------------------------------------------------------------------
  // DEMO / SIMULATION MODE SCENARIO FLOW
  // ---------------------------------------------------------------------------
  const handleSimulateDonation = async (scenario: 'SUCCESS' | 'DUPLICATE' | 'PENDING' | 'REVERT' = currentScenario) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Reset steps
    setPipelineSteps(initialSteps.map((s, idx) => ({
      ...s,
      status: idx === 0 ? 'ACTIVE' : 'PENDING',
      hash: undefined,
      timestamp: undefined,
    })));

    // Step 1
    await new Promise((r) => setTimeout(r, 600));
    setPipelineSteps((prev) =>
      prev.map((s) =>
        s.id === 1
          ? {
              ...s,
              status: 'COMPLETED',
              hash: '0x4f82' + Math.random().toString(16).slice(2, 10) + '9b1248a7',
              timestamp: 'Just now',
              detail: 'Signed with donor simulated testnet key. Broadcasted to Sepolia mempool.',
            }
          : s.id === 2
          ? { ...s, status: 'ACTIVE' }
          : s
      )
    );

    // Step 2
    await new Promise((r) => setTimeout(r, 600));
    if (scenario === 'REVERT') {
      setIsProcessing(false);
      setErrorMessage('TRANSACTION REVERTED: Insufficient gas or source contract execution failure on Sepolia.');
      setPipelineSteps((prev) =>
        prev.map((s) => (s.id >= 2 ? { ...s, status: 'ERROR', detail: 'Aborted due to source chain reversion.' } : s))
      );
      return;
    }

    setPipelineSteps((prev) =>
      prev.map((s) =>
        s.id === 2
          ? {
              ...s,
              status: 'COMPLETED',
              block: 6841210,
              timestamp: 'Just now',
              detail: '6 block confirmations achieved on Ethereum Sepolia.',
            }
          : s.id === 3
          ? { ...s, status: 'ACTIVE' }
          : s
      )
    );

    // Step 3
    await new Promise((r) => setTimeout(r, 600));
    setPipelineSteps((prev) =>
      prev.map((s) =>
        s.id === 3
          ? {
              ...s,
              status: 'COMPLETED',
              hash: '0x9812' + Math.random().toString(16).slice(2, 10) + 'cc38',
              timestamp: 'Just now',
              detail: 'Block header validated by Gluwa USC / Attestcoin BlockProver.',
            }
          : s.id === 4
          ? { ...s, status: 'ACTIVE' }
          : s
      )
    );

    if (scenario === 'PENDING') {
      setIsProcessing(false);
      setSuccessMessage('PROOF IN QUEUE: Block header is awaiting Attestcoin oracle batch aggregation.');
      setPipelineSteps((prev) =>
        prev.map((s) => (s.id === 4 ? { ...s, status: 'ACTIVE', detail: 'Awaiting block finality before proof mining.' } : s))
      );
      return;
    }

    // Step 4
    await new Promise((r) => setTimeout(r, 600));
    setPipelineSteps((prev) =>
      prev.map((s) =>
        s.id === 4
          ? {
              ...s,
              status: 'COMPLETED',
              hash: '0xMerkleProof_' + Math.random().toString(16).slice(2, 8),
              timestamp: 'Just now',
              detail: 'Storage inclusion proof generated without custodial bridge risks.',
            }
          : s.id === 5
          ? { ...s, status: 'ACTIVE' }
          : s
      )
    );

    // Step 5
    if (scenario === 'DUPLICATE') {
      setIsProcessing(false);
      setErrorMessage(
        'DUPLICATE REJECTION: Transaction hash was already registered on Creditcoin CC3. Mathematical replay attack prevented!'
      );
      setPipelineSteps((prev) =>
        prev.map((s) =>
          s.id === 5
            ? { ...s, status: 'ERROR', detail: 'AttestcoinDonationVerifier reverted: duplicate source transaction.' }
            : s
        )
      );
      return;
    }

    await new Promise((r) => setTimeout(r, 600));
    setPipelineSteps((prev) =>
      prev.map((s) =>
        s.id === 5
          ? {
              ...s,
              status: 'COMPLETED',
              hash: '0xcc39' + Math.random().toString(16).slice(2, 10) + '4f92',
              timestamp: 'Just now',
              detail: 'AttestcoinDonationVerifier validated signature on Creditcoin CC3.',
            }
          : s.id === 6
          ? { ...s, status: 'ACTIVE' }
          : s
      )
    );

    // Step 6: Campaign Accounting
    await new Promise((r) => setTimeout(r, 500));
    setPipelineSteps((prev) =>
      prev.map((s) =>
        s.id === 6
          ? {
              ...s,
              status: 'COMPLETED',
              timestamp: 'Just now',
              detail: `+${amount} tCTC added to Assam Flood Relief campaign verified pool.`,
            }
          : s
      )
    );

    setVerifiedTotal((prev) => prev + Number(amount));
    setDonorCount((prev) => prev + 1);
    setIsProcessing(false);
    setSuccessMessage(`SUCCESS: Donated ${amount} tCTC verified across chains and credited to Assam Flood Relief!`);
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        {/* Header Title Banner */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isDemoMode ? 'bg-amber-500 animate-pulse' : 'bg-teal-600'
                  }`}
                ></span>
                <span
                  className={`text-xs uppercase tracking-wider font-bold ${
                    isDemoMode ? 'text-amber-800' : 'text-teal-800'
                  }`}
                >
                  {isDemoMode
                    ? 'CROSS-CHAIN DONATION CONSOLE (SIMULATION MODE)'
                    : 'CROSS-CHAIN DONATION CONSOLE (REAL TESTNET)'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">
                Donation Console &amp; Verification Pipeline
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Send testnet aid from Ethereum Sepolia and observe cryptographic proof verification on Creditcoin CC3.
              </p>
            </div>

            <button
              type="button"
              onClick={toggleDemoMode}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isDemoMode
                  ? 'bg-teal-50 border-teal-200 text-teal-800 hover:bg-teal-100'
                  : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">swap_horiz</span>
              <span>{isDemoMode ? 'Switch to Real Testnet' : 'Switch to Demo Mode'}</span>
            </button>
          </div>
        </div>

        {/* Judge Fast-Track Callout Banner */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white rounded-xl p-4 border border-teal-800/50 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-teal-300 text-[20px]">verified</span>
            </div>
            <div>
              <div className="text-xs font-bold text-teal-200">
                Hackathon Judge Fast-Track Demonstration
              </div>
              <p className="text-[11px] text-slate-300">
                Attestation time depends on source-chain finality and the current testnet prover state. To inspect an instant verified CC3 transaction with precompile proof verification and replay defense:
              </p>
            </div>
          </div>
          <Link
            href="/judge"
            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg text-xs tracking-wide shrink-0 transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Launch 3-Minute Judge Mode</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </Link>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Donation Console Form (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-1">
                {isDemoMode ? 'Simulate Cross-Chain Aid Donation' : 'Execute Real Testnet Donation'}
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                {isDemoMode
                  ? 'Run guided simulation scenarios for evaluation without live gas requirements.'
                  : 'Send real testnet SepoliaETH from your connected browser wallet.'}
              </p>

              {/* Active / Pending Donation Action Banner */}
              {!isDemoMode && pendingDonation && (
                <div className="mb-4 p-3.5 rounded-lg bg-blue-50/90 border border-blue-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                      Real Donation Ready for Attestation
                    </span>
                    <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                      Block #{pendingDonation.minedBlock}
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-700 font-mono truncate mb-2.5">
                    Tx: {pendingDonation.txHash}
                  </p>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() =>
                      executeAttestationCheck(
                        pendingDonation.txHash,
                        pendingDonation.minedBlock,
                        pendingDonation.amount,
                        pendingDonation.donor
                      )
                    }
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {isProcessing ? 'sync' : 'refresh'}
                    </span>
                    <span>
                      {isProcessing
                        ? 'Checking CC3 Oracle Attestation...'
                        : 'Check CC3 Attestation & Inscribe Proof'}
                    </span>
                  </button>
                </div>
              )}

              {/* Target Campaign Selection */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Target Relief Campaign
                </label>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Assam Flood Relief — Testnet Simulation
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Goal: 1,000 tCTC • Verified: {verifiedTotal.toFixed(2)} tCTC • Donors: {donorCount}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    Active
                  </span>
                </div>
              </div>

              {/* Amount Presets */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Quick Select Amount
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['0.005', '0.01', '0.05', '0.1'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className={`py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                        amount === preset
                          ? 'bg-teal-800 text-white shadow-xs'
                          : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {preset} ETH
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Input */}
              <div className="mb-5">
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Custom Donation Amount (SepoliaETH)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.001"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder="0.01"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400 font-mono">
                    SepoliaETH
                  </span>
                </div>
              </div>

              {/* DEMO MODE: Scenario Control Bar */}
              {isDemoMode && (
                <div className="mb-5 p-3 rounded-lg bg-amber-50/50 border border-amber-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                      Simulation Scenario Controls
                    </span>
                    <span className="text-[10px] text-amber-700 font-medium">Demo Mode Active</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentScenario('SUCCESS');
                        handleSimulateDonation('SUCCESS');
                      }}
                      className={`py-1.5 px-2 rounded font-semibold text-left transition-all ${
                        currentScenario === 'SUCCESS'
                          ? 'bg-teal-700 text-white'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ✓ Simulate Success
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentScenario('DUPLICATE');
                        handleSimulateDonation('DUPLICATE');
                      }}
                      className={`py-1.5 px-2 rounded font-semibold text-left transition-all ${
                        currentScenario === 'DUPLICATE'
                          ? 'bg-amber-600 text-white'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ⚠ Duplicate Replay
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentScenario('PENDING');
                        handleSimulateDonation('PENDING');
                      }}
                      className={`py-1.5 px-2 rounded font-semibold text-left transition-all ${
                        currentScenario === 'PENDING'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ⏳ Proof Pending
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentScenario('REVERT');
                        handleSimulateDonation('REVERT');
                      }}
                      className={`py-1.5 px-2 rounded font-semibold text-left transition-all ${
                        currentScenario === 'REVERT'
                          ? 'bg-red-600 text-white'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ✕ Gas Reversion
                    </button>
                  </div>
                </div>
              )}

              {/* ACTION BUTTONS */}
              {isDemoMode ? (
                <button
                  type="button"
                  onClick={() => handleSimulateDonation('SUCCESS')}
                  disabled={isProcessing}
                  className="w-full py-3 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[17px]">play_arrow</span>
                  <span>{isProcessing ? 'Processing Simulation...' : 'Execute Guided Simulation'}</span>
                </button>
              ) : !isConnected ? (
                <button
                  type="button"
                  onClick={() => {
                    if (connectors.length > 0) connect({ connector: connectors[0] });
                  }}
                  className="w-full py-3 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[17px]">account_balance_wallet</span>
                  <span>Connect Wallet to Donate on Sepolia</span>
                </button>
              ) : !isSepolia ? (
                <button
                  type="button"
                  onClick={() => switchChain({ chainId: sepolia.id })}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[17px]">sync</span>
                  <span>Switch Network to Ethereum Sepolia</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRealDonation}
                  disabled={isProcessing}
                  className="w-full py-3 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[17px]">send</span>
                  <span>{isProcessing ? 'Waiting for Confirmation...' : 'Send Testnet Donation (Ethereum Sepolia)'}</span>
                </button>
              )}

              {/* Alerts */}
              {errorMessage && (
                <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-red-600 mt-0.5 shrink-0">error</span>
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}
              {successMessage && (
                <div className="mt-3 p-3 rounded-lg bg-teal-50 border border-teal-200 text-xs text-teal-800 flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-teal-600 mt-0.5 shrink-0">check_circle</span>
                  <span className="leading-relaxed">{successMessage}</span>
                </div>
              )}
            </div>

            {/* Wallet Info Box */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs text-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="font-semibold">Donor Account</span>
                <span className="text-teal-700 font-bold">
                  {isDemoMode ? 'Simulation Profile' : 'Live Browser Wallet'}
                </span>
              </div>
              <p className="font-mono text-xs text-slate-800 font-semibold truncate">
                {isDemoMode
                  ? '0x71C8391264b192837461928374614f92'
                  : address
                  ? address
                  : 'No wallet connected'}
              </p>
              <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between">
                <span>Network: {isDemoMode ? 'Sepolia (Simulation)' : isSepolia ? 'Sepolia (11155111)' : 'Wrong Network'}</span>
                <span>
                  Balance:{' '}
                  {isDemoMode
                    ? '0.125 SepoliaETH'
                    : balanceData
                    ? `${Number(balanceData.formatted).toFixed(4)} ${balanceData.symbol}`
                    : '0.000'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: 6-Step Verification Pipeline Timeline (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Cross-Chain Verification Pipeline</h2>
                <p className="text-xs text-slate-500">
                  Cryptographic progression from Ethereum Sepolia to Creditcoin CC3.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                {isProcessing ? 'Processing Pipeline...' : 'Ready'}
              </span>
            </div>

            {/* Steps Timeline */}
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 before:z-0">
              {pipelineSteps.map((step) => {
                const isDone = step.status === 'COMPLETED';
                const isActive = step.status === 'ACTIVE';
                const isError = step.status === 'ERROR';
                const isNotConfigured = step.status === 'NOT_CONFIGURED';

                return (
                  <div key={step.id} className="relative z-10 flex items-start gap-4">
                    {/* Step Icon */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                        isDone
                          ? 'bg-teal-700 text-white ring-4 ring-teal-100'
                          : isActive
                          ? 'bg-blue-600 text-white animate-pulse ring-4 ring-blue-100'
                          : isError
                          ? 'bg-red-600 text-white ring-4 ring-red-100'
                          : isNotConfigured
                          ? 'bg-amber-600 text-white ring-4 ring-amber-100'
                          : 'bg-white text-slate-400 border-2 border-slate-300'
                      }`}
                    >
                      {isDone ? (
                        <span className="material-symbols-outlined text-[15px]">check</span>
                      ) : isError ? (
                        <span className="material-symbols-outlined text-[15px]">close</span>
                      ) : isNotConfigured ? (
                        <span className="material-symbols-outlined text-[15px]">warning</span>
                      ) : (
                        step.id
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-900">{step.title}</h3>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            isDone
                              ? 'bg-teal-50 text-teal-700 border border-teal-200'
                              : isActive
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : isError
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : isNotConfigured
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {step.status === 'NOT_CONFIGURED' ? 'NOT CONFIGURED' : step.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{step.subtitle}</p>

                      {step.detail && (
                        <p className="text-[11px] text-slate-600 mt-1.5 pt-1.5 border-t border-slate-200 leading-relaxed">
                          {step.detail}
                        </p>
                      )}

                      {step.hash && (
                        <div className="mt-2 font-mono text-[10px] text-slate-700 bg-white p-2 rounded border border-slate-200 flex items-center justify-between gap-2">
                          <span className="truncate">Hash: {step.hash}</span>
                          {step.explorerUrl && (
                            <a
                              href={step.explorerUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-teal-700 hover:underline font-bold shrink-0 flex items-center gap-0.5"
                            >
                              <span>Explorer</span>
                              <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
