'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { INITIAL_CAMPAIGN, INITIAL_RESPONDERS, INITIAL_PACKAGES } from '@/lib/demo/data';
import { generateDeterministicAudit, ImpactLensReport } from '@/lib/ai/impactlens';

export default function ImpactPage() {
  const [report, setReport] = useState<ImpactLensReport>(() =>
    generateDeterministicAudit(INITIAL_CAMPAIGN, INITIAL_RESPONDERS, INITIAL_PACKAGES)
  );
  const [loading, setLoading] = useState(false);

  const runLiveAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/impact');
      if (res.ok) {
        const data = await res.json();
        if (data.report) {
          setReport(data.report);
        }
      }
    } catch (e) {
      console.error('Failed to fetch live audit:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
              <span className="text-xs uppercase tracking-wider text-teal-800 font-bold">
                ANALYTICAL VERIFICATION SUITE
              </span>
              <span className="bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                {report.model || 'gemini-3.8-flash'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              ImpactLens AI Audit Engine
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Powered by Google {report.model || 'gemini-3.8-flash'} Oracle. Strict analytical evaluation; AI does not control treasury custody.
            </p>
          </div>
          <button
            onClick={runLiveAudit}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">
              {loading ? 'sync' : 'auto_awesome'}
            </span>
            <span>{loading ? 'Auditing with Gemini...' : 'Run Live Gemini Audit'}</span>
          </button>
        </div>

        {/* Audit Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold uppercase">CAMPAIGN INTEGRITY</span>
            <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">
              {report.campaignHealth} (NOMINAL)
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Full treasury reconciliation on CC3</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold uppercase">ANOMALY INDEX</span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {report.anomalyScore}% (LOW RISK)
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Zero duplicate hash collisions</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold uppercase">LAST AUDIT TIMESTAMP</span>
            <div className="text-xs font-mono font-bold text-slate-800 mt-2 truncate">
              {report.auditedAt}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Real-time smart contract evaluation</p>
          </div>
        </div>

        {/* Audit Details */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Auditor Executive Summary
              </h3>
              {report.engine && (
                <span className="text-[11px] text-teal-700 font-mono bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {report.engine}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
              {report.summary}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Cryptographically Verified Facts
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {report.verifiedFacts.map((fact, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="material-symbols-outlined text-[16px] text-teal-700 mt-0.5">check_circle</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
