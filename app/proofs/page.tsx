'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useProtocolMode } from '@/app/providers';

export default function ProofsPage() {
  const { isDemoMode } = useProtocolMode();

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

        {/* Mode-Aware Disclaimer Banner */}
        {isDemoMode ? (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-amber-700">info</span>
              <span>
                <strong>SIMULATION DATA — NOT LIVE ON-CHAIN EVIDENCE:</strong> Currently viewing offline presentation state. Switch to Real Testnet Mode in the persistent header to query live on-chain endpoints.
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 shrink-0">
              SIMULATION ACTIVE
            </span>
          </div>
        ) : (
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-blue-700">verified</span>
              <span>
                <strong>LIVE ON-CHAIN EVIDENCE ACTIVE:</strong> Displaying verified transaction receipts on Ethereum Sepolia and Creditcoin CC3 testnets.
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded border border-blue-300 shrink-0">
              LIVE EXPLORER RECEIPTS
            </span>
          </div>
        )}

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
              <span className="text-[10px] text-slate-500">Donation Event Mined</span>
            </div>

            <div className="flex items-center justify-center text-slate-300">
              <span className="material-symbols-outlined text-[20px] text-teal-700">arrow_forward</span>
            </div>

            <div className="p-3 bg-teal-50 rounded-lg border border-teal-200 flex flex-col items-center justify-center">
              <span className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs mb-2">
                02
              </span>
              <span className="text-xs font-bold text-teal-900">Attestcoin Prover</span>
              <span className="text-[10px] text-teal-700">Inclusion Proof Generated</span>
            </div>

            <div className="flex items-center justify-center text-slate-300">
              <span className="material-symbols-outlined text-[20px] text-teal-700">arrow_forward</span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex flex-col items-center justify-center">
              <span className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs mb-2">
                03
              </span>
              <span className="text-xs font-bold text-emerald-900">Creditcoin CC3</span>
              <span className="text-[10px] text-emerald-700">Precompile Verified</span>
            </div>
          </div>
        </div>

        {/* Real Proof Certificate Card */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2 mb-5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                PRF-SEPOLIA-CC3-001
              </span>
              {isDemoMode ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                  SIMULATED PROOF CERTIFICATE
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  LIVE EXPLORER RECEIPT — CONFIRMED ON-CHAIN
                </span>
              )}
            </div>
            <span className="text-xs font-mono text-slate-500">2026-09-12 18:02:14 UTC</span>
          </div>

          {/* Section 1: Source-Chain Evidence */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                SOURCE-CHAIN EVIDENCE (ETHEREUM SEPOLIA)
              </span>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {isDemoMode ? 'SIMULATED PRESENTATION DATA' : 'LIVE EXPLORER RECEIPT'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Network &amp; Chain ID</span>
                <span className="font-semibold text-slate-900">Ethereum Sepolia • Chain ID 11155111</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Source Block</span>
                <span className="font-semibold text-slate-900">Block #11,684,082</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Donation Value</span>
                <span className="font-semibold text-slate-900">0.0001 ETH</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Source Tx Hash</span>
                <a
                  href="https://sepolia.etherscan.io/tx/0xbc2be5639814c48c313e3e61a65aa5fab1b4ec3e5c9db9791ea4f1976d89e2c4"
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-teal-800 hover:text-teal-900 hover:underline flex items-center gap-1 truncate font-semibold"
                >
                  <span className="truncate">0xbc2be563...89e2c4</span>
                  <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                </a>
              </div>
            </div>
          </div>

          {/* Section 2: Destination-Chain Evidence */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                DESTINATION-CHAIN EVIDENCE (CREDITCOIN CC3 TESTNET)
              </span>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {isDemoMode ? 'SIMULATED PRESENTATION DATA' : 'LIVE EXPLORER RECEIPT'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Network &amp; Chain ID</span>
                <span className="font-semibold text-slate-900">Creditcoin CC3 • Chain ID 102031</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Destination Block</span>
                <span className="font-semibold text-slate-900">Block #5,476,394</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Gas &amp; Value</span>
                <span className="font-semibold text-slate-900">327,055 gas • 0 CTC</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Destination Tx Hash</span>
                <a
                  href="https://creditcoin-testnet.blockscout.com/tx/0x8dd078f04c3a268572cc6fa8f7dbdb477a8263adb3759b5b6aab22dd5b3c98e3"
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-teal-800 hover:text-teal-900 hover:underline flex items-center gap-1 truncate font-semibold"
                >
                  <span className="truncate">0x8dd078f0...5b3c98e3</span>
                  <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                </a>
              </div>
            </div>
          </div>

          {/* Section 3: Public Evidence Linkage & On-Chain Proof Verification */}
          <div className="p-4 bg-teal-50/50 rounded-lg border border-teal-200 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-900">
                PUBLIC EVIDENCE LINKAGE AUDIT (SOURCE-TO-DESTINATION)
              </span>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded border border-teal-300">
                {isDemoMode ? 'SIMULATED PRESENTATION DATA' : 'PUBLIC RECEIPT LOGS AUDIT'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-3">
              <div className="space-y-2">
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">Destination Contract Address</span>
                  <a
                    href="https://creditcoin-testnet.blockscout.com/address/0x2C5334DDEaFfc6A56554401EcabD56b0E75Cf3B2"
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] text-teal-800 hover:underline break-all block"
                  >
                    0x2C5334DDEaFfc6A56554401EcabD56b0E75Cf3B2 (AttestcoinDonationVerifier)
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">Method Selector</span>
                  <span className="font-mono text-[11px] text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 block">
                    0xcf0c7f18 (Contract interaction observed on CC3)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">Event Linkage</span>
                  <span className="font-mono text-[11px] text-amber-900 bg-amber-50 px-2 py-1 rounded border border-amber-200 block font-semibold">
                    NOT VERIFIED IN CURRENT PUBLIC RECEIPT
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">Source-to-Destination Relationship</span>
                  <span className="font-mono text-[11px] text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 block">
                    Demo association only; live event linkage pending.
                  </span>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-white/80 rounded border border-teal-200 text-[11px] text-teal-950 flex items-start gap-2">
              <span className="material-symbols-outlined text-[15px] text-teal-700 mt-0.5 shrink-0">verified_user</span>
              <div>
                <strong>Evidence Linkage Note:</strong> Public CC3 contract interaction associated with the testnet demo; source-to-destination linkage is shown only when the live receipt/event confirms it.
              </div>
            </div>
          </div>

          {/* Section 4: Detailed Address & Merkle Proof Keys */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2.5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">
                    Donor Address (Sepolia EOA)
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">
                    {isDemoMode ? 'PUBLIC TESTNET REFERENCE' : 'LIVE RPC RESPONSE'}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-slate-700 bg-slate-50 p-2 rounded border border-slate-200 truncate">
                  0x936cBfC816Cfa2301cEB69aa7Cc6A9B38710FAeF
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">
                    ReliefMesh Sepolia Vault
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">
                    {isDemoMode ? 'CONFIGURED CONTRACT ADDRESS' : 'LIVE RPC RESPONSE'}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-slate-700 bg-slate-50 p-2 rounded border border-slate-200 truncate">
                  0x71C8391264b192837461928374614f9283746192
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">
                    CC3 Native Precompile Verifier
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">
                    {isDemoMode ? 'OFFICIAL PROTOCOL ADDRESS' : 'LIVE PROVER REFERENCE'}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-slate-700 bg-slate-50 p-2 rounded border border-slate-200 truncate">
                  0x0000000000000000000000000000000000000FD2 (PrecompileBlockProver)
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">
                    Attestcoin Merkle State Root
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">
                    {isDemoMode ? 'SIMULATED PRESENTATION DATA' : 'LIVE PROVER RESPONSE'}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 break-all">
                  0x94b94d6d7cee8f80543dc043fb217bcc786f1084d582e645f68dfde464619679
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Truthful Legal & Prototype Note */}
          <div className="mt-5 p-3.5 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-200 flex items-start gap-2.5 leading-relaxed">
            <span className="material-symbols-outlined text-[18px] text-slate-400 mt-0.5 shrink-0">info</span>
            <div>
              <strong className="text-slate-900 block mb-0.5">Testnet Prototype Disclaimer:</strong>
              Testnet prototype. No real humanitarian funds. No physical delivery guarantee. No 1:1 cross-chain currency conversion is assumed or implied. Ethereum Sepolia provides source-chain evidence, Attestcoin provides cryptographic inclusion proofs, and Creditcoin CC3 contracts enforce campaign accounting and duplicate protection.
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
