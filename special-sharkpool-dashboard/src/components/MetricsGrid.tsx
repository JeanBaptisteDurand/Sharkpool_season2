import type { Metrics } from '../types/api';
import { formatSol, formatTime } from '../hooks/useApi';

interface Props {
  data: Metrics | null;
}

export function MetricsGrid({ data }: Props) {
  return (
    <section>
      <h2 className="section-title">Blockchain Metrics</h2>
      <div className="metrics-grid">
        <MetricCard label="SOL Price" value={data?.solanaPrice ? `$${data.solanaPrice.toFixed(2)}` : 'N/A'} color="accent" />
        <MetricCard label="sharkSOL APY" value={data ? `${(data.sharkSolApy * 100).toFixed(2)}%` : '--'} color="purple" />
        <MetricCard label="Pool Amount" value={data ? `${formatSol(data.poolAmount)} SOL` : '--'} color="cyan" />
        <MetricCard label="TPS" value={data?.transactionsPerSecond ? data.transactionsPerSecond.toFixed(0) : '--'} />
        <div className="metric-card">
          <div className="metric-label">Epoch</div>
          <div className="metric-value amber">{data?.epoch || '--'}</div>
          <div className="epoch-bar-container">
            <div className="epoch-bar" style={{ width: data ? `${(data.epochProgress * 100).toFixed(1)}%` : '0%' }} />
          </div>
        </div>
        <MetricCard label="Time Remaining" value={data ? formatTime(data.remainingTime) : '--'} />
      </div>
    </section>
  );
}

function MetricCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className={`metric-value ${color || ''}`}>{value}</div>
    </div>
  );
}
