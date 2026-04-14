# Exercise 07 - Add DLMM Liquidity on Meteora

**Status: DONE** — Added SOL/USDC liquidity on Meteora DLMM (bin step 4, fee 0.04%, Spot strategy, 69-bin range around active price).

## Task

Add DLMM liquidity on Meteora and submit the TX link.

## Quick recap: what is DLMM?

Meteora's **DLMM (Dynamic Liquidity Market Maker)** is a concentrated-liquidity AMM on Solana. Instead of spreading your capital across an infinite price curve (like Uniswap v2), you deposit into discrete **bins**, each representing a narrow price range. You only earn fees on bins the current price is crossing — the tighter your range, the more fees per $ deposited, but the higher the chance of going "out of range" and earning nothing.

---

## Understanding the pool list

When you browse a pair (e.g. SOL-USDC), Meteora shows 100+ pool variants. Here's how to read the columns:

### Bin Step
Price gap between two consecutive bins, in **basis points (1 bp = 0.01%)**.

- **Bin Step 1** = 0.01% per bin → ultra-fine, for stables (USDC/USDT)
- **Bin Step 4** = 0.04% → fine, good for correlated pairs
- **Bin Step 20** = 0.20% → medium, classic SOL/USDC
- **Bin Step 100** = 1% → wide, volatile tokens / memecoins

Smaller = finer concentration, more bins needed to cover a range. Larger = each bin covers more price, less rebalancing.

### Fee (Base Fee)
Minimum swap fee traders pay when they cross your bins. That's what you earn (minus ~5% protocol fee). A **Dynamic Fee** can also kick in during volatility, pushing the effective fee higher.

Note: fee and bin step are often aligned (bin step 4 → fee 0.04%) but not always — check both columns.

### TVL (Total Value Locked)
Total deposits in the pool. Higher TVL = more stable, less slippage, but **your share of the fees is diluted** → lower yield per $.

### 24h Vol
Swap volume over 24h. **This is what generates fees.** High volume + moderate TVL = best LP yield.

### 24h Fee/TVL %
**The key metric for picking a pool.** Daily gross yield = fees earned / total liquidity. Rough annualization: `Fee/TVL × 365`.

Example from the SOL/USDC list:
- Bin Step 4, Fee 0.04% → 0.28%/day ≈ **102% APR gross**
- Bin Step 10, Fee 0.10% → 0.33%/day ≈ **120% APR gross**
- Bin Step 2, Fee 0.02% → 0.37%/day ≈ **135% APR** but only $2.6k TVL (thin pool, risky)

⚠️ These APRs are **theoretical** — they don't account for **impermanent loss** or the need to stay in-range.

---

## Understanding the Create Position panel

### Current Price
The current price of this specific Meteora pool (e.g. `83.68 USDC/SOL`). It's set by the market, NOT by you. It marks the **active bin** — the only bin earning fees right now.

### Bin colors on the liquidity chart
- 🟦 **Cyan bins (left of active price)** → filled with **quote token** (USDC)
- 🟪 **Purple bins (right of active price)** → filled with **base token** (SOL)
- When price moves right, your USDC gradually converts to SOL (and vice-versa)

### Price Range (what you actually control)
- **Min Price / Max Price** = boundaries of YOUR range around the current price
- Slider moves YOUR bounds, not the market price
- Range entirely left of current price → 100% USDC (limit-buy SOL)
- Range entirely right of current price → 100% SOL (limit-sell SOL)
- Range straddling current price → split ~50/50 (classic LP position)

### "Sync with Jupiter's price"
Button appears only when the pool price diverges from Jupiter's aggregated market price. Click it to avoid getting arbitraged the moment you open your position. If the button isn't shown, the pool is already in sync.

### Volatility Strategy (liquidity shape)
- **Spot** — uniform distribution across the range. Good default.
- **Curve** — concentrated around current price. Best for stables.
- **Bid-Ask** — more at edges. Volatile pairs or DCA in/out.

### Cost details
- **Cost required to create 1 position** (~0.057 SOL) → rent
- **Refunded upon closing positions** (~0.057 SOL) → you get this back when you withdraw + close

---

## Instructions

This must be done through the Meteora web interface on **mainnet**.

### What you need in your wallet

- **~$10** of assets (either both tokens of the pair, or one token if you use "Ape In" / single-sided)
- **~0.1 SOL** for rent + gas. Most of it (~0.057 SOL) is **refundable** when you close the position

### Recommended setup for this quest

**SOL/USDC, bin step 4, fee 0.04%** — high TVL + huge 24h volume → active fee-earning position
- Spot strategy, default 69-bin range
- Deposit ~0.06 SOL + ~5.84 USDC (~$5 each, Auto-Fill balances it)

### Steps

1. Go to [meteora.ag](https://app.meteora.ag/) → browse pools → pick **SOL-USDC**
2. From the list of pool variants, pick **Bin Step 4, Fee 0.04%** (best balance of TVL + Fee/TVL)
3. Connect wallet (Phantom, Solflare)
4. Click **Create Position** in the right panel
5. If **"Sync with Jupiter's price"** button appears, click it
6. Keep **Auto-Fill ON** → type an amount in the SOL field (e.g. `0.06`) → USDC auto-fills
7. **Strategy:** click **Spot**
8. **Price Range:** leave 69 bins default (straddles current price ~1.3% each side)
9. Verify cost: `Cost required: ~0.057 SOL`, `Refunded on close: ~0.057 SOL`
10. Click the orange **Create Position** button at the bottom
11. Approve the transaction in your wallet
12. Position appears in "Open Positions" → copy TX hash from wallet history or Solscan

### Tips

- **Narrower range** = higher fees per $ but higher risk of going out of range (→ earns nothing)
- **Out of range** positions stop earning until price returns OR you rebalance
- **Fees don't auto-compound** — claim them manually via "Claim All Fees"
- **To exit:** select position → **Withdraw and Close** → get your tokens back + ~0.057 SOL rent refund
- **Avoid Bin Step 80/100+** unless you understand memecoin LPing — they're built for extreme volatility

## References

- [Meteora Pools](https://app.meteora.ag/pools)
- [Meteora DLMM User Guide](https://docs.meteora.ag/user-guide/guides/how-to-use-dlmm)
- [DLMM Dynamic Terminal Docs](https://docs.meteora.ag/user-guide/guides/dynamic-terminal)
