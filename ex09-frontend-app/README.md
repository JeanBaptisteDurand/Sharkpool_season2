# Exercise 09 - Simple Frontend App

## Task

Create a frontend app that:
1. Connects a Solana wallet
2. Displays user public address and balance
3. Has a "Send 0.01 SOL" button that transfers to another wallet

## Stack

- React + TypeScript + Vite
- `@solana/web3.js` — Solana SDK
- `@solana/wallet-adapter-react` — wallet connection
- `@solana/wallet-adapter-react-ui` — wallet UI components

## Features

- **Connect wallet** via Phantom, Solflare, or any Solana wallet
- **Display address** and **SOL balance** (auto-refreshes every 5s)
- **Send 0.01 SOL** button — transfers to `shrkUNuzxX5GHopy3bn9LKBzAR6ZYW1TaE6Pq2BSsCa`
- **TX confirmation** with link to Solana Explorer
- Connected to **testnet**

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Build

```bash
npm run build
```
