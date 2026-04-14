# Exercise 11 — Developer Quest: Fix Code

## Task

Fix the bugs in the following Solana code sample.

## Code

```js
const solanaWeb3 = require("@solana/web3.js");

(async () => {
  // Connect to devnet
  const connection = new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl("mainnet-beta"),
    "confirmed"
  );

  // Generate a new wallet
  const wallet = solanaWeb3.Keypair.generate();
  console.log("Wallet address:", wallet.publicKey.toString());

  // Airdrop 2 SOL
  const airdropSignature = await connection.requestAirdrop(
    wallet.publicKey,
    2
  );

  // Check balance immediately
  const balance = await connection.getBalance(wallet.publicKey);
  console.log("Balance:", balance, "SOL");
})();
```

## Answer

**Line 6:** `"mainnet-beta"` should be `"devnet"`. Airdrops are only available on devnet (and testnet), not on mainnet-beta. The comment even says "Connect to devnet" but the code connects to mainnet-beta.

**Line 17:** `2` should be `2 * solanaWeb3.LAMPORTS_PER_SOL`. The `requestAirdrop` function expects an amount in lamports, not SOL. 1 SOL = 1,000,000,000 lamports, so passing `2` only requests 2 lamports (essentially nothing).

**Line 20-21:** The balance is checked immediately after requesting the airdrop without waiting for confirmation. You must call `await connection.confirmTransaction(airdropSignature)` before checking the balance to ensure the airdrop has been processed.

**Line 21:** `getBalance` returns the balance in lamports, but the log prints it as "SOL". Either divide by `solanaWeb3.LAMPORTS_PER_SOL` before printing, or change the label to "lamports".

## Fixed Code

```js
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
```
