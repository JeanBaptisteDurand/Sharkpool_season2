import { Connection, clusterApiUrl } from "@solana/web3.js";

(async () => {
  const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

  const txHash =
    "Ahy9GEyiPzkrw54Js6rw43bD6m6V3zmDDK6nn6e8N2tskrbkiozhsMjcdBLvCgH5JAc8CFyUZiwWpyCNqQ4wmQb";

  const tx = await connection.getTransaction(txHash, {
    maxSupportedTransactionVersion: 0,
  });

  if (!tx) {
    console.log("Transaction not found");
    return;
  }

  console.log(JSON.stringify(tx, null, 2));
})();
