# Exercise 01 - Developer Quest

## Task

Grind a new Solana wallet with the prefix `shrk`.

## Instructions

Use the Solana CLI `solana-keygen grind` command to generate a wallet whose public key starts with `shrk`.

### Prerequisites

Install Solana CLI:

```bash
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
```

### Solution

```bash
solana-keygen grind --starts-with shrk:1
```

This will search for a keypair whose public address starts with `shrk` and save the resulting keypair to a `.json` file in the current directory.

## Output

The command produces a JSON keypair file named `shrk<...>.json` containing the private key of the generated wallet.
