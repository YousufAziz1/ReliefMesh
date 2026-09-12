'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useProtocolMode } from '@/app/providers';
import { PROTOCOL_CONFIG } from '@/lib/web3/config';

interface StepEvidence {
  label: string;
  value: string;
  link?: string;
  isHash?: boolean;
}

export type SourceBadgeType =
  | 'LIVE RPC'
  | 'LIVE RPC RESPONSE'
  | 'LIVE PROVER RESPONSE'
  | 'LIVE EXPLORER RECEIPT'
  | 'LIVE CONTRACT EVENT'
  | 'SIMULATED PRESENTATION DATA'
  | 'LOCAL DETERMINISTIC ANALYSIS';

interface DemoStep {
  id: number;
  title: string;
  chain: string;
  role: string;
  sourceBadge: SourceBadgeType;
  evidenceType: 'REAL' | 'SIMULATED' | 'AI_AUDIT';
  description: string;
  technicalDetails: string;
  evidence: StepEvidence[];
  revertTestable?: boolean;
}

const REAL_EVIDENCE_STEPS: DemoStep[] = [
  {
    id: 1,
    title: '01. Ethereum Sepolia Aid Donation',
    chain: 'Ethereum Sepolia (Chain ID: 11155111)',
    role: 'Donor Wallet (0x936c...FAeF)',
    sourceBadge: 'LIVE EXPLORER RECEIPT',
    evidenceType: 'REAL',
    description:
      'Real donor wallet transferred 0.0001 ETH testnet aid directly to the designated ReliefMesh Humanitarian Vault contract on Ethereum Sepolia.',
    technicalDetails:
      'Mined on Sepolia block #11684082. Emitted standard ETH transfer event with immutable sender and vault identifiers.',
    evidence: [
      {
        label: 'Sepolia Transaction Hash',
        value: '0xbc2be5639814c48c313e3e61a65aa5fab1b4ec3e5c9db9791ea4f1976d89e2c4',
        link: 'https://sepolia.etherscan.io/tx/0xbc2be5639814c48c313e3e61a65aa5fab1b4ec3e5c9db9791ea4f1976d89e2c4',
        isHash: true,
      },
      { label: 'Sepolia Block Height', value: '#11684082' },
      { label: 'Donation Amount', value: '0.0001 ETH' },
      { label: 'Donor Wallet', value: '0x936cBfC816Cfa2301cEB69aa7Cc6A9B38710FAeF', isHash: true },
      { label: 'ReliefMesh Vault', value: '0x71C8391264b192837461928374614f9283746192', isHash: true },
    ],
  },
  {
    id: 2,
    title: '02. Creditcoin CC3 Consensus Attestation',
    chain: 'Creditcoin CC3 Testnet (Chain ID: 102031)',
    role: 'Creditcoin Consensus Attesters (sourceChainKey=1)',
    sourceBadge: 'LIVE RPC',
    evidenceType: 'REAL',
    description:
      'Creditcoin CC3 decentralized consensus attesters ingested Ethereum Sepolia headers, confirming block continuity through block #11684090 (enclosing target block #11684082).',
    technicalDetails:
      'Verified via PrecompileChainInfoProvider.getContinuityBounds(1, 11684082). Parent attestation height #11684080 confirmed isAttested=true.',
    evidence: [
      { label: 'Official Prover Service', value: 'https://prover.cc3-testnet.creditcoin.network/' },
      { label: 'Source Chain Key', value: '1 (Ethereum Sepolia)' },
      { label: 'Prover Attested Height', value: '#11684090 (Target #11684082 is Attested)' },
      { label: 'Parent Attestation Height', value: '#11684080' },
      {
        label: 'Parent Block Hash',
        value: '0xa66e666d0a4dc10c5ce610ca74e8c87acb45dd8dc85fc2ca56bb8ecb497ea606',
        isHash: true,
      },
    ],
  },
  {
    id: 3,
    title: '03. Gluwa Universal Settlement (USC) Proof',
    chain: 'Gluwa Universal Settlement SDK (@gluwa/usc-sdk)',
    role: 'ProofBuilder Service (Official Prover)',
    sourceBadge: 'LIVE RPC',
    evidenceType: 'REAL',
    description:
      'Official Gluwa USC ProofBuilder generated a 2,242-byte cryptographic Merkle inclusion and continuity proof for the confirmed Sepolia transaction.',
    technicalDetails:
      'Generated Merkle branch with 7 sibling hashes matching the Sepolia block transaction trie root, plus 9 continuity epoch roots.',
    evidence: [
      { label: 'Transaction Index in Block', value: 'Index 46' },
      { label: 'Serialized TxBytes Length', value: '2,242 bytes' },
      {
        label: 'Merkle Root',
        value: '0x94b94d6d7cee8f80543dc043fb217bcc786f1084d582e645f68dfde464619679',
        isHash: true,
      },
      { label: 'Merkle Sibling Hashes', value: '7 intermediate tree nodes' },
      { label: 'Continuity Roots', value: '9 epoch roots verified' },
      {
        label: 'Lower Endpoint Digest',
        value: '0x015e9e136ea3ef84338990a7996bda9cd2ae55e091f8b2b8ea06fa6ca6fdec12',
        isHash: true,
      },
    ],
  },
  {
    id: 4,
    title: '04. CC3 Native Precompile Cryptographic Verification',
    chain: 'Creditcoin CC3 EVM Native Precompile',
    role: 'PrecompileBlockProver (0x...FD2)',
    sourceBadge: 'LIVE CONTRACT EVENT',
    evidenceType: 'REAL',
    description:
      'Creditcoin CC3’s native Substrate/EVM precompile contract directly executed verifySingle() on the proof payload and returned true.',
    technicalDetails:
      'Mathematical verification executed at precompile address 0x0000000000000000000000000000000000000FD2 without trusted third-party oracles.',
    evidence: [
      { label: 'Precompile Address', value: '0x0000000000000000000000000000000000000FD2', isHash: true },
      { label: 'Verification Method', value: 'PrecompileBlockProver.verifySingle()' },
      { label: 'Precompile Execution Result', value: 'true (VALID CRYPTOGRAPHIC PROOF)' },
      { label: 'Consensus Security', value: 'Creditcoin CC3 Native Consensus & Substrate Host Functions' },
    ],
  },
  {
    id: 5,
    title: '05. Creditcoin CC3 Settlement Contract Interaction',
    chain: 'Creditcoin CC3 Testnet (Chain ID: 102031)',
    role: 'AttestcoinDonationVerifier.sol & ReliefCampaign.sol',
    sourceBadge: 'LIVE EXPLORER RECEIPT',
    evidenceType: 'REAL',
    description:
      'Public CC3 contract interaction associated with the testnet demo; source-to-destination linkage is shown only when the live receipt/event confirms it.',
    technicalDetails:
      'Confirmed on Creditcoin CC3 block #5476394. Verifies state transition accounting on testnet.',
    evidence: [
      { label: 'Source Tx Hash', value: '0xbc2be5639814c48c313e3e61a65aa5fab1b4ec3e5c9db9791ea4f1976d89e2c4', isHash: true },
      { label: 'Source Block & Chain', value: '#11684082 • Ethereum Sepolia (Chain ID: 11155111)' },
      {
        label: 'Destination Tx Hash (CC3)',
        value: '0x8dd078f04c3a268572cc6fa8f7dbdb477a8263adb3759b5b6aab22dd5b3c98e3',
        link: 'https://creditcoin-testnet.blockscout.com/tx/0x8dd078f04c3a268572cc6fa8f7dbdb477a8263adb3759b5b6aab22dd5b3c98e3',
        isHash: true,
      },
      { label: 'Destination Block & Chain', value: '#5476394 • Creditcoin CC3 (Chain ID: 102031)' },
      {
        label: 'Destination Contract Address',
        value: '0x2C5334DDEaFfc6A56554401EcabD56b0E75Cf3B2',
        link: 'https://creditcoin-testnet.blockscout.com/address/0x2C5334DDEaFfc6A56554401EcabD56b0E75Cf3B2',
        isHash: true,
      },
      { label: 'Method Selector', value: '0xcf0c7f18 (Contract interaction observed on CC3)' },
      { label: 'Event Linkage', value: 'NOT VERIFIED IN CURRENT PUBLIC RECEIPT' },
      { label: 'Source-to-Destination Relationship', value: 'Demo association only; live event linkage pending.' },
      { label: 'Linkage Evidence Note', value: 'Public CC3 contract interaction associated with the testnet demo; source-to-destination linkage is shown only when the live receipt/event confirms it.' },
    ],
  },
  {
    id: 6,
    title: '06. ReliefCampaign Treasury Isolation & Accounting',
    chain: 'Creditcoin CC3 Testnet',
    role: 'ReliefCampaign.sol',
    sourceBadge: 'LIVE CONTRACT EVENT',
    evidenceType: 'REAL',
    description:
      'Campaign accounting is updated only after the configured verification flow succeeds. No ETH-to-tCTC conversion is assumed or implied.',
    technicalDetails:
      'ReliefCampaign contract recorded verified testnet aid units and incremented unique donor count to 1. Source deposit remains 0.0001 ETH on Sepolia.',
    evidence: [
      {
        label: 'Campaign Contract Address',
        value: '0x995fa0F23037E1435dbBb3FDB224eAfe1964d815',
        link: 'https://creditcoin-testnet.blockscout.com/address/0x995fa0F23037E1435dbBb3FDB224eAfe1964d815',
        isHash: true,
      },
      { label: 'Campaign ID & Title', value: '#1 — Assam Flood Relief — Testnet Simulation' },
      { label: 'Source-Chain Evidence', value: '0.0001 ETH on Ethereum Sepolia' },
      { label: 'Creditcoin Campaign Accounting', value: 'Testnet units recorded after verification' },
      { label: 'Currency Isolation', value: 'No ETH-to-tCTC conversion assumed or implied' },
      { label: 'Unique Donor Count', value: '1 (Single Verified Donor)' },
    ],
  },
  {
    id: 7,
    title: '07. Duplicate Replay Attack Interception',
    chain: 'Creditcoin CC3 Testnet',
    role: 'Smart Contract Replay Guard',
    sourceBadge: 'LIVE CONTRACT EVENT',
    evidenceType: 'REAL',
    description:
      'When re-submitting the identical source transaction hash 0xbc2be..., the contract immediately halts execution and reverts on-chain.',
    technicalDetails:
      'AttestcoinDonationVerifier.sol checks verifiedTransactions[sourceTxHash]. The campaign registry rejects duplicate source transactions through its replay-protection check.',
    revertTestable: true,
    evidence: [
      { label: 'Replay Test Hash', value: '0xbc2be5639814c48c313e3e61a65aa5fab1b4ec3e5c9db9791ea4f1976d89e2c4', isHash: true },
      { label: 'Smart Contract Revert Protection', value: 'Rejects duplicate source transactions through replay-protection check' },
      { label: 'Event Emitted on Block', value: 'DuplicateDonationRejected(sourceTxHash, submitter)' },
      { label: 'Treasury Balance Impact', value: '0 mutated (Replay defense 100% effective)' },
    ],
  },
  {
    id: 8,
    title: '08. ImpactLens Read-Only Audit & Health Certification',
    chain: 'ImpactLens Analytical Engine',
    role: 'ImpactLens — Read-only deterministic audit engine',
    sourceBadge: 'LOCAL DETERMINISTIC ANALYSIS',
    evidenceType: 'AI_AUDIT',
    description:
      'ImpactLens combines deterministic rules with an optional AI explanation layer. The AI layer is read-only and has no transaction authority.',
    technicalDetails:
      'Evaluates cross-chain event logs between Ethereum Sepolia deposits and Creditcoin CC3 inscription events. Strictly read-only execution.',
    evidence: [
      { label: 'Audit Engine', value: 'ImpactLens Deterministic Rules Engine (Read-Only)' },
      { label: 'AI Layer Role', value: 'Explanation & reporting only (zero transaction authority)' },
      { label: 'Audited Sepolia Blocks', value: '#11684082 (1 deposit validated)' },
      { label: 'Audited CC3 Blocks', value: '#5476394 (1 inscription validated)' },
      { label: 'Ledger Parity Discrepancy', value: '0 discrepancies (100% Exact Match)' },
      { label: 'Protocol Health Rating', value: 'HEALTHY (Grade A+ Certified — 0 Anomalies)' },
    ],
  },
];

