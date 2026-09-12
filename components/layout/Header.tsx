'use client';

import React from 'react';
import Link from 'next/link';
import { useProtocolMode } from '@/app/providers';

export default function Header() {
  const { isDemoMode, toggleDemoMode } = useProtocolMode();

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-white border-b border-slate-200 z-40 px-6 flex items-center justify-between">
      {/* Left side telemetry indicators & Mode Toggle */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleDemoMode}
          title="Click to toggle between Demo Simulation and Real Testnet mode"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all text-xs font-semibold tracking-wide ${
            isDemoMode
              ? 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100'
              : 'bg-teal-50 border-teal-200 text-teal-800 hover:bg-teal-100'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isDemoMode ? 'bg-amber-500 animate-pulse' : 'bg-teal-600'
            }`}
          ></span>
          <span>{isDemoMode ? 'SIMULATION MODE (ACTIVE)' : 'REAL TESTNET MODE'}</span>
          <span className="material-symbols-outlined text-[14px] text-slate-400 ml-0.5">
            swap_horiz
          </span>
        </button>

        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
            Sepolia: <strong className="text-slate-800 font-semibold">120ms</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
            Creditcoin CC3: <strong className="text-slate-800 font-semibold">45ms</strong>
          </span>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/judge"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-800 text-xs font-semibold transition-all shadow-xs"
        >
          <span className="text-teal-700 tracking-wider uppercase font-bold text-[11px]">
            ⚡ START 3-MINUTE DEMO
          </span>
          <span className="px-1.5 py-0.5 rounded bg-teal-700 text-white text-[10px] font-bold uppercase">
            JUDGE
          </span>
        </Link>

        {/* Network & Node profile badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="flex flex-col text-right">
            <span className="text-[11px] font-bold text-slate-800">Node Operator #01</span>
            <span className="text-[10px] text-slate-400 font-mono">0x71C...4f92</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-teal-800 text-white font-bold text-xs flex items-center justify-center ring-2 ring-teal-100">
            NO
          </div>
        </div>
      </div>
    </header>
  );
}
