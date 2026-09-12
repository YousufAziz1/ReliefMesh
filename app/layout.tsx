import type { Metadata } from 'next';
import './globals.css';
import { Web3Providers } from './providers';

export const metadata: Metadata = {
  title: 'ReliefMesh — Verified Cross-Chain Aid Network',
  description:
    'Testnet Humanitarian Aid Liquidity Protocol verified across Ethereum Sepolia and Creditcoin CC3 with Attestcoin.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
        <Web3Providers>
          {children}
        </Web3Providers>
      </body>
    </html>
  );
}
