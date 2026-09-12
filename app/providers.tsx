'use client';

import React, { useState } from 'react';
import { WagmiProvider, createConfig, http, injected } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { creditcoinTestnet } from '@/lib/web3/config';

export const config = createConfig({
  chains: [sepolia, creditcoinTestnet],
  connectors: [
    injected({
      target() {
        return {
          id: 'injected',
          name: 'Browser Wallet',
          provider: typeof window !== 'undefined' ? (window as any).ethereum : undefined,
        };
      },
    }),
  ],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SOURCE_RPC_URL || 'https://rpc.sepolia.org'),
    [creditcoinTestnet.id]: http(process.env.NEXT_PUBLIC_CREDITCOIN_RPC_URL || 'https://rpc.cc3-testnet.creditcoin.network'),
  },
  ssr: true,
});

interface ModeContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  setDemoMode: (val: boolean) => void;
}

const ModeContext = React.createContext<ModeContextType>({
  isDemoMode: true,
  toggleDemoMode: () => {},
  setDemoMode: () => {},
});

export function useProtocolMode() {
  return React.useContext(ModeContext);
}

export function Web3Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  }));

  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('RELIEFMESH_DEMO_MODE');
      if (stored !== null) return stored === 'true';
    }
    return process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';
  });

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('RELIEFMESH_DEMO_MODE', String(next));
      }
      return next;
    });
  };

  const setDemoMode = (val: boolean) => {
    setIsDemoMode(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('RELIEFMESH_DEMO_MODE', String(val));
    }
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ModeContext.Provider value={{ isDemoMode, toggleDemoMode, setDemoMode }}>
          {children}
        </ModeContext.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

