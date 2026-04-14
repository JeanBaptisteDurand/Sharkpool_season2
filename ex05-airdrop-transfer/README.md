# Exercise 05 - Airdrop & Transfer Testnet SOL

## Task

Airdrop 1 testnet SOL and transfer it to a testnet validator.

## Instructions

1. Airdrop 1 SOL via `solana airdrop 1` or using a faucet (e.g. faucet.solana.com)
2. Find a testnet validator address via svt.one
3. Transfer SOL to the validator and submit the TX hash

## Solution

```bash
solana airdrop 1
solana transfer F1wBgGku883aGGCQYMQFR4PmdJ7faej3qKSk8xGCycP7 0.5 --allow-unfunded-recipient
```

## Answer

- **Validator:** `F1wBgGku883aGGCQYMQFR4PmdJ7faej3qKSk8xGCycP7` (SelfLiquidity)
- **TX Hash:** `4HozMaSGiwywJzcWryZcGECJBk2vGSco1mTcjkMUpxEDoJqvDkdVY8MLGbFyWtzKHgWuFUYYDZA1uTiy1Ab3kPW9`
