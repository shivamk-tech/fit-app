import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  CoinTransaction,
  CoinWallet,
  StepHistory,
  StepState,
} from '../types/steps';

const STEP_STATE_KEY = '@fitrewards/step_state';
const STEP_HISTORY_KEY = '@fitrewards/step_history';
const WALLET_KEY = '@fitrewards/coin_wallet';

const MAX_LEDGER_ENTRIES = 50;
const MAX_HISTORY_DAYS = 90;

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

type LegacyStepState = Omit<StepState, 'goalRewarded'> & {
  goalRewarded?: boolean;
  /** Old rule: number of 1,000-step blocks paid. 10 blocks = the 10k goal. */
  rewardedUnits?: number;
};

export async function loadStepState(): Promise<StepState | null> {
  const saved = await readJson<LegacyStepState | null>(STEP_STATE_KEY, null);
  if (!saved) return null;
  const { rewardedUnits, goalRewarded, ...rest } = saved;
  return { ...rest, goalRewarded: goalRewarded ?? (rewardedUnits ?? 0) >= 10 };
}

export function saveStepState(state: StepState): Promise<void> {
  return AsyncStorage.setItem(STEP_STATE_KEY, JSON.stringify(state));
}

export function loadStepHistory(): Promise<StepHistory> {
  return readJson<StepHistory>(STEP_HISTORY_KEY, {});
}

export async function saveStepHistory(history: StepHistory): Promise<void> {
  // Keep only the most recent N days so storage doesn't grow forever.
  const trimmed = Object.fromEntries(
    Object.entries(history)
      .sort(([a], [b]) => (a < b ? 1 : -1))
      .slice(0, MAX_HISTORY_DAYS),
  );
  await AsyncStorage.setItem(STEP_HISTORY_KEY, JSON.stringify(trimmed));
}

export function loadWallet(): Promise<CoinWallet> {
  return readJson<CoinWallet>(WALLET_KEY, { balance: 0, ledger: [] });
}

export function saveWallet(wallet: CoinWallet): Promise<void> {
  return AsyncStorage.setItem(WALLET_KEY, JSON.stringify(wallet));
}

/** Append a transaction and return the updated wallet (not yet saved). */
export function creditWallet(
  wallet: CoinWallet,
  amount: number,
  reason: string,
  at: Date = new Date(),
): CoinWallet {
  const tx: CoinTransaction = {
    id: `${at.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    at: at.toISOString(),
    amount,
    reason,
  };
  return {
    balance: wallet.balance + amount,
    ledger: [tx, ...wallet.ledger].slice(0, MAX_LEDGER_ENTRIES),
  };
}
