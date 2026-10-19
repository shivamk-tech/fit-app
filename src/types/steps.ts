/** Persistent per-day step counter state. */
export interface StepState {
  /** Local calendar date in YYYY-MM-DD. */
  date: string;
  /**
   * Raw sensor reading that corresponds to 0 steps for this day.
   * The Android step counter reports cumulative steps since boot, so
   * today's steps = sensorValue - baseline.  Null until the first reading.
   */
  baseline: number | null;
  /** Last raw sensor reading seen (used to detect device reboots). */
  lastSensor: number | null;
  /** Steps walked today. */
  steps: number;
  /** How many STEPS_PER_REWARD blocks have already been paid out today. */
  rewardedUnits: number;
}

/** One entry in the coin ledger. */
export interface CoinTransaction {
  id: string;
  /** ISO timestamp. */
  at: string;
  /** Positive for earned, negative for spent. */
  amount: number;
  reason: string;
}

export interface CoinWallet {
  balance: number;
  /** Most recent first. */
  ledger: CoinTransaction[];
}

/** Daily totals, keyed by YYYY-MM-DD. */
export type StepHistory = Record<string, number>;

export type StepSource = 'sensor' | 'manual' | 'unavailable';

export interface StepSnapshot {
  todaySteps: number;
  todayCoins: number;
  stepsToNextReward: number;
  progressToNextReward: number; // 0..1
  wallet: CoinWallet;
  history: StepHistory;
  source: StepSource;
  ready: boolean;
}
