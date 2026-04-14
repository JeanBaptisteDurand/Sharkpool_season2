export interface Metrics {
  solanaPrice: number;
  transactionsPerSecond: number;
  sharkSolApy: number;
  poolAmount: number;
  epochProgress: number;
  epoch: number;
  remainingTime: number;
}

export interface LstMetric {
  ratioApy: number;
  lastEpochTotalLamports: number;
  time: string;
}

export interface LstMetricsResponse {
  metrics: LstMetric[];
}

export interface ValidatorStake {
  voteAddress: string;
  currentStake: number;
  stakeHistory: { stakeAmount: number; time: string }[];
}