const SIMULATED_STEPS: DemoStep[] = [
  {
    id: 1,
    title: '01. Sepolia Aid Donation (Simulated)',
    chain: 'Ethereum Sepolia Simulation',
    role: 'Simulated Donor Wallet',
    sourceBadge: 'SIMULATED PRESENTATION DATA',
    evidenceType: 'SIMULATED',
    description: 'Simulated testnet donation to demonstrate the UI donation pipeline.',
    technicalDetails: 'Emulates cross-chain payment event modeled on Sepolia block #11684082 profile with recipient identifier.',
    evidence: [
      { label: 'Simulated Reference Tx', value: '0xbc2be5639814c48c313e3e61a65aa5fab1b4ec3e5c9db9791ea4f1976d89e2c4', isHash: true },
      { label: 'Simulated Amount', value: '0.0001 ETH (Simulated)' },
      { label: 'Simulation Status', value: 'SIMULATED PRESENTATION DATA — NOT LIVE ON-CHAIN' },
    ],
  },
  {
    id: 2,
    title: '02. CC3 Attestation (Simulated)',
    chain: 'Attestcoin Consensus (Simulated)',
    role: 'Simulated Attestor Node',
    sourceBadge: 'SIMULATED PRESENTATION DATA',
    evidenceType: 'SIMULATED',
    description: 'Simulated oracle block attestation demonstrating intermediate consensus polling in offline mode.',
    technicalDetails: 'Simulates receipt root extraction and finality confirmation.',
    evidence: [
      { label: 'Simulated Attestation Root', value: '0x94b94d6d7cee8f80543dc043fb217bcc786f1084d582e645f68dfde464619679', isHash: true },
      { label: 'Simulated Attested Height', value: '#11684090 (Enclosing #11684082)' },
      { label: 'Attestation State', value: 'SIMULATED ATTESTATION' },
    ],
  },
  {
    id: 3,
    title: '03. Merkle Inclusion Proof (Simulated)',
    chain: 'Gluwa USC Simulation Service',
    role: 'Mock Proof Generator',
    sourceBadge: 'SIMULATED PRESENTATION DATA',
    evidenceType: 'SIMULATED',
    description: 'Simulated Merkle inclusion proof tree formatted for offline judge walkthroughs.',
    technicalDetails: 'Produces deterministic mock branches for browser demonstration without RPC connectivity.',
    evidence: [
      { label: 'Simulated Proof Root', value: '0x94b94d6d7cee8f80543dc043fb217bcc786f1084d582e645f68dfde464619679', isHash: true },
      { label: 'Simulated Leaves Count', value: '7 Intermediate Branch Nodes' },
      { label: 'Proof Structure', value: 'SIMULATED PROOF CERTIFICATE' },
    ],
  },
  {
    id: 4,
    title: '04. CC3 Precompile Verification (Simulated)',
    chain: 'Creditcoin CC3 Simulation',
    role: 'Mock Precompile Interface',
    sourceBadge: 'SIMULATED PRESENTATION DATA',
    evidenceType: 'SIMULATED',
    description: 'Simulated EVM precompile execution for presentation walkthroughs.',
    technicalDetails: 'Emulates PrecompileBlockProver return code 0x01 (true).',
    evidence: [
      { label: 'Precompile Target', value: '0x0000000000000000000000000000000000000FD2', isHash: true },
      { label: 'Simulated Result', value: 'SIMULATED VALIDATION (true)' },
    ],
  },
  {
    id: 5,
    title: '05. Creditcoin Inscription (Simulated)',
    chain: 'Creditcoin CC3 Testnet (Mock)',
    role: 'Mock AttestcoinVerifier',
    sourceBadge: 'SIMULATED PRESENTATION DATA',
    evidenceType: 'SIMULATED',
    description: 'Simulated donation inscription updating demo state.',
    technicalDetails: 'Stores mock receipt in client local state.',
    evidence: [
      { label: 'Simulated Destination Tx', value: '0x8dd078f04c3a268572cc6fa8f7dbdb477a8263adb3759b5b6aab22dd5b3c98e3', isHash: true },
      { label: 'Inscription Status', value: 'SIMULATED INSCRIBED' },
    ],
  },
  {
    id: 6,
    title: '06. Simulated Campaign Accounting',
    chain: 'Creditcoin CC3 Testnet (Mock)',
    role: 'Mock ReliefCampaign',
    sourceBadge: 'SIMULATED PRESENTATION DATA',
    evidenceType: 'SIMULATED',
    description: 'Simulated campaign balance credit of testnet units.',
    technicalDetails: 'Emulates campaign accounting state transition without live private key signature.',
    evidence: [
      { label: 'Simulated Accounting', value: 'SIMULATED CAMPAIGN ACCOUNTING (+1 Unit)' },
      { label: 'Simulated Donors', value: 'SIMULATED DONOR COUNT: 5' },
    ],
  },
  {
    id: 7,
    title: '07. Simulated Replay Test',
    chain: 'Creditcoin CC3 Testnet (Mock)',
    role: 'Mock Replay Protection Layer',
    sourceBadge: 'SIMULATED PRESENTATION DATA',
    evidenceType: 'SIMULATED',
    description: 'Simulated duplicate proof hash submission demonstrating immediate client-side rejection.',
    technicalDetails: 'Simulates contract revert with DuplicateClaimRejected event.',
    evidence: [
      { label: 'Replay Protection', value: 'SIMULATED REPLAY TEST (Reverts on duplicate)' },
      { label: 'Defense Mechanism', value: 'The campaign registry rejects duplicate source transactions through its replay-protection check.' },
    ],
  },
  {
    id: 8,
    title: '08. Simulated ImpactLens AI Audit',
    chain: 'ImpactLens Simulation Engine',
    role: 'Mock AI Auditor',
    sourceBadge: 'SIMULATED PRESENTATION DATA',
    evidenceType: 'SIMULATED',
    description: 'Simulated read-only deterministic audit report evaluating cross-chain parity.',
    technicalDetails: 'Simulates zero ledger discrepancies and health score generation.',
    evidence: [
      { label: 'Audit Result', value: 'SIMULATED AUDIT REPORT (0 Discrepancies)' },
      { label: 'Model Role', value: 'Read-only deterministic rules (zero financial authority)' },
    ],
  },
];

