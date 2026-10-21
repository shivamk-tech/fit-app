/**
 * Daily check-in streak.
 *
 * Every day the user checks in by watching a rewarded ad (free if no ad is
 * available). Check-ins on consecutive days build a streak; missing a day
 * resets it. Day 1 of a streak pays 10 coins, day 2 pays 20 … day 7 pays 70,
 * then the cycle repeats (day 8 pays 10 again).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STREAK_BASE_COINS, STREAK_CYCLE_DAYS } from '../config/rewards';
import { localDateKey, startOfLocalDay } from './stepMath';
import { walletStore } from './wallet';

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

// ── Persistence ───────────────────────────────────────────────────────────────

interface StreakClaims {
  /** YYYY-MM-DD dates the user checked in (and was paid). */
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

/** The YYYY-MM-DD date before `dateKey`, in local time. */
export function previousDateKey(dateKey: string): string {
  const d = startOfLocalDay(dateKey);
  d.setDate(d.getDate() - 1);
  return localDateKey(d);
}

export interface CheckInStatus {
  /** Consecutive check-in days, ending today (or yesterday if not yet today). */
  streak: number;
  checkedInToday: boolean;
  /** 1..7: today's position in the reward cycle (after checking in). */
  dayIndex: number;
  /** Coins today's check-in pays. */
  coins: number;
  /** All check-in dates (for the week row). */
  checkedDates: string[];
  /** Coins just paid by this call (0 if nothing new). */
  awarded: number;
}

/** Pure: today's check-in status from the stored check-in dates. */
export function checkInStatus(
  checkedDates: string[],
  today: string = localDateKey(),
): CheckInStatus {
  const dates = new Set(checkedDates);
  const checkedInToday = dates.has(today);
  let streak = 0;
  let cursor = checkedInToday ? today : previousDateKey(today);
  while (dates.has(cursor)) {
    streak++;
    cursor = previousDateKey(cursor);
  }
  const dayIndex = streakDayIndex(checkedInToday ? streak : streak + 1);
  return {
    streak,
    checkedInToday,
    dayIndex,
    coins: streakRewardCoins(dayIndex),
    checkedDates,
    awarded: 0,
  };
}

/** Today's check-in status. Never pays. */
export async function getCheckInStatus(
  today: string = localDateKey(),
): Promise<CheckInStatus> {
  const claims = await loadClaims();
  return checkInStatus(claims.claimedDates, today);
}

/**
 * Check in for today and pay its coins. Call only after the rewarded ad (or
 * when no ad was available). Safe to call more than once a day.
 */
export async function checkIn(
  today: string = localDateKey(),
): Promise<CheckInStatus> {
  const claims = await loadClaims();
  const before = checkInStatus(claims.claimedDates, today);
  if (before.checkedInToday) return before;

  const checkedDates = [...claims.claimedDates, today];
  await saveClaims({ claimedDates: checkedDates });
  await walletStore.load();
  walletStore.credit(
    before.coins,
    `Day ${before.dayIndex} check-in streak bonus`,
  );
  return { ...checkInStatus(checkedDates, today), awarded: before.coins };
}
