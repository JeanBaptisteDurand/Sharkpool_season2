import { useState, useEffect, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import type { Network } from './App';

interface Props {
  network: Network;
}

export function WalletContent({ network }: Props) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [recipient, setRecipient] = useState('');
  const [sending, setSending] = useState(false);
  const [txSig, setTxSig] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!publicKey) {
      setBalance(null);
      return;
    }
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const bal = await Promise.race([
        connection.getBalance(publicKey),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 10000)
        ),
      ]);
      clearTimeout(timeout);
      setBalance(bal / LAMPORTS_PER_SOL);
    } catch {
      setBalance(0);
    }
  }, [publicKey, connection]);

  // Re-fetch balance when network or wallet changes
  useEffect(() => {
    setBalance(null);
    setTxSig(null);
    setError(null);
    fetchBalance();
    const id = setInterval(fetchBalance, 5000);
    return () => clearInterval(id);
  }, [fetchBalance]);

  const handleSend = async () => {
    if (!publicKey || !recipient.trim()) return;
    setSending(true);
    setError(null);
    setTxSig(null);

    try {
      const toPubkey = new PublicKey(recipient.trim());
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey,
          lamports: 0.01 * LAMPORTS_PER_SOL,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      setTxSig(signature);
      fetchBalance();
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
    } finally {
      setSending(false);
    }
  };

  const explorerCluster = network === 'mainnet-beta' ? '' : `?cluster=${network}`;

  if (!publicKey) {
    return (
      <div className="connect-prompt">
        <WalletMultiButton />
        <p>Connect your wallet to get started</p>
      </div>
    );
  }

  return (
    <div className="cards-grid">
      <div className="wallet-actions">
        <WalletMultiButton />
      </div>

      <div className="card address-card">
        <div className="card-label">Wallet Address</div>
        <div className="card-value">{publicKey.toBase58()}</div>
      </div>

      <div className="card balance-card">
        <div className="card-label">Balance ({network === 'mainnet-beta' ? 'Mainnet' : network})</div>
        <div className="card-value balance">
          {balance !== null ? `${balance.toFixed(4)} SOL` : 'Loading...'}
        </div>
      </div>

      <div className="send-section">
        <h3>Transfer SOL</h3>
        <input
          type="text"
          className="recipient-input"
          placeholder="Recipient address..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={sending || !recipient.trim()}
        >
          {sending ? 'Sending...' : 'Send 0.01 SOL'}
        </button>
      </div>

      {txSig && (
        <div className="tx-result success">
          <div className="tx-label">Transaction Successful</div>
          <div className="tx-sig-hash">{txSig}</div>
          <div className="tx-explorers">
            <a
              className="explorer-link solana-explorer"
              href={`https://explorer.solana.com/tx/${txSig}${explorerCluster}`}
              target="_blank"
              rel="noreferrer"
            >
              Solana Explorer
            </a>
            <a
              className="explorer-link solscan"
              href={`https://solscan.io/tx/${txSig}${explorerCluster}`}
              target="_blank"
              rel="noreferrer"
            >
              Solscan
            </a>
          </div>
        </div>
      )}

      {error && (
        <div className="tx-result error">
          <div className="tx-label">Error</div>
          <div className="tx-error-msg">{error}</div>
        </div>
      )}

      <div className="footer-note">
        Tested with Phantom Wallet
      </div>
    </div>
  );
}
