# Exercise 10 — Developer Quest: Decode Solana Transaction

## Task

Decode the Solana transaction and enter its metadata.

**Tx hash:** `Ahy9GEyiPzkrw54Js6rw43bD6m6V3zmDDK6nn6e8N2tskrbkiozhsMjcdBLvCgH5JAc8CFyUZiwWpyCNqQ4wmQb`

## Decoding Code (TypeScript)

```ts
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
```

## Transaction Metadata

- **Slot:** 349,521,138
- **Block Time:** 1751020536 (2025-06-27 ~08:35 UTC)
- **Version:** 0
- **Status:** Success (`err: null`)
- **Fee:** 9,452 lamports
- **Compute Units Consumed:** 22,733
- **Recent Blockhash:** `59p3NDsxQsEAqcMx47MaSD8sMatpkCJejysnDdoaWdHq`

### Accounts

| # | Account | Signer | Writable |
|---|---------|--------|----------|
| 0 | `B88xH3Jmhq4WEaiRno2mYmsxV35MmgSY45ZmQnbL8yft` | Yes | Yes |
| 1 | `Cq8nomBLmD4LwrYBA4J3Wk6C4GtcRT72Nb5e1RJcdk8C` | No | Yes |
| 2 | `ComputeBudget111111111111111111111111111111` | No | No |
| 3 | `9w1D9okTM8xNE7Ntb7LpaAaoLc6LfU9nHFs2h2KTpX1H` | No | No |
| 4 | `93boUvm9QnkHTa5sUGMuFegLaxYsJQVMrNCAz7HojnY5` | No | No |
| 5 | `11111111111111111111111111111111` (System Program) | No | No |

### Instructions

1. **ComputeBudget** — Set compute unit limit (data: `KcV58B`)
2. **ComputeBudget** — Set compute unit price (data: `3VfkVU6kUp3h`)
3. **Program `9w1D9okTM8xNE7Ntb7LpaAaoLc6LfU9nHFs2h2KTpX1H`** — "Bid" instruction, interacting with accounts `93boUvm9...`, `B88xH3...`, `Cq8nom...`, and System Program

### Inner Instructions (from instruction #3)

- **System Program → createAccount**
  - Source: `B88xH3Jmhq4WEaiRno2mYmsxV35MmgSY45ZmQnbL8yft`
  - New Account: `Cq8nomBLmD4LwrYBA4J3Wk6C4GtcRT72Nb5e1RJcdk8C`
  - Lamports: 1,900,080
  - Space: 145 bytes
  - Owner: `9w1D9okTM8xNE7Ntb7LpaAaoLc6LfU9nHFs2h2KTpX1H`

### Balance Changes

| Account | Pre-Balance (lamports) | Post-Balance (lamports) | Change |
|---------|----------------------|------------------------|--------|
| `B88xH3...` (signer) | 15,833,102,443 | 15,831,192,911 | -1,909,532 |
| `Cq8nom...` (new) | 0 | 1,900,080 | +1,900,080 |

### Log Messages

```
Program ComputeBudget111111111111111111111111111111 invoke [1]
Program ComputeBudget111111111111111111111111111111 success
Program ComputeBudget111111111111111111111111111111 invoke [1]
Program ComputeBudget111111111111111111111111111111 success
Program 9w1D9okTM8xNE7Ntb7LpaAaoLc6LfU9nHFs2h2KTpX1H invoke [1]
Program log: Instruction: Bid
Program 11111111111111111111111111111111 invoke [2]
Program 11111111111111111111111111111111 success
Program 9w1D9okTM8xNE7Ntb7LpaAaoLc6LfU9nHFs2h2KTpX1H consumed 22433 of 73900 compute units
Program 9w1D9okTM8xNE7Ntb7LpaAaoLc6LfU9nHFs2h2KTpX1H success
```

### Summary

This is a **"Bid"** transaction on a custom Solana program (`9w1D9okTM8xNE7Ntb7LpaAaoLc6LfU9nHFs2h2KTpX1H`). The signer placed a bid which created a new 145-byte account to store bid data, costing ~0.0019 SOL in rent plus 9,452 lamports in fees.