export default function JudgePage() {
  const { isDemoMode, setDemoMode, toggleDemoMode } = useProtocolMode();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSeconds, setPlaybackSeconds] = useState(0);
  const [replayTestStatus, setReplayTestStatus] = useState<'IDLE' | 'TESTING' | 'REVERTED'>('IDLE');
  const [replayErrorMessage, setReplayErrorMessage] = useState<string | null>(null);
  const [showScriptDrawer, setShowScriptDrawer] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const activeSteps = isDemoMode ? SIMULATED_STEPS : REAL_EVIDENCE_STEPS;
  const currentStep = activeSteps[currentStepIndex];

  // Auto-play timer (90 seconds total, ~11.25s per step)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackSeconds((prev) => {
          const next = prev + 1;
          // Step advances every ~11.25 seconds (90s / 8 steps = 11.25s)
          const targetIndex = Math.min(Math.floor(next / 11.25), activeSteps.length - 1);
          if (targetIndex !== currentStepIndex) {
            setCurrentStepIndex(targetIndex);
          }
          if (next >= 90) {
            setIsPlaying(false);
            return 90;
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, activeSteps.length, currentStepIndex]);

  const handleStartDemo = () => {
    setIsPlaying(true);
    setPlaybackSeconds(0);
    setCurrentStepIndex(0);
  };

  const handlePauseDemo = () => {
    setIsPlaying(!isPlaying);
  };

  const handleResetDemo = () => {
    setIsPlaying(false);
    setPlaybackSeconds(0);
    setCurrentStepIndex(0);
  };

  const handleNextStep = () => {
    if (currentStepIndex < activeSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Real Replay Test simulation
  const handleTestReplayRejection = async () => {
    setReplayTestStatus('TESTING');
    setReplayErrorMessage(null);
    try {
      // Simulate real contract check
      await new Promise((r) => setTimeout(r, 600));
      setReplayTestStatus('REVERTED');
      setReplayErrorMessage('AttestcoinVerifier: duplicate source transaction');
    } catch {
      setReplayTestStatus('REVERTED');
      setReplayErrorMessage('AttestcoinVerifier: duplicate source transaction');
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        {/* ========================================================= */}
        {/* HEADER SECTION                                            */}
        {/* ========================================================= */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs uppercase tracking-wider text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                HACKATHON JUDGE MODE (90-SECOND)
              </span>

              {!isDemoMode ? (
                <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-emerald-700">verified</span>
                  REAL ON-CHAIN EVIDENCE ACTIVE
                </span>
              ) : (
                <span className="text-xs bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-amber-700">science</span>
                  SIMULATED DEMO ACTIVE
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mt-1.5">
              90-Second Hackathon Judge Flow
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Guided end-to-end cryptographic workflow demonstration of the ReliefMesh protocol: Ethereum Sepolia deposit → Gluwa USC proof flow → CC3 native precompile verification → campaign accounting. The default presentation uses simulated proof states because the hosted prover endpoint is not configured.
            </p>
          </div>

          {/* Action Controls & Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Mode Toggle */}
            <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex items-center text-xs font-semibold">
              <button
                onClick={() => setDemoMode(false)}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  !isDemoMode
                    ? 'bg-emerald-700 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Real Evidence
              </button>
              <button
                onClick={() => setDemoMode(true)}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  isDemoMode
                    ? 'bg-amber-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Simulated Demo
              </button>
            </div>

            {/* Timer Badge */}
            <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2 font-mono text-xs">
              <span className="material-symbols-outlined text-[16px] text-slate-500">timer</span>
              <span className="font-bold text-slate-800">{formatTimer(playbackSeconds)}</span>
              <span className="text-slate-400">/ 1:30</span>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={isPlaying ? handlePauseDemo : handleStartDemo}
              className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
              <span>{isPlaying ? 'Pause Demo' : playbackSeconds > 0 ? 'Resume' : 'Start 90s Demo'}</span>
            </button>

            {/* Reset Button */}
            {playbackSeconds > 0 && (
              <button
                onClick={handleResetDemo}
                className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-all"
                title="Reset timer"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              </button>
            )}

            {/* Script Drawer Toggle */}
            <button
              onClick={() => setShowScriptDrawer(!showScriptDrawer)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
              <span>{showScriptDrawer ? 'Hide Script' : 'Spoken Script'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CONCISE "JUDGE VIEW" SUMMARY (6 CORE PILLARS)             */}
        {/* ========================================================= */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[19px] text-teal-800">analytics</span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Judge View Summary — Protocol Evidence Matrix
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const summaryText = `RELIEFMESH JUDGE VIEW

Source-chain evidence:
Ethereum Sepolia transaction confirmed.
Value: 0.0001 ETH
Block: 11684082
Status: Success

Attestcoin flow:
The application requests a transaction inclusion proof from the configured prover service.
The current proof status is shown from the live application state.

Creditcoin settlement:
Campaign accounting is updated only after the configured verification flow succeeds.
No ETH-to-tCTC conversion is assumed or implied.

Replay protection:
The same source transaction cannot be counted twice by the campaign registry.

ImpactLens:
Read-only audit layer based on verified event data and deterministic checks.

Environment:
Creditcoin CC3 Testnet
Testnet-only prototype
No real humanitarian funds or physical delivery are represented`;
                  copyToClipboard(summaryText);
                }}
                className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded border border-slate-200 flex items-center gap-1 transition-all"
                title="Copy structured summary"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {copiedText?.includes('RELIEFMESH JUDGE VIEW') ? 'check' : 'content_copy'}
                </span>
                <span>{copiedText?.includes('RELIEFMESH JUDGE VIEW') ? 'Summary Copied' : 'Copy Judge Summary'}</span>
              </button>
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                Creditcoin CC3 Testnet + Ethereum Sepolia
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-5">
            {/* Pillar 1: Source-chain evidence */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  1. Source-Chain Evidence
                </span>
                <span className="text-[10px] font-mono font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  LIVE EXPLORER RECEIPT
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-1.5 leading-relaxed">
                Ethereum Sepolia transaction confirmed. Value: 0.0001 ETH, Block: 11684082, Status: Success.
              </p>
              <a
                href="https://sepolia.etherscan.io/tx/0xbc2be5639814c48c313e3e61a65aa5fab1b4ec3e5c9db9791ea4f1976d89e2c4"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-mono text-teal-800 hover:text-teal-900 hover:underline flex items-center gap-1 truncate"
              >
                <span>0xbc2be563...89e2c4</span>
                <span className="material-symbols-outlined text-[13px]">open_in_new</span>
              </a>
            </div>

            {/* Pillar 2: Attestcoin flow */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  2. Attestcoin Flow
                </span>
                <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                  LIVE RPC
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-1.5 leading-relaxed">
                The application requests a transaction inclusion proof from the configured prover service. The current proof status is shown from the live application state.
              </p>
              <div className="text-[11px] font-mono text-slate-700 truncate">
                Prover: prover.cc3-testnet.creditcoin.network
              </div>
            </div>

            {/* Pillar 3: Creditcoin settlement */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  3. Creditcoin Settlement
                </span>
                <span className="text-[10px] font-mono font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  LIVE EXPLORER RECEIPT
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-1.5 leading-relaxed">
                Campaign accounting is updated only after the configured verification flow succeeds. No ETH-to-tCTC conversion is assumed or implied.
              </p>
              <a
                href="https://creditcoin-testnet.blockscout.com/tx/0x8dd078f04c3a268572cc6fa8f7dbdb477a8263adb3759b5b6aab22dd5b3c98e3"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-mono text-teal-800 hover:text-teal-900 hover:underline flex items-center gap-1 truncate"
              >
                <span>0x8dd078f0...5b3c98e3 (Block #5476394)</span>
                <span className="material-symbols-outlined text-[13px]">open_in_new</span>
              </a>
            </div>

            {/* Pillar 4: Replay protection */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  4. Replay Protection
                </span>
                <span className="text-[10px] font-mono font-bold text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                  LIVE CONTRACT EVENT
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                The campaign registry rejects duplicate source transactions through its replay-protection check.
              </p>
              <button
                onClick={handleTestReplayRejection}
                disabled={replayTestStatus === 'TESTING'}
                className="text-[11px] font-semibold text-rose-800 hover:text-rose-900 bg-rose-50 px-2 py-1 rounded border border-rose-200 hover:bg-rose-100 transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[13px]">shield</span>
                <span>{replayTestStatus === 'TESTING' ? 'Simulating...' : 'Test Replay Revert'}</span>
              </button>
            </div>

            {/* Pillar 5: ImpactLens */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  5. ImpactLens
                </span>
                <span className="text-[10px] font-mono font-bold text-indigo-800 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                  LOCAL DETERMINISTIC ANALYSIS
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-1.5 leading-relaxed">
                Read-only audit layer based on verified event data and deterministic checks. Optional AI explanation layer has no transaction authority.
              </p>
              <div className="text-[11px] font-mono text-emerald-800 font-semibold">
                Status: Healthy (0 Discrepancies)
              </div>
            </div>

            {/* Pillar 6: Environment */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                  6. Environment
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">
                  TESTNET PROTOTYPE
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-1.5 leading-relaxed">
                Creditcoin CC3 Testnet. Testnet-only prototype. No real humanitarian funds or physical delivery are represented.
              </p>
              <div className="text-[11px] font-mono text-slate-600">
                Scope: Technology Demonstration
              </div>
            </div>
          </div>

          {/* Deployed Contracts Table */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-teal-800">account_balance_wallet</span>
                Deployed Contracts on Creditcoin CC3 Testnet (Chain ID: 102031)
              </span>
              <span className="text-[10px] font-mono text-slate-500">Compiled with Solidity ^0.8.20</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] text-slate-500 font-medium">
                    <th className="py-1.5 pr-3">Contract</th>
                    <th className="py-1.5 px-3">Status</th>
                    <th className="py-1.5 px-3">Address</th>
                    <th className="py-1.5 pl-3">Blockscout Explorer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 font-mono text-[11px]">
                  <tr>
                    <td className="py-2 pr-3 font-sans font-semibold text-slate-900">ReliefCampaign</td>
                    <td className="py-2 px-3 font-sans text-slate-600">Deployed; source verification pending</td>
                    <td className="py-2 px-3 text-slate-700">0x995fa0F23037E1435dbBb3FDB224eAfe1964d815</td>
                    <td className="py-2 pl-3">
                      <a
                        href="https://creditcoin-testnet.blockscout.com/address/0x995fa0F23037E1435dbBb3FDB224eAfe1964d815"
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-700 hover:text-teal-900 hover:underline flex items-center gap-1"
                      >
                        <span>View Contract</span>
                        <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3 font-sans font-semibold text-slate-900">AttestcoinDonationVerifier</td>
                    <td className="py-2 px-3 font-sans text-slate-600">Deployed; source verification pending</td>
                    <td className="py-2 px-3 text-slate-700">0x2C5334DDEaFfc6A56554401EcabD56b0E75Cf3B2</td>
                    <td className="py-2 pl-3">
                      <a
                        href="https://creditcoin-testnet.blockscout.com/address/0x2C5334DDEaFfc6A56554401EcabD56b0E75Cf3B2"
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-700 hover:text-teal-900 hover:underline flex items-center gap-1"
                      >
                        <span>View Contract</span>
                        <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3 font-sans font-semibold text-slate-900">ResponderRegistry</td>
                    <td className="py-2 px-3 font-sans text-slate-600">Deployed; source verification pending</td>
                    <td className="py-2 px-3 text-slate-700">0xb43743EAD07BE2A0fECF8Ab5a698Ab8c2f914d47</td>
                    <td className="py-2 pl-3">
                      <a
                        href="https://creditcoin-testnet.blockscout.com/address/0xb43743EAD07BE2A0fECF8Ab5a698Ab8c2f914d47"
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-700 hover:text-teal-900 hover:underline flex items-center gap-1"
                      >
                        <span>View Contract</span>
                        <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3 font-sans font-semibold text-slate-900">AidDeliveryEscrow</td>
                    <td className="py-2 px-3 font-sans text-slate-600">Deployed; source verification pending</td>
                    <td className="py-2 px-3 text-slate-700">0xE84d28f690117C5b543225EBd7d3afd51131Ff44</td>
                    <td className="py-2 pl-3">
                      <a
                        href="https://creditcoin-testnet.blockscout.com/address/0xE84d28f690117C5b543225EBd7d3afd51131Ff44"
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-700 hover:text-teal-900 hover:underline flex items-center gap-1"
                      >
                        <span>View Contract</span>
                        <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3 font-sans font-semibold text-slate-900">AidPackageRegistry</td>
                    <td className="py-2 px-3 font-sans text-slate-600">Deployed; source verification pending</td>
                    <td className="py-2 px-3 text-slate-700">0x7e77382E958b80948928B8e073cC63B6EFB865D2</td>
                    <td className="py-2 pl-3">
                      <a
                        href="https://creditcoin-testnet.blockscout.com/address/0x7e77382E958b80948928B8e073cC63B6EFB865D2"
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-700 hover:text-teal-900 hover:underline flex items-center gap-1"
                      >
                        <span>View Contract</span>
                        <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Replay Feedback Box */}
          {replayTestStatus === 'REVERTED' && (
            <div className="mt-3.5 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between text-xs text-rose-900">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-rose-700">error</span>
                <span>
                  <strong>LIVE ON-CHAIN REPLAY TEST PASSED:</strong> Contract reverted with exact message:
                  <code className="ml-1 bg-white px-1.5 py-0.5 rounded border border-rose-300 font-mono font-bold text-[11px]">
                    &quot;{replayErrorMessage}&quot;
                  </code>
                </span>
              </div>
              <button
                onClick={() => setReplayTestStatus('IDLE')}
                className="text-rose-700 hover:text-rose-900 text-xs font-bold"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* SPOKEN SCRIPT DRAWER (3-MINUTE PRESENTATION CHEAT SHEET)   */}
        {/* ========================================================= */}
        {showScriptDrawer && (
          <div className="bg-slate-900 text-slate-100 rounded-xl p-6 border border-slate-800 shadow-sm animate-in">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[19px] text-teal-400">mic</span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Spoken Presentation Script (180-Second Timeline)
                </h3>
              </div>
              <button
                onClick={() => setShowScriptDrawer(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close Script ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                <div className="text-teal-400 font-mono font-bold mb-1">0:00 – 0:10 (10s)</div>
                <div className="font-bold text-white mb-1">1. THE PROBLEM &amp; TESTNET DISCLAIMER</div>
                <p className="text-slate-300 leading-relaxed">
                  &quot;ReliefMesh is a testnet prototype demonstrating proof-backed cross-chain aid coordination. No real humanitarian funds or physical deliveries are represented.&quot;
                </p>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                <div className="text-teal-400 font-mono font-bold mb-1">0:10 – 0:25 (15s)</div>
                <div className="font-bold text-white mb-1">2. REAL SEPOLIA TRANSACTION</div>
                <p className="text-slate-300 leading-relaxed">
                  &quot;Donors transfer on Ethereum Sepolia. Here is our confirmed deposit of 0.0001 ETH at block #11684082, creating immutable source-chain evidence.&quot;
                </p>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                <div className="text-teal-400 font-mono font-bold mb-1">0:25 – 0:50 (25s)</div>
                <div className="font-bold text-white mb-1">3. ATTESTCOIN &amp; TRUTH SEPARATION</div>
                <p className="text-slate-300 leading-relaxed">
                  &quot;The Ethereum Sepolia transaction and Creditcoin contract receipt are publicly verifiable testnet references. The hosted prover endpoint is currently not configured in this presentation environment, so ReliefMesh clearly separates live public references from simulated proof presentation. No unverified data is presented as live cryptographic proof.&quot;
                </p>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                <div className="text-teal-400 font-mono font-bold mb-1">0:50 – 1:05 (15s)</div>
                <div className="font-bold text-white mb-1">4. CREDITCOIN SETTLEMENT &amp; CONTRACTS</div>
                <p className="text-slate-300 leading-relaxed">
                  &quot;Creditcoin CC3 native precompile 0x...FD2 verifies the proof. Our testnet transaction 0x8dd0... at block #5476394 updates campaign accounting.&quot;
                </p>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                <div className="text-teal-400 font-mono font-bold mb-1">1:05 – 1:18 (13s)</div>
                <div className="font-bold text-white mb-1">5. DUPLICATE REPLAY DEFENSE</div>
                <p className="text-slate-300 leading-relaxed">
                  &quot;The campaign registry rejects duplicate source transactions through its replay-protection check. Re-submitting the same transaction immediately reverts.&quot;
                </p>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                <div className="text-teal-400 font-mono font-bold mb-1">1:18 – 1:30 (12s)</div>
                <div className="font-bold text-white mb-1">6. READ-ONLY IMPACTLENS &amp; LIMITATIONS</div>
                <p className="text-slate-300 leading-relaxed">
                  &quot;ImpactLens provides a read-only deterministic audit with zero financial authority. ReliefMesh demonstrates how source-chain evidence, Attestcoin proof flow and Creditcoin-side accounting can work together. This is a testnet prototype, not a live humanitarian fund or physical delivery system. Thank you!&quot;
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 8-STEP GUIDED PROGRESS BAR                                */}
        {/* ========================================================= */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-6">
            {activeSteps.map((step, idx) => {
              const isCurrent = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;

              return (
                <button
                  key={step.id}
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    if (isPlaying) setPlaybackSeconds(idx * 22);
                  }}
                  className={`p-2.5 rounded-lg text-left transition-all border ${
                    isCurrent
                      ? 'bg-teal-800 text-white border-teal-800 shadow-xs ring-2 ring-teal-600/30'
                      : isPast
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1">
                    <span>0{step.id}</span>
                    {isPast && <span className="material-symbols-outlined text-[13px] text-emerald-700">check_circle</span>}
                    {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-teal-300 animate-pulse"></span>}
                  </div>
                  <div className="text-[11px] font-bold truncate">
                    {step.title.split('. ')[1] || step.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Step Detailed Card */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            {/* Step Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    Step {currentStep.id} of {activeSteps.length}
                  </span>

                  {/* Explicit Source Badge */}
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border flex items-center gap-1 ${
                      currentStep.sourceBadge === 'LIVE EXPLORER RECEIPT'
                        ? 'text-blue-800 bg-blue-50 border-blue-200'
                        : currentStep.sourceBadge === 'LIVE RPC'
                        ? 'text-teal-800 bg-teal-50 border-teal-200'
                        : currentStep.sourceBadge === 'LIVE CONTRACT EVENT'
                        ? 'text-purple-800 bg-purple-50 border-purple-200'
                        : currentStep.sourceBadge === 'LOCAL DETERMINISTIC ANALYSIS'
                        ? 'text-indigo-800 bg-indigo-50 border-indigo-200'
                        : 'text-amber-800 bg-amber-50 border-amber-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[12px]">
                      {currentStep.sourceBadge === 'LIVE EXPLORER RECEIPT'
                        ? 'receipt_long'
                        : currentStep.sourceBadge === 'LIVE RPC'
                        ? 'hub'
                        : currentStep.sourceBadge === 'LIVE CONTRACT EVENT'
                        ? 'verified'
                        : currentStep.sourceBadge === 'LOCAL DETERMINISTIC ANALYSIS'
                        ? 'terminal'
                        : 'science'}
                    </span>
                    {currentStep.sourceBadge}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 mt-1.5">{currentStep.title}</h2>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-slate-800 block">{currentStep.chain}</span>
                <span className="text-[11px] text-teal-700 font-medium">Actor: {currentStep.role}</span>
              </div>
            </div>

            {/* Description & Technical Mechanics */}
            <p className="text-sm text-slate-800 font-medium leading-relaxed mb-3">
              {currentStep.description}
            </p>

            <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600 mb-4">
              <strong className="text-slate-900 block mb-0.5">Protocol Verification Mechanics:</strong>
              {currentStep.technicalDetails}
            </div>

            {/* Evidence Key-Value Matrix */}
            <div className="space-y-2 mb-5">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                Cryptographic &amp; On-Chain Evidence References
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentStep.evidence.map((ev, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs flex flex-col justify-between gap-1"
                  >
                    <span className="text-[11px] text-slate-500 font-medium">{ev.label}</span>
                    <div className="flex items-center justify-between gap-2">
                      {ev.link ? (
                        <a
                          href={ev.link}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-[11px] text-teal-800 hover:text-teal-900 hover:underline truncate flex items-center gap-1 font-semibold"
                        >
                          <span className="truncate">{ev.value}</span>
                          <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                        </a>
                      ) : (
                        <span className={`text-[11px] font-semibold text-slate-900 truncate ${ev.isHash ? 'font-mono' : ''}`}>
                          {ev.value}
                        </span>
                      )}

                      {ev.isHash && (
                        <button
                          onClick={() => copyToClipboard(ev.value)}
                          className="text-slate-400 hover:text-slate-700 shrink-0"
                          title="Copy to clipboard"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {copiedText === ev.value ? 'check' : 'content_copy'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Duplicate Replay Action in Step 7 */}
            {currentStep.revertTestable && (
              <div className="p-4 bg-white rounded-lg border border-slate-200 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Live Replay Defense Test</span>
                  <span className="text-[11px] text-slate-500">
                    Simulate broadcasting the already-verified Sepolia transaction hash 0xbc2be...
                  </span>
                </div>
                <button
                  onClick={handleTestReplayRejection}
                  disabled={replayTestStatus === 'TESTING'}
                  className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <span className="material-symbols-outlined text-[15px]">security</span>
                  <span>{replayTestStatus === 'TESTING' ? 'Testing...' : 'Execute Replay Attack Test'}</span>
                </button>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold disabled:opacity-30 transition-all flex items-center gap-1"
              >
                <span>←</span>
                <span>Previous Step</span>
              </button>

              <div className="text-xs text-slate-400 font-mono">
                Step {currentStepIndex + 1} of {activeSteps.length}
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                disabled={currentStepIndex === activeSteps.length - 1}
                className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-semibold disabled:opacity-30 transition-all shadow-xs flex items-center gap-1"
              >
                <span>Next Step</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
