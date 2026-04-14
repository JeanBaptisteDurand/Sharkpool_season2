import { useState, useEffect, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

const RECIPIENT = 'shrkUNuzxX5GHopy3bn9LKBzAR6ZYW1TaE6Pq2BSsCa';

export function WalletContent() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const [txSig, setTxSig] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!publicKey) return;
    const bal = await connection.getBalance(publicKey);
    setBalance(bal / LAMPORTS_PER_SOL);
  }, [publicKey, connection]);

  useEffect(() => {
    fetchBalance();
    const id = setInterval(fetchBalance, 5000);
    return () => clearInterval(id);
  }, [fetchBalance]);

  const handleSend = async () => {
    if (!publicKey) return;
    setSending(true);
    setError(null);
    setTxSig(null);

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(RECIPIENT),
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
        <div className="card-label">Balance</div>
        <div className="card-value balance">
          {balance !== null ? `${balance.toFixed(4)} SOL` : 'Loading...'}
        </div>
      </div>

      <div className="send-section">
        <h3>Transfer SOL</h3>
        <div className="send-recipient">To: {RECIPIENT}</div>
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={sending}
        >
          {sending ? 'Sending...' : 'Send 0.01 SOL'}
        </button>
      </div>

      {txSig && (
        <div className="tx-result success">
          <div className="tx-label">Transaction Successful</div>
          <a
            className="tx-link"
            href={`https://explorer.solana.com/tx/${txSig}?cluster=testnet`}
            target="_blank"
            rel="noreferrer"
          >
            {txSig}
          </a>
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
