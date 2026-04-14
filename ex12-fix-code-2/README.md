# Exercise 12 — Developer Quest: Fix Code 2

## Task

Find the bugs in the following Solana transfer code and describe how to fix them.

## Code

```js
const solanaWeb3 = require("@solana/web3.js");

(async () => {
  const connection = new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl("devnet"),
    "confirmed"
  );

  const sender = solanaWeb3.Keypair.generate();
  const receiver = "9ArGQFmoEgf9oEVFRFGi2L1csBRm5bSNxZSNewVcu5Bx";

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
      lamports: 0.5,
    })
  );

  // Send it
  const signature = await solanaWeb3.sendAndConfirmTransaction(
    connection,
    transaction,
    [sender, receiver]
  );

  console.log("Sent! TX:", signature);
})();
```

## Answer

**Line 10:** `receiver` is a plain string, but `toPubkey` (line 24) expects a `PublicKey` object. It should be converted: `const receiver = new solanaWeb3.PublicKey("9ArGQFmoEgf9oEVFRFGi2L1csBRm5bSNxZSNewVcu5Bx");`

**Line 25:** `lamports: 0.5` is invalid — lamports are the smallest unit on Solana and must be an integer. To send 0.5 SOL, use `lamports: 0.5 * solanaWeb3.LAMPORTS_PER_SOL` (which equals 500,000,000 lamports).

**Line 33:** `[sender, receiver]` — the signers array should only contain the `sender`. The receiver does not need to sign a transfer (they are just receiving funds). Additionally, `receiver` is a string (not a Keypair), so passing it as a signer would cause a runtime error. It should be `[sender]`.

## Fixed Code

```js
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
```
