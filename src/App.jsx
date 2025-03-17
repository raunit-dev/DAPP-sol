import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Welcome } from './components/Welcome';
import { Dashboard } from './components/Dashboard';
import { RequestAirdrop } from './Components/RequestAirdrop';
import { SendTokens } from './Components/SendTokens';
import { SignMessage } from './Components/SignMessage';

import '@solana/wallet-adapter-react-ui/styles.css';

export default function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/dashboard" element={<Dashboard />}>
                <Route path="request-airdrop" element={<RequestAirdrop />} />
                <Route path="send-tokens" element={<SendTokens />} />
                <Route path="sign-message" element={<SignMessage />} />
                <Route index element={<Navigate to="request-airdrop" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}