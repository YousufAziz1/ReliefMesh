'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useProtocolMode } from '@/app/providers';
import { PROTOCOL_CONFIG } from '@/lib/web3/config';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isDemoMode } = useProtocolMode();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content wrapper */}
      <div className="flex-1 ml-72 flex flex-col min-w-0">
        <Header />

        {/* Global Explicit Mode Notice Banner (Persistent Across All Pages) */}
        {isDemoMode ? (
          <div className="mt-16 bg-amber-100 border-b border-amber-300 px-6 py-2 flex items-center justify-between text-xs text-amber-950 font-bold tracking-wide shadow-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-amber-800">warning</span>
              <span>SIMULATION MODE — OFFLINE PRESENTATION DATA; NOT LIVE VERIFICATION</span>
            </div>
            <span className="text-[10px] uppercase font-mono font-bold text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded border border-amber-400">
              OFFLINE FIXTURE MODE
            </span>
          </div>
        ) : (
          <div className="mt-16 bg-teal-800 border-b border-teal-900 px-6 py-2 flex items-center justify-between text-xs text-white font-bold tracking-wide shadow-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-teal-300">verified</span>
              <span>LIVE TESTNET MODE — DATA FROM CURRENT RPC/API RESPONSES</span>
            </div>
            <span className="text-[10px] uppercase font-mono font-bold text-teal-100 bg-teal-900/80 px-2.5 py-0.5 rounded border border-teal-700">
              LIVE TESTNET ON-CHAIN ACTIVE
            </span>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
