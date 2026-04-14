import { useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import './App.css';
import { WalletContent } from './WalletContent';

function App() {
  const endpoint = useMemo(() => clusterApiUrl('testnet'), []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div className="app">
            <div className="header">
              <h1>Sharkpool Wallet</h1>
            </div>
            <span className="network-badge">
              <span className="network-dot" />
              Testnet
            </span>
            <WalletContent />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
