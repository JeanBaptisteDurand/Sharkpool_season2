const solanaWeb3 = require("@solana/web3.js");

(async () => {
  const connection = new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl("devnet"),
    "confirmed"
  );

  const sender = solanaWeb3.Keypair.generate();
  const receiver = new solanaWeb3.PublicKey("9ArGQFmoEgf9oEVFRFGi2L1csBRm5bSNxZSNewVcu5Bx");

  // Fund the sender
  const airdropSig = await connection.requestAirdrop(
    sender.publicKey,
    2 * solanaWeb3.LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction(airdropSig);

  // Build transfer instruction
  const transaction = new solanaWeb3.Transaction().add(
    solanaWeb3.SystemProgram.transfer({
      fromPubkey: sender.publicKey,
      toPubkey: receiver,
      lamports: 0.5 * solanaWeb3.LAMPORTS_PER_SOL,
    })
  );

  // Send it
  const signature = await solanaWeb3.sendAndConfirmTransaction(
    connection,
    transaction,
    [sender]
  );

  console.log("Sent! TX:", signature);
})();
