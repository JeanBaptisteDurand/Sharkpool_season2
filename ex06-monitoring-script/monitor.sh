#!/bin/bash
# Solana Testnet Validator Monitor
# Periodically checks validator health and logs results

set -euo pipefail

# Configuration
VALIDATOR_IDENTITY="${1:?Usage: $0 <validator-identity-pubkey> [interval_seconds]}"
INTERVAL="${2:-60}"
RPC_URL="https://api.testnet.solana.com"
LOG_FILE="monitor.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

check_cluster_health() {
    local slot
    slot=$(solana slot --url "$RPC_URL" 2>/dev/null)
    if [ -z "$slot" ]; then
        log "WARN: Cannot reach cluster RPC"
        return 1
    fi
    log "Cluster slot: $slot"
}

check_validator_status() {
    local info
    info=$(solana validators --url "$RPC_URL" 2>/dev/null | grep "$VALIDATOR_IDENTITY" || true)
    if [ -z "$info" ]; then
        log "ALERT: Validator $VALIDATOR_IDENTITY not found in cluster"
        return 1
    fi

    if echo "$info" | grep -q "delinquent"; then
        log "ALERT: Validator is DELINQUENT"
        return 1
    else
        log "OK: Validator is active"
    fi
}

check_vote_account() {
    local credits
    credits=$(solana vote-account "$VALIDATOR_IDENTITY" --url "$RPC_URL" 2>/dev/null | grep -i "credits" | head -1 || true)
    if [ -n "$credits" ]; then
        log "Vote account: $credits"
    else
        log "WARN: Could not fetch vote account info"
    fi
}

check_balance() {
    local balance
    balance=$(solana balance "$VALIDATOR_IDENTITY" --url "$RPC_URL" 2>/dev/null || echo "unknown")
    log "Balance: $balance"
}

ping_validator() {
    local result
    result=$(solana ping --url "$RPC_URL" --count 3 --timeout 10 2>/dev/null | tail -1 || echo "ping failed")
    log "Ping: $result"
}

# Main loop
log "========================================="
log "Starting monitor for $VALIDATOR_IDENTITY"
log "Interval: ${INTERVAL}s | RPC: $RPC_URL"
log "========================================="

while true; do
    log "--- Health check ---"
    check_cluster_health
    check_validator_status
    check_balance
    check_vote_account
    ping_validator
    log "--- Done. Next check in ${INTERVAL}s ---"
    echo ""
    sleep "$INTERVAL"
done
