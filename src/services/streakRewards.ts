/**
 * Daily workout-streak bonus.
 *
 * Day 1 of a streak pays 10 coins, day 2 pays 20 … day 7 pays 70, and then
 * the cycle repeats (day 8 pays 10 again). The bonus is paid once per calendar
 * day, the first time the app sees a completed workout for that day.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STREAK_BASE_COINS, STREAK_CYCLE_DAYS } from '../config/rewards';
import type { WorkoutSession } from '../types/workout';
import { localDateKey } from './stepMath';
import { walletStore } from './wallet';
import { calculateStreak, sessionDateKey } from './workoutStorage';

const CLAIMS_KEY = '@fitrewards/streak_claims';
const MAX_CLAIMS_KEPT = 60;

// ── Pure helpers ──────────────────────────────────────────────────────────────

/**
 * Which day of the 7-day cycle a streak length corresponds to.
 * 0 → 0 (no streak), 1 → 1, 7 → 7, 8 → 1, 15 → 1 …
 */
export function streakDayIndex(streak: number): number {
  if (streak <= 0) return 0;
  return ((streak - 1) % STREAK_CYCLE_DAYS) + 1;
}

/** Coins paid for a given day of the cycle (1..7). */
export function streakRewardCoins(dayIndex: number): number {
  if (dayIndex <= 0) return 0;
  return dayIndex * STREAK_BASE_COINS;
}

/** The full reward table, e.g. [10, 20, 30, 40, 50, 60, 70]. */
export const STREAK_REWARD_TABLE: number[] = Array.from(
  { length: STREAK_CYCLE_DAYS },
  (_, i) => streakRewardCoins(i + 1),
);

/** Streak length the user will be on if they work out today. */
export function nextStreakDayIndex(
  currentStreak: number,
  workedOutToday: boolean,
): number {
  return streakDayIndex(workedOutToday ? currentStreak : currentStreak + 1);
}

// ── Persistence ───────────────────────────────────────────────────────────────

interface StreakClaims {
  /** YYYY-MM-DD dates whose streak bonus has already been paid. */
  claimedDates: string[];
}

async function loadClaims(): Promise<StreakClaims> {
  try {
    const raw = await AsyncStorage.getItem(CLAIMS_KEY);
    return raw ? (JSON.parse(raw) as StreakClaims) : { claimedDates: [] };
  } catch {
    return { claimedDates: [] };
  }
}

async function saveClaims(claims: StreakClaims): Promise<void> {
  const trimmed = { claimedDates: claims.claimedDates.slice(-MAX_CLAIMS_KEPT) };
  await AsyncStorage.setItem(CLAIMS_KEY, JSON.stringify(trimmed));
}

export interface StreakRewardStatus {
  /** Current consecutive-day streak (ends today or yesterday). */
  streak: number;
  /** 1..7 position in the cycle for the current streak, 0 if none. */
  dayIndex: number;
  /** True once today's bonus has been paid. */
  claimedToday: boolean;
  /** Coins just paid out by this call (0 if nothing new). */
  awarded: number;
}

/**
 * Pay today's streak bonus if a workout was completed today and the bonus
 * hasn't been paid yet. Safe to call as often as you like.
 */
export async function settleStreakReward(
  sessions: WorkoutSession[],
  today: string = localDateKey(),
): Promise<StreakRewardStatus> {
  const streak = calculateStreak(sessions);
  const dayIndex = streakDayIndex(streak);
  const workedOutToday = sessions.some(s => sessionDateKey(s) === today);

  const claims = await loadClaims();
  const alreadyClaimed = claims.claimedDates.includes(today);

  if (!workedOutToday || alreadyClaimed || dayIndex === 0) {
    return { streak, dayIndex, claimedToday: alreadyClaimed, awarded: 0 };
  }

  const coins = streakRewardCoins(dayIndex);
  await walletStore.load();
  walletStore.credit(coins, `Day ${dayIndex} workout streak bonus`);
  await saveClaims({ claimedDates: [...claims.claimedDates, today] });

  return { streak, dayIndex, claimedToday: true, awarded: coins };
}
