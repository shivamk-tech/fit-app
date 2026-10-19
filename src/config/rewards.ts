/**
 * Tunables for the coin reward system.
 */

// ── Steps ─────────────────────────────────────────────────────────────────────
/** Every STEPS_PER_REWARD steps walked in a day earns COINS_PER_REWARD coins. */
export const STEPS_PER_REWARD = 1000;
export const COINS_PER_REWARD = 10;

/** Soft daily target shown in the UI (not a cap on rewards). */
export const DAILY_STEP_GOAL = 8000;

// ── Workout streak ────────────────────────────────────────────────────────────
/**
 * Completing a workout on consecutive days pays a growing daily bonus:
 * day 1 = 1 × STREAK_BASE_COINS, day 2 = 2 × … up to day STREAK_CYCLE_DAYS,
 * then the cycle restarts at day 1.
 */
export const STREAK_BASE_COINS = 10;
export const STREAK_CYCLE_DAYS = 7;
