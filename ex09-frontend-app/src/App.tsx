import { useMemo, useState } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import './App.css';
import { WalletContent } from './WalletContent';

export type Network = 'devnet' | 'testnet' | 'mainnet-beta';

function App() {
  const [network, setNetwork] = useState<Network>('testnet');
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div className="app">
            <img src="/42bc-logo.jpg" alt="42 Blockchain" className="corner-logo" />

            <div className="header">
              <h1>Sharkpool Wallet</h1>
            </div>

            <div className="network-selector">
              <button
                className={`network-btn ${network === 'devnet' ? 'active devnet' : ''}`}
                onClick={() => setNetwork('devnet')}
              >
                <span className="network-dot devnet" />
                Devnet
              </button>
              <button
                className={`network-btn ${network === 'testnet' ? 'active testnet' : ''}`}
                onClick={() => setNetwork('testnet')}
              >
                <span className="network-dot testnet" />
                Testnet
              </button>
              <button
                className={`network-btn ${network === 'mainnet-beta' ? 'active mainnet' : ''}`}
                onClick={() => setNetwork('mainnet-beta')}
              >
                <span className="network-dot mainnet" />
                Mainnet
              </button>
            </div>

            <WalletContent network={network} />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
