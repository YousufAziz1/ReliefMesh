'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { INITIAL_PROOFS } from '@/lib/demo/data';

export default function ProofsPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        {/* Header Title */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
            <span className="text-xs uppercase tracking-wider text-teal-800 font-bold">
              CRYPTOGRAPHIC PROOF AUDIT
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Cross-Chain Proof Certificates
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verifiable storage inclusion proofs bridging Ethereum Sepolia and Creditcoin CC3 Testnet via Attestcoin.
          </p>
        </div>

        {/* Visual Proof Architecture Pipeline */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
            Zero-Custodian Attestation Flow
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col items-center justify-center">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs mb-2">
                01
              </span>
              <span className="text-xs font-bold text-slate-900">Ethereum Sepolia</span>
              <span className="text-[10px] text-slate-500">Donation Event Fired</span>
            </div>

            <div className="flex items-center justify-center text-slate-300">
              <span className="material-symbols-outlined text-[20px] text-teal-700">arrow_forward</span>
            </div>

            <div className="p-3 bg-teal-50 rounded-lg border border-teal-200 flex flex-col items-center justify-center">
              <span className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs mb-2">
                02
              </span>
              <span className="text-xs font-bold text-teal-900">Attestcoin Oracle</span>
              <span className="text-[10px] text-teal-700">Inclusion Proof Mined</span>
            </div>

            <div className="flex items-center justify-center text-slate-300">
              <span className="material-symbols-outlined text-[20px] text-teal-700">arrow_forward</span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex flex-col items-center justify-center">
              <span className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs mb-2">
                03
              </span>
              <span className="text-xs font-bold text-emerald-900">Creditcoin CC3</span>
              <span className="text-[10px] text-emerald-700">Consensus Inscribed</span>
            </div>
          </div>
        </div>

        {/* Proofs List */}
        <div className="space-y-4">
          {INITIAL_PROOFS.map((proof) => (
            <div key={proof.proofId} className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                    {proof.proofId}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    VERIFIED INCLUSION PROOF
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-500">{proof.timestamp}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2.5">
                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">
                      Source Chain &amp; Block
                    </span>
                    <span className="font-medium text-slate-800">
                      {proof.sourceChain} • Block #{proof.sourceBlock.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">
                      Source Transaction Hash
                    </span>
                    <p className="font-mono text-[11px] text-slate-700 break-all bg-slate-50 p-2 rounded border border-slate-200">
                      {proof.sourceTxHash}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">
                      Donor Address
                    </span>
                    <p className="font-mono text-[11px] text-slate-700">{proof.donor}</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">
                      Destination Chain &amp; Settlement
                    </span>
                    <span className="font-medium text-slate-800">{proof.destinationChain} • Verified Amount: {proof.amount}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">
                      Creditcoin CC3 Transaction Hash
                    </span>
                    <p className="font-mono text-[11px] text-slate-700 break-all bg-slate-50 p-2 rounded border border-slate-200">
                      {proof.destinationTxHash}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">
                      Merkle State Root
                    </span>
                    <p className="font-mono text-[11px] text-slate-500 break-all">{proof.merkleRoot}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
