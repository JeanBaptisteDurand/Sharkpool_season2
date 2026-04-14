import { useState, useEffect, useCallback } from 'react';
import type { Metrics, LstMetricsResponse, ValidatorStake } from '../types/api';

const API = '/api';
const LAMPORTS_PER_SOL = 1_000_000_000;

export function formatSol(lamports: number): string {
  const sol = lamports / LAMPORTS_PER_SOL;
  if (sol >= 1_000_000) return (sol / 1_000_000).toFixed(2) + 'M';
  if (sol >= 1_000) return (sol / 1_000).toFixed(1) + 'K';
  return sol.toFixed(2);
}

export function formatTime(ms: number): string {
  if (!ms) return '--';
  const seconds = Math.floor(ms / 1000);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

export function useMetrics() {
  const [data, setData] = useState<Metrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch(`${API}/metrics`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const metrics: Metrics = await res.json();

      // Fallback to CoinGecko only if SharkPool API returns 0 for SOL price
      if (!metrics.solanaPrice) {
        try {
          const cgRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
          const cg = await cgRes.json();
          if (cg?.solana?.usd) metrics.solanaPrice = cg.solana.usd;
        } catch {}
      }

      setData(metrics);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    fetch_();
    const id = setInterval(fetch_, 60_000);
    return () => clearInterval(id);
  }, [fetch_]);

  return { data, error };
}

export function useLstMetrics() {
  const [data, setData] = useState<LstMetricsResponse | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch(`${API}/lst/metrics`);
      if (!res.ok) return;
      setData(await res.json());
    } catch {}
  }, []);

  useEffect(() => {
    fetch_();
    const id = setInterval(fetch_, 60_000);
    return () => clearInterval(id);
  }, [fetch_]);

  return data;
}

export function useValidatorLookup() {
  const [data, setData] = useState<ValidatorStake | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = useCallback(async (voteAddress: string) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(`${API}/validators/vote/${encodeURIComponent(voteAddress)}/stake`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Validator not found (${res.status})`);
      }
      setData(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, lookup };
}
