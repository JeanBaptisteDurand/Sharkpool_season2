# Exercise 06 - Validator Monitoring Script

## Task

Write a simple bash script for monitoring a Solana testnet validator.

## Script: `monitor.sh`

A periodic health-check script that monitors a Solana testnet validator by:

- Checking cluster connectivity (current slot)
- Checking if the validator is active or delinquent
- Checking the validator's SOL balance
- Fetching vote account info (credits)
- Pinging the cluster for latency

All output is logged to `monitor.log` with timestamps.

## Prerequisites

- Solana CLI installed and in `$PATH`

## Usage

```bash
chmod +x monitor.sh

# Basic usage (checks every 60 seconds)
./monitor.sh <VALIDATOR_IDENTITY_PUBKEY>

# Custom interval (every 30 seconds)
./monitor.sh <VALIDATOR_IDENTITY_PUBKEY> 30

# Run in background
nohup ./monitor.sh <VALIDATOR_IDENTITY_PUBKEY> 60 &

# Example with our shrk key
./monitor.sh shrkUNuzxX5GHopy3bn9LKBzAR6ZYW1TaE6Pq2BSsCa 60
```

## Output

Logs are written to both stdout and `monitor.log`:

```
[2026-04-14 20:00:00] =========================================
[2026-04-14 20:00:00] Starting monitor for shrkUNuz...
[2026-04-14 20:00:00] Interval: 60s | RPC: https://api.testnet.solana.com
[2026-04-14 20:00:00] =========================================
[2026-04-14 20:00:00] --- Health check ---
[2026-04-14 20:00:01] Cluster slot: 345678901
[2026-04-14 20:00:02] OK: Validator is active
[2026-04-14 20:00:02] Balance: 0.5 SOL
[2026-04-14 20:00:03] Vote account: credits: 12345
[2026-04-14 20:00:06] Ping: 3 transactions: min=42ms avg=58ms max=71ms
[2026-04-14 20:00:06] --- Done. Next check in 60s ---
```

## Stop

```bash
# If running in foreground
Ctrl+C

# If running in background
kill $(pgrep -f monitor.sh)
```
