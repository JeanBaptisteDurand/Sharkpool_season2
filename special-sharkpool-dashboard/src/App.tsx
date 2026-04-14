import { useMetrics, useLstMetrics } from './hooks/useApi';
import { MetricsGrid } from './components/MetricsGrid';
import { LstCharts } from './components/LstCharts';
import { ValidatorLookup } from './components/ValidatorLookup';
import './App.css';

function App() {
  const { data: metrics } = useMetrics();
  const lstData = useLstMetrics();

  return (
    <div className="dashboard">
      <header>
        <div className="header-left">
          <img src="/42bc-logo.jpg" alt="42 Blockchain" className="corner-logo" />
          <div className="logo">
            <span className="shark">Shark</span>
            <span className="pool">Pool</span>
          </div>
        </div>
        <div className="refresh-info">
          <span className="live-dot" />
          Auto-refresh 60s
        </div>
      </header>

      <main>
        <MetricsGrid data={metrics} />
        <LstCharts data={lstData} />
        <ValidatorLookup />
      </main>

      <footer>
        Powered by{' '}
        <a href="https://public-api.sharkpool.org/docs" target="_blank" rel="noreferrer">
          SharkPool Public API
        </a>
        {' '}&bull; Built for SharkPool Season 2 &bull; 42Blockchain
      </footer>
    </div>
  );
}

export default App;
