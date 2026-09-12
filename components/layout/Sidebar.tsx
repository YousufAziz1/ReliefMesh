'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAccount, useConnect, useDisconnect, useBalance, useChainId, useSwitchChain } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { PROTOCOL_CONFIG } from '@/lib/web3/config';

export default function Sidebar() {
  const pathname = usePathname();
  const { address, isConnected, isConnecting } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { data: balanceData } = useBalance({ address });

  const isSepolia = chainId === sepolia.id;
  const isCC3 = chainId === PROTOCOL_CONFIG.destinationChain.id;
  const isCorrectNetwork = isSepolia || isCC3;

  const operationsNav = [
    { name: 'Overview', path: '/', icon: 'grid_view' },
    { name: 'Campaigns', path: '/campaigns', icon: 'campaign' },
    { name: 'Donate Console', path: '/donations', icon: 'volunteer_activism' },
    { name: 'Responder Nodes', path: '/responders', icon: 'hub' },
    { name: 'Aid Packages', path: '/packages', icon: 'inventory_2' },
    { name: 'ImpactLens AI', path: '/impact', icon: 'psychology' },
  ];

  const protocolNav = [
    { name: 'Cryptographic Proofs', path: '/proofs', icon: 'verified' },
    { name: 'Activity Feed', path: '/activity', icon: 'dynamic_feed' },
    { name: 'Judge Mode (3-Min)', path: '/judge', icon: 'bolt' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white z-50 flex flex-col justify-between border-r border-slate-200">
      <div className="flex flex-col flex-1 overflow-y-auto px-4 pt-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-white border border-slate-200/80 p-0.5 shadow-xs shrink-0 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="ReliefMesh Logo"
              width={36}
              height={36}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-base font-bold uppercase tracking-wider text-slate-900">
                RELIEFMESH
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">Cross-Chain Aid Protocol</span>
              <span className="flex items-center gap-1 text-[10px] text-teal-700 px-1.5 py-0.5 rounded bg-teal-50 border border-teal-200 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse"></span>
                TESTNET
              </span>
            </div>
          </div>
        </div>

        {/* Operations Section */}
        <div className="py-2 pt-4">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-2 py-1">
            OPERATIONS
          </div>
          <nav className="flex flex-col gap-1 mt-1">
            {operationsNav.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                    active
                      ? 'bg-teal-50 text-teal-800 font-semibold border border-teal-200/60 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[19px] ${active ? 'text-teal-700' : 'text-slate-400'}`}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Protocol & Explorer Section */}
        <div className="pt-3">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-2 py-1">
            PROTOCOL &amp; EXPLORER
          </div>
          <nav className="flex flex-col gap-1 mt-1">
            {protocolNav.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                    active
                      ? 'bg-teal-50 text-teal-800 font-semibold border border-teal-200/60 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {item.path === '/proofs' ? (
                    <svg className={`w-[19px] h-[19px] shrink-0 ${active ? 'text-teal-700' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  ) : (
                    <span className={`material-symbols-outlined text-[19px] ${active ? 'text-teal-700' : 'text-slate-400'}`}>
                      {item.icon}
                    </span>
                  )}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Real Web3 Wallet Connection Card */}
      <div className="p-3.5 bg-slate-50 mx-3 mb-4 rounded-xl flex flex-col gap-2 border border-slate-200 shadow-xs">
        {isConnected && address ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase">
                WALLET CONNECTED
              </span>
              <span
                className={`flex items-center gap-1 text-[11px] font-bold ${
                  isCorrectNetwork ? 'text-teal-700' : 'text-amber-600'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isCorrectNetwork ? 'bg-teal-600' : 'bg-amber-500 animate-ping'
                  }`}
                ></span>
                {isSepolia ? 'Sepolia' : isCC3 ? 'CC3 Testnet' : 'Wrong Network'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="font-mono text-xs text-slate-800 font-bold">
                  {truncateAddress(address)}
                </span>
                <a
                  href={`https://sepolia.etherscan.io/address/${address}`}
                  target="_blank"
                  rel="noreferrer"
                  title="View on Sepolia Etherscan"
                  className="text-slate-400 hover:text-teal-700 flex items-center"
                >
                  <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                </a>
              </div>
              <span className="font-mono text-xs text-teal-800 font-bold">
                {balanceData ? `${Number(balanceData.formatted).toFixed(3)} ${balanceData.symbol}` : '...'}
              </span>
            </div>

            {!isCorrectNetwork && (
              <button
                type="button"
                onClick={() => switchChain({ chainId: sepolia.id })}
                className="w-full py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-bold rounded border border-amber-300 transition-all flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[12px]">sync</span>
                Switch to Sepolia
              </button>
            )}

            <div className="flex items-center justify-between text-slate-500 pt-1.5 border-t border-slate-200 text-[10px]">
              <span className="truncate max-w-[120px]">
                {isSepolia ? 'Ethereum Sepolia' : 'Creditcoin CC3'}
              </span>
              <button
                type="button"
                onClick={() => disconnect()}
                className="text-red-600 hover:underline font-semibold"
              >
                Disconnect
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">
                WEB3 WALLET
              </span>
              <span className="text-[10px] text-slate-400">Disconnected</span>
            </div>

            <p className="text-[11px] text-slate-500 leading-tight">
              Connect browser wallet to sign real testnet donations on Ethereum Sepolia.
            </p>

            <button
              type="button"
              disabled={isConnecting}
              onClick={() => {
                if (connectors.length > 0) {
                  connect({ connector: connectors[0] });
                }
              }}
              className="w-full py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[15px]">account_balance_wallet</span>
              <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
