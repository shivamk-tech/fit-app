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
  /** Whether today's DAILY_GOAL_COINS have been claimed. */
  goalRewarded: boolean;
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

/**
 * Where today's steps come from, in order of preference:
 * Health Connect (full day, from midnight) → phone sensor (from first app
 * open) → manual (dev builds only) → unavailable.
 */
export type StepSource =
  | 'connecting' // still working out which source to use (app start)
  | 'healthConnect'
  | 'sensor'
  | 'manual'
  | 'unavailable';

/** Health Connect state, so the UI can offer the right fix. */
export type HealthConnectStatus =
  | 'unsupported' // not Android
  | 'notInstalled'
  | 'updateRequired'
  | 'permissionDenied'
  | 'connected';

export interface StepSnapshot {
  todaySteps: number;
  todayCoins: number;
  stepsToGoal: number;
  goalProgress: number; // 0..1
  goalReached: boolean;
  /** Goal reached today but its coins not yet claimed. */
  goalClaimable: boolean;
  healthConnect: HealthConnectStatus;
  /** ISO time of the last successful Health Connect read. */
  lastSyncedAt: string | null;
  wallet: CoinWallet;
  history: StepHistory;
  source: StepSource;
  ready: boolean;
}
