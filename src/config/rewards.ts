/**
 * Tunables for the coin reward system.
 */

// ── Steps ─────────────────────────────────────────────────────────────────────
/**
 * Reaching DAILY_STEP_GOAL steps in a calendar day unlocks DAILY_GOAL_COINS,
 * claimable once per day by watching a rewarded ad (free if no ad is
 * available). Unclaimed rewards expire at local midnight.
 */
export const DAILY_STEP_GOAL = 10000;
export const DAILY_GOAL_COINS = 100;

// ── Workout streak ────────────────────────────────────────────────────────────
/**
 * Completing a workout on consecutive days pays a growing daily bonus:
 * day 1 = 1 × STREAK_BASE_COINS, day 2 = 2 × … up to day STREAK_CYCLE_DAYS,
 * then the cycle restarts at day 1.
 */
export const STREAK_BASE_COINS = 10;
export const STREAK_CYCLE_DAYS = 7;
