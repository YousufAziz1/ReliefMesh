'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { INITIAL_RESPONDERS, INITIAL_PACKAGES, INITIAL_CAMPAIGN } from '@/lib/demo/data';
import { generateDeterministicAudit, ImpactLensReport } from '@/lib/ai/impactlens';
import { PROTOCOL_CONFIG } from '@/lib/web3/config';

export default function RespondersPage() {
  const [responders] = useState(INITIAL_RESPONDERS);
  const [packages] = useState(INITIAL_PACKAGES);
  const [report, setReport] = useState<ImpactLensReport>(() =>
    generateDeterministicAudit(INITIAL_CAMPAIGN, INITIAL_RESPONDERS, INITIAL_PACKAGES)
  );
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'AUDIT' | 'PACKAGES'>('OVERVIEW');
  const [auditRunning, setAuditRunning] = useState(false);
  const [escrowActionStatus, setEscrowActionStatus] = useState<
    'IDLE' | 'PROCESSING' | 'SUCCESS' | 'DUPLICATE_CAUGHT' | 'NOT_CONFIGURED' | 'REJECTED'
  >('IDLE');
  const [escrowFeedback, setEscrowFeedback] = useState<string | null>(null);

  const runLiveAudit = () => {
    setAuditRunning(true);
    setTimeout(() => {
      setReport(generateDeterministicAudit(INITIAL_CAMPAIGN, INITIAL_RESPONDERS, INITIAL_PACKAGES));
      setAuditRunning(false);
    }, 600);
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        {/* Header Title */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
              <span className="text-xs uppercase tracking-wider text-teal-800 font-bold">
                FIELD TELEMETRY &amp; AI VERIFICATION
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              Responder Nodes &amp; ImpactLens AI
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Autonomous verification of field node deployments and analytical proof evaluation on Creditcoin CC3.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runLiveAudit}
              disabled={auditRunning}
              className="px-3.5 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[15px] ${auditRunning ? 'animate-spin' : ''}`}>
                refresh
              </span>
              <span>{auditRunning ? 'Running Audit...' : 'Re-Run ImpactLens'}</span>
            </button>
          </div>
        </div>

        {/* 3 Virtual Responder Nodes Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Active Virtual Responder Nodes (3)
            </h2>
            <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              VIRTUAL DEPLOYMENT NODES — TESTNET SIMULATION
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {responders.map((node) => (
              <div
                key={node.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-teal-400 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {node.id}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 bg-teal-50/50 px-2 py-0.5 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                      {node.status}
                    </span>
                  </div>

                  <div className="mt-3">
                    <h3 className="text-base font-bold text-slate-900">{node.name}</h3>
                    <p className="text-xs text-slate-500">{node.role}</p>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Deployment Sector:</span>
                      <strong className="text-slate-900 text-right">{node.zone}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Battery Status:</span>
                      <strong className="text-teal-700">{node.battery}%</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Reputation:</span>
                      <strong className="text-slate-900 font-mono">{node.reputation}/100</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Completed Deliveries:</span>
                      <strong className="text-slate-900 font-mono">{node.deliveries} Verified</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Rewards Earned:</span>
                      <strong className="text-emerald-700 font-mono">{node.rewardsEarned} tCTC</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">
                    Latest Proof Hash
                  </span>
                  <p className="font-mono text-[10px] text-slate-700 truncate bg-slate-50 p-1.5 rounded border border-slate-200">
                    {node.latestProofHash}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Escrow Task & Reward Release Panel */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-teal-700">lock_clock</span>
                <h2 className="text-base font-bold text-slate-900">
                  AidDeliveryEscrow — Milestone Task Verification &amp; Reward
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                On-chain milestone verification enforcing active responder status, non-duplicate delivery proofs, and bounded testnet payouts.
              </p>
            </div>
            <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
              Contract: {PROTOCOL_CONFIG.contracts.aidEscrow.slice(0, 8)}...{PROTOCOL_CONFIG.contracts.aidEscrow.slice(-6)}
            </span>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-900">Task #101:</span>
                <span className="text-xs font-semibold text-slate-800">
                  Brahmaputra Sector B — Water Purification Pods Distribution
                </span>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Proof Verified
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Assigned: <strong className="text-slate-700">NODE-ALPHA</strong> (0x71C...4f92) • Reward: <strong className="text-teal-800 font-mono">48.00 tCTC</strong>
              </p>
              <div className="font-mono text-[10px] text-slate-400">
                Proof Hash: 0x8a9fc4219b48c823ea47b912a7810459c381fbc0293847e091b489a29184c4a1
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={async () => {
                  setEscrowActionStatus('PROCESSING');
                  setEscrowFeedback(null);
                  try {
                    const res = await fetch('/api/escrow/reward', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        taskId: 101,
                        responder: '0x71C8391264b192837461928374614f92',
                        proofHash: '0x8a9fc4219b48c823ea47b912a7810459c381fbc0293847e091b489a29184c4a1',
                      }),
                    });
                    const data = await res.json();
                    if (data.status === 'NOT_CONFIGURED') {
                      setEscrowActionStatus('NOT_CONFIGURED');
                      setEscrowFeedback(data.error);
                    } else if (data.status === 'REWARD_RELEASED') {
                      setEscrowActionStatus('SUCCESS');
                      setEscrowFeedback(`SUCCESS: Released 48.00 tCTC to NODE-ALPHA on Creditcoin CC3. Tx: ${data.txHash}`);
                    } else {
                      setEscrowActionStatus('REJECTED');
                      setEscrowFeedback(data.error || 'Reward release failed.');
                    }
                  } catch (err: any) {
                    setEscrowActionStatus('REJECTED');
                    setEscrowFeedback(err?.message || 'Failed to submit escrow request.');
                  }
                }}
                disabled={escrowActionStatus === 'PROCESSING'}
                className="px-3 py-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold rounded-lg transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[15px]">payments</span>
                <span>{escrowActionStatus === 'PROCESSING' ? 'Processing...' : 'Release Reward'}</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  setEscrowActionStatus('PROCESSING');
                  setEscrowFeedback(null);
                  // Intentionally send a known used duplicate proof hash
                  try {
                    const res = await fetch('/api/escrow/reward', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        taskId: 102,
                        responder: '0x71C8391264b192837461928374614f92',
                        proofHash: '0x8a9fc4219b48c823ea47b912a7810459c381fbc0293847e091b489a29184c4a1', // duplicate
                      }),
                    });
                    const data = await res.json();
                    if (data.rejectionCode === 'DUPLICATE_PROOF' || res.status === 409) {
                      setEscrowActionStatus('DUPLICATE_CAUGHT');
                      setEscrowFeedback('REPLAY PREVENTED: AidDeliveryEscrow reverted with duplicate delivery proof hash.');
                    } else if (data.status === 'NOT_CONFIGURED') {
                      setEscrowActionStatus('NOT_CONFIGURED');
                      setEscrowFeedback('REPLAY DEFENSE AUDIT: ' + data.error);
                    } else {
                      setEscrowActionStatus('REJECTED');
                      setEscrowFeedback(data.error || 'Duplicate claim check response received.');
                    }
                  } catch (err: any) {
                    setEscrowActionStatus('REJECTED');
                    setEscrowFeedback(err?.message || 'Duplicate test network call.');
                  }
                }}
                disabled={escrowActionStatus === 'PROCESSING'}
                className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[15px]">security</span>
                <span>Test Duplicate Claim</span>
              </button>
            </div>
          </div>

          {escrowFeedback && (
            <div
              className={`mt-3 p-3 rounded-lg text-xs flex items-start gap-2 ${
                escrowActionStatus === 'SUCCESS'
                  ? 'bg-teal-50 border border-teal-200 text-teal-800'
                  : escrowActionStatus === 'DUPLICATE_CAUGHT'
                  ? 'bg-amber-50 border border-amber-200 text-amber-900'
                  : escrowActionStatus === 'NOT_CONFIGURED'
                  ? 'bg-amber-50 border border-amber-200 text-amber-900'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">
                {escrowActionStatus === 'SUCCESS'
                  ? 'check_circle'
                  : escrowActionStatus === 'DUPLICATE_CAUGHT' || escrowActionStatus === 'NOT_CONFIGURED'
                  ? 'warning'
                  : 'error'}
              </span>
              <span className="leading-relaxed">{escrowFeedback}</span>
            </div>
          )}
        </div>

        {/* ImpactLens AI Analytical Audit Panel */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                <span className="material-symbols-outlined text-[24px]">psychology</span>
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900">ImpactLens Analytical Evaluation</h2>
                <p className="text-xs text-slate-500">
                  Read-only deterministic verification engine auditing smart contract logs and proof consistency.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span className="text-xs font-bold text-emerald-800">
                  HEALTH: {report.campaignHealth}
                </span>
                <span className="text-xs font-mono text-emerald-700 font-semibold ml-1">
                  (Anomaly Risk: {report.anomalyScore}%)
                </span>
              </div>
            </div>
          </div>

          {/* AI Summary Box */}
          <div className="mt-5 p-4 rounded-lg bg-teal-50/50 border border-teal-100">
            <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block mb-1">
              Audit Executive Summary
            </span>
            <p className="text-xs text-slate-700 leading-relaxed font-sans">{report.summary}</p>
          </div>

          {/* Facts & Warnings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
            {/* Verified Facts */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[18px] text-teal-700">check_circle</span>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Verified Facts</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                {report.verifiedFacts.map((fact, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0"></span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Evidence & Fraud Warnings */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[18px] text-amber-600">warning</span>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Pending Evidence &amp; Anomaly Watch
                </h3>
              </div>

              {report.missingEvidence.length > 0 ? (
                <ul className="space-y-2 text-xs text-slate-600 mb-3">
                  {report.missingEvidence.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-amber-800 bg-amber-50/60 p-2 rounded border border-amber-200/50">
                      <span className="material-symbols-outlined text-[14px] text-amber-600 mt-0.5">info</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 mb-3">All delivery evidence requirements satisfied.</p>
              )}

              <div className="pt-2 border-t border-slate-200 text-xs">
                <span className="font-semibold text-slate-700">Duplicate/Fraud Inscriptions: </span>
                {report.fraudWarnings.length === 0 ? (
                  <span className="text-emerald-700 font-medium">0 detected (Math replay guard active)</span>
                ) : (
                  <span className="text-red-600 font-bold">{report.fraudWarnings.join(', ')}</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 text-center text-[10px] text-slate-400 italic">
            ImpactLens runs read-only analysis. AI does NOT control financial state or balance mutations.
          </div>
        </div>

        {/* Aid Package Registry Section */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Aid Package Registry (RWA Inventory)</h2>
              <p className="text-xs text-slate-500">
                On-chain digital representation of simulated humanitarian aid goods.
              </p>
            </div>
            <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              NOT A CLAIM ON PHYSICAL GOODS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-slate-800">{pkg.id}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      pkg.status === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {pkg.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{pkg.assetType}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{pkg.zone}</p>
                <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-400">
                  Proof: {pkg.deliveryProofHash.slice(0, 18)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
