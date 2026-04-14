# Special Quest - SharkPool Dashboard

A single-page web dashboard displaying live data from the [SharkPool Public API](https://public-api.sharkpool.org).

## Features

- **Live Blockchain Metrics**: SOL price, sharkSOL APY, pool amount, TPS, epoch progress with animated bar
- **LST Metrics Charts**: Interactive Chart.js graphs for Total Pool (SOL) and APY Ratio over time
- **Validator Lookup**: Search any validator by vote address to see current stake and stake history chart
- **Auto-refresh**: All data refreshes every 60 seconds with live indicator
- **Responsive**: Works on desktop and mobile
- **42 Blockchain branding**: Logo and tab favicon

## API Endpoints Used

| Endpoint | Description |
|----------|-------------|
| `GET /metrics` | Solana price, TPS, sharkSOL APY, pool amount, epoch progress |
| `GET /lst/metrics` | Last 30 records of LST metrics (total lamports, APY ratio) |
| `GET /validators/vote/{voteAddress}/stake` | Current stake and stake history for a validator |

Rate limit: 1 req/s, 45 req/min

## Usage

Open `index.html` in any browser. No build step, no dependencies, no server required.

## Stack

- Vanilla HTML/CSS/JS (single file)
- [Chart.js](https://www.chartjs.org/) for graphs
- [SharkPool Public API](https://public-api.sharkpool.org/docs)
