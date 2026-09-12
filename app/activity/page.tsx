'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { INITIAL_ACTIVITIES } from '@/lib/demo/data';

export default function ActivityPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
            <span className="text-xs uppercase tracking-wider text-teal-800 font-bold">
              IMMUTABLE EVENT CHRONOLOGY
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Protocol Activity Stream
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time ledger events inscribed on Creditcoin CC3 and cross-chain attestations from Ethereum Sepolia.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
          <div className="divide-y divide-slate-100">
            {INITIAL_ACTIVITIES.map((act) => (
              <div key={act.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      act.status === 'SUCCESS' ? 'bg-teal-50 text-teal-700' : 'bg-red-50 text-red-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[17px]">
                      {act.status === 'SUCCESS' ? 'verified' : 'block'}
                    </span>
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-slate-900">{act.title}</h3>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          act.status === 'SUCCESS'
                            ? 'bg-teal-50 text-teal-800 border border-teal-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {act.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{act.description}</p>
                    <div className="flex items-center gap-3 mt-1.5 font-mono text-[10px] text-slate-400">
                      <span>Sender: {act.wallet}</span>
                      <span>•</span>
                      <span>Tx: {act.txHash}</span>
                    </div>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  {act.amount && (
                    <div className="font-mono text-xs font-bold text-teal-800">{act.amount}</div>
                  )}
                  <div className="text-[11px] text-slate-400">{act.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
