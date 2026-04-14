# Special Quest — SharkPool Dashboard

A single-page web dashboard that displays live data from the [SharkPool Public API](https://public-api.sharkpool.org).

## Features

- **Live Blockchain Metrics**: SOL price, sharkSOL APY, pool amount, TPS, epoch progress
- **LST Metrics History**: 30-day chart of total lamports and APY ratio
- **Validator Lookup**: Search any validator by vote address to see current stake and history
- **Auto-refresh**: Data refreshes every 60 seconds
- **Responsive**: Works on desktop and mobile

## Usage

Open `index.html` in any browser — no build step or server required.

## API

Uses the SharkPool Public API (`https://public-api.sharkpool.org`):
- `GET /metrics` — Blockchain metrics
- `GET /lst/metrics` — LST metrics history (30 records)
- `GET /validators/vote/{voteAddress}/stake` — Validator stake data
