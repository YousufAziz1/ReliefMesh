'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import { useProtocolMode } from '@/app/providers';
import { INITIAL_CAMPAIGN, INITIAL_ACTIVITIES } from '@/lib/demo/data';

export default function OverviewPage() {
  const { isDemoMode } = useProtocolMode();
  const [campaign, setCampaign] = useState(INITIAL_CAMPAIGN);

  const verifiedPct = (campaign.verifiedDonations / campaign.goal) * 100;
  const escrowPct = (campaign.pendingEscrow / campaign.goal) * 100;
  const grantsPct = (campaign.dispatchedGrants / campaign.goal) * 100;
  const deltaPct = (campaign.remainingDelta / campaign.goal) * 100;

  const pillars = [
    {
      title: isDemoMode ? 'ATTESTCOIN FLOW SIMULATED' : 'ATTESTCOIN PROOF VERIFIED',
      subtitle: isDemoMode ? 'Ethereum Sepolia Simulation' : 'Ethereum Sepolia Proofs',
      desc: isDemoMode
        ? 'Simulated cryptographic storage inclusion flow modeling Sepolia block evidence without live prover API keys.'
        : 'Cryptographic storage inclusion proofs mined on Ethereum Sepolia block headers, eliminating centralized bridge risk.',
      icon: 'verified',
      color: 'text-teal-700 bg-teal-50 border-teal-200',
    },
    {
      title: isDemoMode ? 'CREDITCOIN SETTLEMENT SIMULATED' : 'CREDITCOIN RECEIPT CONFIRMED',
      subtitle: isDemoMode ? 'CC3 Ledger Simulation' : 'CC3 Consensus Layer',
      desc: isDemoMode
        ? 'Multi-party campaign accounting and state transition simulation modeled on Creditcoin CC3 ledger.'
        : 'Immutable state transitions and multi-party campaign accounting inscribed on Creditcoin CC3 Testnet.',
      icon: 'account_balance',
      color: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      title: 'AI EXPLAINED',
      subtitle: 'ImpactLens Audit Engine',
      desc: 'Read-only deterministic verification engine auditing telemetry and delivery proofs without financial control.',
      icon: 'psychology',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'SMART CONTRACT ENFORCED',
      subtitle: 'Milestone Escrow',
      desc: 'Mathematical duplicate claim rejection with milestone-gated testnet reward distribution to verified nodes.',
      icon: 'security',
      color: 'text-purple-700 bg-purple-50 border-purple-200',
    },
  ];

  const lifecycleSteps = [
    { num: '01', title: 'Cross-Chain Donation', desc: 'Donor initiates testnet transfer on Ethereum Sepolia.' },
    {
      num: '02',
      title: isDemoMode ? 'Attestcoin Proof (Simulated)' : 'Attestcoin Proof Mined',
      desc: isDemoMode
        ? 'Inclusion proof payload simulated against Sepolia block header.'
        : 'Inclusion proof mined against Sepolia block header.',
    },
    {
      num: '03',
      title: isDemoMode ? 'Creditcoin Verification (Simulated)' : 'Creditcoin Verification',
      desc: isDemoMode
        ? 'CC3 smart contract verification flow simulated.'
        : 'CC3 smart contract verifies cryptographic attestation.',
    },
    {
      num: '04',
      title: isDemoMode ? 'Campaign Accounting (Simulated)' : 'Campaign Accounting Inscribed',
      desc: isDemoMode
        ? 'Campaign accounting credited in simulation mode.'
        : 'Campaign accounting credited on Creditcoin CC3 ledger.',
    },
    { num: '05', title: 'Task Routing', desc: 'Aid mission dispatched to active Virtual Responder Node.' },
    { num: '06', title: 'Delivery Proof Signed', desc: 'Responder node signs completion proof with SHA-256 hash.' },
    { num: '07', title: 'Reward Released', desc: 'AidDeliveryEscrow dispatches bounded testnet incentive.' },
    { num: '08', title: 'ImpactLens Audit', desc: 'Analytical engine flags anomalies and publishes audit report.' },
  ];

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        {/* Top Protocol Telemetry Ticker */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
                <span className="text-xs uppercase tracking-wider text-teal-800 font-bold">
                  {isDemoMode ? 'SIMULATED PROTOCOL TELEMETRY' : 'LIVE PROTOCOL TELEMETRY'}
                </span>
                <span className="text-xs text-slate-400 font-mono">| Synced to Block #1,482,904</span>
                <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  TESTNET PROTOTYPE · NO REAL FUNDS · NO REAL EMERGENCY OPERATIONS
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">
                Proof-backed cross-chain aid coordination
              </h1>
              <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                ReliefMesh is a testnet prototype for proof-backed cross-chain aid coordination. It demonstrates how Attestcoin can verify source-chain evidence while Creditcoin contracts enforce campaign accounting and duplicate protection.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/judge"
                className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                <span>ENTER LIVE DEMO (8-STEP SUITE)</span>
              </Link>
              <Link
                href="/proofs"
                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                <span>AUDIT PROOFS</span>
              </Link>
            </div>
          </div>

          {/* Multi-Segment Fund Vault Routing Bar */}
          <div className="pt-5">
            <div className="flex flex-wrap items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-700">Multi-Segment Fund Vault Routing</span>
              <span className="font-mono font-bold text-slate-900">
                Target Cap: {campaign.goal.toLocaleString()} tCTC
              </span>
            </div>

            {/* Visual Segments */}
            <div className="w-full h-3.5 rounded-full bg-slate-100 flex overflow-hidden p-0.5 border border-slate-200">
              <div
                style={{ width: `${verifiedPct}%` }}
                className="bg-teal-700 h-full rounded-l-full transition-all"
                title={`Verified Funding: ${campaign.verifiedDonations} tCTC`}
              ></div>
              <div
                style={{ width: `${escrowPct}%` }}
                className="bg-amber-500 h-full transition-all"
                title={`Pending Escrow: ${campaign.pendingEscrow} tCTC`}
              ></div>
              <div
                style={{ width: `${grantsPct}%` }}
                className="bg-emerald-500 h-full transition-all"
                title={`Dispatched Grants: ${campaign.dispatchedGrants} tCTC`}
              ></div>
              <div
                style={{ width: `${deltaPct}%` }}
                className="bg-slate-200 h-full rounded-r-full transition-all"
                title={`Remaining Delta: ${campaign.remainingDelta} tCTC`}
              ></div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-700"></span>
                <span className="text-slate-600">Verified Funding:</span>
                <strong className="text-slate-900 font-mono">{campaign.verifiedDonations} tCTC</strong>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-slate-600">Pending Escrow:</span>
                <strong className="text-slate-900 font-mono">{campaign.pendingEscrow} tCTC</strong>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-600">Dispatched Grants:</span>
                <strong className="text-slate-900 font-mono">{campaign.dispatchedGrants} tCTC</strong>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                <span className="text-slate-600">Remaining Delta:</span>
                <strong className="text-slate-900 font-mono">{campaign.remainingDelta} tCTC</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Core Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-xs text-slate-500 font-medium">
              {isDemoMode ? 'TOTAL SIMULATED FLOW' : 'TOTAL VERIFIED FLOW'}
            </span>
            <div className="my-2">
              <div className="text-2xl font-bold font-mono text-slate-900">320 tCTC</div>
              <span className="text-[11px] text-teal-700 font-semibold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[13px]">trending_up</span>
                14 Donors Verified
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              {isDemoMode ? 'Sepolia → CC3 Simulated' : 'Sepolia → CC3 Attested'}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-xs text-slate-500 font-medium">VIRTUAL RESPONDERS</span>
            <div className="my-2">
              <div className="text-2xl font-bold font-mono text-slate-900">03 Nodes</div>
              <span className="text-[11px] text-teal-700 font-semibold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[13px]">check_circle</span>
                100% Operational
              </span>
            </div>
            <span className="text-[10px] text-slate-400">Assam Sector 1-4</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-xs text-slate-500 font-medium">STORAGE DROPS</span>
            <div className="my-2">
              <div className="text-2xl font-bold font-mono text-slate-900">05 Hits</div>
              <span className="text-[11px] text-blue-700 font-semibold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[13px]">inventory</span>
                3 Delivered / 2 In Transit
              </span>
            </div>
            <span className="text-[10px] text-slate-400">RWA Represented</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-xs text-slate-500 font-medium">DISPATCHED REWARDS</span>
            <div className="my-2">
              <div className="text-2xl font-bold font-mono text-slate-900">128 tCTC</div>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[13px]">lock</span>
                Zero Duplicate Claims
              </span>
            </div>
            <span className="text-[10px] text-slate-400">Milestone Escrow</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-xs text-slate-500 font-medium">ACTIVE CAMPAIGN</span>
            <div className="my-2">
              <div className="text-lg font-bold text-slate-900 truncate">Assam Relief</div>
              <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[13px]">radar</span>
                Testnet Simulation
              </span>
            </div>
            <span className="text-[10px] text-slate-400">Goal: 1,000 tCTC</span>
          </div>
        </div>

        {/* 4 Architecture Pillars */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">Architecture Pillar Integrity</h2>
            <p className="text-xs text-slate-500">
              Cryptographic separation of concerns: Oracles prove, CC3 settles, Escrow bounds, and AI audits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pillars.map((p, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${p.color}`}>
                      <span className="material-symbols-outlined text-[18px]">{p.icon}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Pillar 0{idx + 1}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">{p.title}</h3>
                  <div className="text-[11px] text-teal-800 font-medium mb-1.5">{p.subtitle}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Aid Coordination Lifecycle in 8 Steps */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isDemoMode ? 'Aid Coordination Lifecycle (Simulated Flow)' : 'Verified Aid Coordination Lifecycle'}
              </h2>
              <p className="text-xs text-slate-500">
                End-to-end deterministic progression from Ethereum Sepolia donation to field node reward release.
              </p>
            </div>
            <Link
              href="/judge"
              className="text-xs text-teal-700 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Walk through in Judge Mode</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {lifecycleSteps.map((step) => (
              <div
                key={step.num}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-teal-300 transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    Step {step.num}
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-slate-400">check_circle</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Mini-Feed */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Protocol Activity</h2>
              <p className="text-xs text-slate-500">Verified cross-chain inscriptions and milestone completions.</p>
            </div>
            <Link href="/activity" className="text-xs text-teal-700 font-semibold hover:underline">
              View Full Activity Feed →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {INITIAL_ACTIVITIES.slice(0, 4).map((act) => (
              <div key={act.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      act.status === 'SUCCESS' ? 'bg-teal-50 text-teal-700' : 'bg-red-50 text-red-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {act.status === 'SUCCESS' ? 'check' : 'block'}
                    </span>
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-slate-900">{act.title}</div>
                    <div className="text-[11px] text-slate-500">{act.description}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-xs text-slate-700 font-semibold">{act.amount || act.status}</div>
                  <div className="text-[10px] text-slate-400">{act.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
