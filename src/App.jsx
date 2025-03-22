import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Welcome } from './components/Welcome';
import { Dashboard } from './components/Dashboard';
import { RequestAirdrop } from './Components/RequestAirdrop';
import { SendTokens } from './Components/SendTokens';
import { SignMessage } from './Components/SignMessage';
import { TokenLaunchpad } from './Components/TokenLaunchpad';

import '@solana/wallet-adapter-react-ui/styles.css';

export default function App() {
  const endpoint = 'https://solana-devnet.g.alchemy.com/v2/EuBWMQhL3488mN1Got-s7v9yeHXGLRj_';
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/dashboard" element={<Dashboard />}>
                 <Route path="token-launchpad" element={<TokenLaunchpad/>}/>
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