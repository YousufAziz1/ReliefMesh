'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { PROTOCOL_CONFIG } from '@/lib/web3/config';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content wrapper */}
      <div className="flex-1 ml-72 flex flex-col min-w-0">
        <Header />

        {/* Global Testnet Safety Disclaimer Banner */}
        <div className="mt-16 bg-amber-50 border-b border-amber-200 px-6 py-1.5 flex items-center justify-between text-[11px] text-amber-900 font-medium">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[15px] text-amber-700">info</span>
            <span>
              <strong>TESTNET SIMULATION PROTOCOL:</strong> {PROTOCOL_CONFIG.testnetDisclaimers.globalNotice}
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
            Non-Commercial Hackathon Prototype
          </span>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
