# Exercise 03 - Deploy Testnet Validator

## Task

Deploy a Solana testnet validator using the identity key from Exercise 01.

## Identity Key

`shrkUNuzxX5GHopy3bn9LKBzAR6ZYW1TaE6Pq2BSsCa`

## Instructions

### 1. Configure Solana CLI for testnet

```bash
solana config set --url https://api.testnet.solana.com
solana config set --keypair <path-to-shrk-keypair>
```

### 2. Airdrop SOL for fees

```bash
solana airdrop 1
```

### 3. Create vote account and authorized withdrawer keypairs

```bash
solana-keygen new -o vote-account-keypair.json
solana-keygen new -o authorized-withdrawer-keypair.json
```

### 4. Create the vote account on-chain

```bash
solana create-vote-account vote-account-keypair.json <identity-keypair> authorized-withdrawer-keypair.json
```

### 5. Start the validator

```bash
agave-validator \
  --identity <identity-keypair> \
  --vote-account vote-account-keypair.json \
  --known-validator 5D1fNXzvv5NjV1ysLjirC4WY92RNsVH18vjmcszZd8on \
  --known-validator dDzy5SR3AXdYWVqbDEkVFdvSPCtS9ihF7kJkbJkaPev \
  --known-validator Ft5fbkqNa76vnsjYNwjDZUXoTWpP7VYm3mtsaQckQADN \
  --known-validator eoKpUABi59aT4rR9HGS3LcMecfut9x7zJyodWWP43YQ \
  --known-validator 9QxCLckBiJc783jnMvXZubK4wH86Eqqvashtrwvcsgkv \
  --only-known-rpc \
  --ledger ledger \
  --rpc-port 8899 \
  --dynamic-port-range 8000-8020 \
  --entrypoint entrypoint.testnet.solana.com:8001 \
  --entrypoint entrypoint2.testnet.solana.com:8001 \
  --entrypoint entrypoint3.testnet.solana.com:8001 \
  --expected-genesis-hash 4uhcVJyU9pJkvQyS88uRDiswHXSCkY3zQawwpjk2NsNY \
  --wal-recovery-mode skip_any_corrupted_record \
  --log -
```

## Answer

Identity key: `shrkUNuzxX5GHopy3bn9LKBzAR6ZYW1TaE6Pq2BSsCa`
