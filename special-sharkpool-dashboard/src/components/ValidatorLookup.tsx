import { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { useValidatorLookup } from '../hooks/useApi';

const EXAMPLE_VALIDATORS = [
  { name: 'Georgia Tech', addr: 'GLB3jUr5zuu79zFuEH3KP7boxtWsjHVyYRBK2SPshrk' },
  { name: 'Rutgers', addr: 'FH5SX1WUubW9nD1rweZMofCHGhEp8qUMx3PksLfshrk' },
  { name: 'Waterloo', addr: 'gGQb6ZcDG7fsVLWTvXZ1LLoY348tc1zcP2wkh8kshrk' },
];

function formatStakeSol(sol: number): string {
  if (sol >= 1_000_000) return (sol / 1_000_000).toFixed(2) + 'M';
  if (sol >= 1_000) return (sol / 1_000).toFixed(1) + 'K';
  return sol.toFixed(2);
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function ValidatorLookup() {
  const [input, setInput] = useState('');
  const { data, loading, error, lookup } = useValidatorLookup();

  const handleLookup = () => {
    if (input.trim()) lookup(input.trim());
  };

  const chartData = useMemo(() => {
    if (!data?.stakeHistory?.length) return null;
    const history = data.stakeHistory.slice().reverse();
    return {
      labels: history.map(h => shortDate(h.time)),
      datasets: [{
        data: history.map(h => h.stakeAmount),
        backgroundColor: 'rgba(20, 241, 149, 0.3)',
        borderColor: '#14f195',
        borderWidth: 1,
        borderRadius: 6,
      }],
    };
  }, [data]);

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false as const } },
    scales: {
      x: { ticks: { color: '#64748b', maxTicksLimit: 8 }, grid: { color: '#1e293b' } },
      y: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } },
    },
  };

  return (
    <section>
      <h2 className="section-title">Validator Lookup</h2>
      <div className="validator-section">
        <div className="validator-search">
          <input
            type="text"
            placeholder="Enter validator vote address..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLookup()}
          />
          <button onClick={handleLookup} disabled={loading || !input.trim()}>
            {loading ? 'Loading...' : 'Lookup'}
          </button>
        </div>

        <div className="example-validators">
          <span className="example-label">Try:</span>
          {EXAMPLE_VALIDATORS.map((v) => (
            <button
              key={v.addr}
              className="example-btn"
              onClick={() => setInput(v.addr)}
            >
              {v.name}
            </button>
          ))}
        </div>

        {error && <div className="error-msg">{error}</div>}

        {data && (
          <div className="validator-result">
            <div className="validator-stats">
              <div className="validator-stat">
                <div className="label">Vote Address</div>
                <div className="value address">{data.voteAddress}</div>
              </div>
              <div className="validator-stat">
                <div className="label">Current Stake</div>
                <div className="value accent">{formatStakeSol(data.currentStake)} SOL</div>
              </div>
            </div>
            {chartData && (
              <div className="chart-card">
                <h3>Stake History</h3>
                <Bar data={chartData} options={chartOptions} />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
