import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';
import type { LstMetricsResponse } from '../types/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const LAMPORTS_PER_SOL = 1_000_000_000;

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const chartOptions = {
  responsive: true,
  plugins: { legend: { display: false as const } },
  scales: {
    x: { ticks: { color: '#64748b', maxTicksLimit: 8 }, grid: { color: '#1e293b' } },
    y: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } },
  },
};

interface Props {
  data: LstMetricsResponse | null;
}

export function LstCharts({ data }: Props) {
  const metrics = useMemo(() => data?.metrics.slice().reverse() || [], [data]);
  const labels = useMemo(() => metrics.map(m => shortDate(m.time)), [metrics]);

  const poolData = useMemo(() => ({
    labels,
    datasets: [{
      data: metrics.map(m => m.lastEpochTotalLamports / LAMPORTS_PER_SOL),
      borderColor: '#14f195',
      backgroundColor: 'rgba(20, 241, 149, 0.08)',
      fill: true, tension: 0.4, pointRadius: 2, borderWidth: 2,
    }],
  }), [labels, metrics]);

  const apyData = useMemo(() => ({
    labels,
    datasets: [{
      data: metrics.map(m => m.ratioApy * 100),
      borderColor: '#9945ff',
      backgroundColor: 'rgba(153, 69, 255, 0.08)',
      fill: true, tension: 0.4, pointRadius: 2, borderWidth: 2,
    }],
  }), [labels, metrics]);

  const poolOptions = useMemo(() => ({
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        ticks: { ...chartOptions.scales.y.ticks, callback: (v: any) => (v / 1_000_000).toFixed(1) + 'M' },
      },
    },
  }), []);

  if (!data) return null;

  return (
    <section>
      <h2 className="section-title">LST Metrics</h2>
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Total Pool (SOL)</h3>
          <Line data={poolData} options={poolOptions} />
        </div>
        <div className="chart-card">
          <h3>APY Ratio (%)</h3>
          <Line data={apyData} options={chartOptions} />
        </div>
      </div>
    </section>
  );
}
