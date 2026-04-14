# Exercise 02 - Sign Message

## Task

Sign the message `SHARKLABS` with your validator identity key.

## Instructions

Use the Solana CLI to sign an offchain message with your identity keypair:

```bash
solana sign-offchain-message "SHARKLABS" --keypair <PATH_TO_KEYPAIR>
```

## Output

The command returns a base58-encoded signature to submit on the platform.
