const solanaWeb3 = require("@solana/web3.js");

(async () => {
  // Connect to devnet
  const connection = new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl("devnet"),
    "confirmed"
  );

  // Generate a new wallet
  const wallet = solanaWeb3.Keypair.generate();
  console.log("Wallet address:", wallet.publicKey.toString());

  // Airdrop 2 SOL
  const airdropSignature = await connection.requestAirdrop(
    wallet.publicKey,
    2 * solanaWeb3.LAMPORTS_PER_SOL
  );

  // Wait for confirmation before checking balance
  await connection.confirmTransaction(airdropSignature);

  // Check balance
  const balance = await connection.getBalance(wallet.publicKey);
  console.log("Balance:", balance / solanaWeb3.LAMPORTS_PER_SOL, "SOL");
})();
