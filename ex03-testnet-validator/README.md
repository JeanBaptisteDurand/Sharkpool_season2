# Exercise 03 - Deploy Testnet Validator (Parallel Plan)

## Status: ⏸ On hold — 4-day parallel plan ready, execution pending

This doc is the **optimized 4-day plan** to complete ex03, ex04, and top-1 snapshot (+200 pts) **simultaneously** using GCP $300 free-tier credit.

## Key insight: Frankendancer satisfies both ex03 AND ex04

- **ex03** asks for "testnet node with identity key" — Frankendancer IS a testnet validator
- **ex04** asks for "Firedancer validator" — Frankendancer IS the current Firedancer build (full Firedancer isn't released yet)
- **Same identity key** for both → **same running validator answers both quests**

So we install Frankendancer from Day 1. No Agave → Frankendancer migration. We get peak performance immediately and start racking up time for top-1 hunting.

## Identity

- **Validator identity:** `shrkUNuzxX5GHopy3bn9LKBzAR6ZYW1TaE6Pq2BSsCa`
- **Vote account:** `GcX55v9XHTV31JhuiWgz1vjDki3VJfnSCunzZquv1in3`
- **Authorized withdrawer:** `HU56mpceu6nj41HNemr5ocWffxBxKzUErDMM8AE7gwkg`

## Budget (4 days)

| VM | Cost/hr | 4 days |
|----|---------|--------|
| `n2-highmem-32` on-demand (32vCPU, 256GB) + 2×1TB SSD | ~$1.92 | **~$184** |

Well under $300. ~$115 safety margin for egress spikes, rebuilds, etc.

## Top-1 probability — maximized

By running Frankendancer from hour 1 instead of sequentially:
- ~2.5 full epochs of Frankendancer voting (vs ~1.5 in sequential plan)
- Per-epoch snapshot chance: ~30-40% cumulative
- Hourly snapshot chance: essentially **guaranteed** over 96 hours

⚠️ **Critical unknown**: we don't know WHICH tracker or cadence SharkPool uses to judge "top 1 in any snapshot". Categories that favor Frankendancer regardless of the source: **TVC performance, voting latency, skip rate, compute units per slot**.

---

## Parallel timeline

### Day 0 (pre-flight, critical!)
- [ ] Create new Google account, activate $300 credit
- [ ] **Request 32 vCPU quota bump** (us-central1) → approval takes 2-24h, don't skip
- [ ] Set billing alerts: $150 / $250 / $280
- [ ] **Pre-build Frankendancer locally** or on any cheap box to validate your toml config works before spending GCP dollars

### Day 1 AM — Spin up (1h)
```bash
gcloud compute instances create sharkpool-val \
  --machine-type=n2-highmem-32 \
  --image-family=ubuntu-2204-lts --image-project=ubuntu-os-cloud \
  --boot-disk-size=50GB --boot-disk-type=pd-balanced \
  --create-disk=name=ledger,size=1000GB,type=pd-ssd \
  --create-disk=name=accounts,size=1000GB,type=pd-ssd \
  --zone=us-central1-a
```
- System tuning (sysctl, limits per official Agave docs)
- Format & mount `/mnt/ledger` + `/mnt/accounts`
- Create `sol` user, copy keypairs, install Solana CLI (needed for `solana gossip` etc.)
- Airdrop 1 testnet SOL to validator identity for vote fees

### Day 1 PM — Install Frankendancer directly (3-4h)
```bash
# On VM as sol user
cd /home/sol
git clone --recurse-submodules https://github.com/firedancer-io/firedancer
cd firedancer
./deps.sh   # installs build deps
FD_AUTO_INSTALL_PACKAGES=1 make -j fdctl solana
```

Config (`/home/sol/config.toml`):
```toml
user = "sol"
[gossip]
entrypoints = [
  "entrypoint.testnet.solana.com:8001",
  "entrypoint2.testnet.solana.com:8001",
  "entrypoint3.testnet.solana.com:8001",
]
[consensus]
identity_path = "/home/sol/shrkUNuzxX5GHopy3bn9LKBzAR6ZYW1TaE6Pq2BSsCa.json"
vote_account_path = "/home/sol/vote-account-keypair.json"
known_validators = [
  "5D1fNXzvv5NjV1ysLjirC4WY92RNsVH18vjmcszZd8on",
  "7XSY3MrYnK8vq693Rju17bbPkCN3Z7KvvfvJx4kdrsSY",
  "Ft5fbkqNa76vnsjYNwjDZUXoTWpP7VYm3mtsaQckQADN",
  "9QxCLckBiJc783jnMvXZubK4wH86Eqqvashtrwvcsgkv",
]
expected_genesis_hash = "4uhcVJyU9pJkvQyS88uRDiswHXSCkY3zQawwpjk2NsNY"
[ledger]
path = "/mnt/ledger"
accounts_path = "/mnt/accounts"
limit_size = 200_000_000
[rpc]
port = 8899
[layout]
affinity = "auto"
```

```bash
sudo build/native/gcc/bin/fdctl configure init all --config /home/sol/config.toml
sudo build/native/gcc/bin/fdctl run --config /home/sol/config.toml
```

### Day 1 Evening — Catch up + submit BOTH quests
- Wait for `solana catchup shrkUNuzxX5GHopy3bn9LKBzAR6ZYW1TaE6Pq2BSsCa` → "caught up" (60-90 min typically on Frankendancer)
- Verify: `solana gossip | grep shrkUNuz`, `solana validators | grep shrkUNuz`
- **Submit ex03** with identity `shrkUNuzxX5GHopy3bn9LKBzAR6ZYW1TaE6Pq2BSsCa`
- **Submit ex04** with same identity
- Start systemd service for auto-restart
- Start top-1 monitoring

### Day 2-4 — Vote accumulation + top-1 hunt

**Target categories where Frankendancer can realistically hit top-1:**
- **Best TVC performance** ← main FD advantage
- **Lowest voting latency** ← main FD advantage
- **Lowest skip rate**
- **Highest compute units per slot**
- (Leader slot performance and stake-based rankings are harder — they need stake/leader slots)

Trackers to monitor every 30 min (automate via cron):
- https://validator.info/solana
- https://stakewiz.com
- https://www.validators.app/validators/testnet
- https://svt.one
- SharkPool's own dashboards / any SharkLabs-specific ranking

**Screenshot the moment your validator hits #1** in any metric on any public tracker.

Day 3-4: if not top-1 yet, tune:
- `[layout] affinity` → pin CPU cores
- Monitor log for "skipped" or "fork" warnings
- Consider increasing `--accounts-index-memory-limit-mb` if OOM-ish

### Day 4 evening — teardown
```bash
gcloud compute instances delete sharkpool-val --zone=us-central1-a
gcloud compute disks delete ledger accounts --zone=us-central1-a
```
Verify billing ≈ $0 remaining.

---

## Fallback: if Frankendancer build fails

Keep Agave as safety net. Install both, run Frankendancer by default:
```bash
# Install agave as backup in parallel on Day 1
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
# If fdctl fails → `agave-validator` with same keypairs + /home/sol/bin/validator.sh
```
If we fall back to Agave:
- ex03 still passes (Agave IS a testnet validator) ✅
- ex04 likely fails (no Firedancer) ❌
- Top-1 chance drops ~5x but not zero

## Priority guarantees

| Quest | Method | Failure fallback |
|-------|--------|-------------------|
| **ex03** | Frankendancer or Agave | Agave always works |
| **ex04** | Frankendancer only | Skip if FD broken |
| **Top-1** | Frankendancer × 96h hunting | Lower chance with Agave |

Best case: all 3 done by Day 4. Worst case: ex03 done, ex04 + top-1 attempted.

---

## References
- Official Agave setup: https://docs.anza.xyz/operations/setup-a-validator
- Solana requirements: https://docs.anza.xyz/operations/requirements
- Firedancer getting started: https://docs.firedancer.io/guide/getting-started.html
