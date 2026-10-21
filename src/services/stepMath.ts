/**
 * Pure functions for step counting and coin rewards.
 * No I/O here so everything is easy to unit test.
 */
import { DAILY_GOAL_COINS, DAILY_STEP_GOAL } from '../config/rewards';
import type { StepState } from '../types/steps';

/** Local calendar date as YYYY-MM-DD (not UTC, so "today" matches the user's clock). */
export function localDateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function emptyStepState(date: string): StepState {
  return {
    date,
    baseline: null,
    lastSensor: null,
    steps: 0,
    goalRewarded: false,
  };
}

/**
 * Fold a raw cumulative sensor reading into the day's state.
 *
 * Handles:
 *  - first reading of the day (sets the baseline)
 *  - day roll-over (resets to a fresh day)
 *  - device reboot (sensor restarts from 0, so we re-anchor the baseline
 *    to preserve the steps already counted)
 */
export function applySensorReading(
  state: StepState,
  sensorSteps: number,
  today: string,
): StepState {
  if (state.date !== today) {
    return {
      ...emptyStepState(today),
      baseline: sensorSteps,
      lastSensor: sensorSteps,
    };
  }

  let baseline = state.baseline;
  if (baseline === null) {
    baseline = sensorSteps;
  } else if (state.lastSensor !== null && sensorSteps < state.lastSensor) {
    // Counter went backwards: device rebooted. Keep today's steps intact.
    baseline = sensorSteps - state.steps;
  }

  const steps = Math.max(0, Math.round(sensorSteps - baseline));
  return { ...state, baseline, lastSensor: sensorSteps, steps };
}

/**
 * Add steps that didn't come from the sensor (manual entry / simulator on
 * devices without a pedometer).  The baseline is shifted so later sensor
 * readings don't erase the manual steps.
 */
export function addManualSteps(
  state: StepState,
  count: number,
  today: string,
): StepState {
  const base = state.date === today ? state : emptyStepState(today);
  const added = Math.max(0, Math.round(count));
  return {
    ...base,
    steps: base.steps + added,
    baseline: base.baseline === null ? null : base.baseline - added,
  };
}

/**
 * Take an authoritative day total (e.g. from Health Connect, which counts
 * from midnight). It replaces whatever was counted before — including sensor
 * or manual steps from before Health Connect was connected — so steps can't
 * be carried over from another source. goalRewarded is kept, so switching
 * sources never pays the goal twice.
 */
export function applyDayTotal(
  state: StepState,
  total: number,
  today: string,
): StepState {
  const base = state.date === today ? state : emptyStepState(today);
  return {
    ...base,
    baseline: null,
    lastSensor: null,
    steps: Math.max(0, Math.round(total)),
  };
}

/**
 * Claim the daily goal reward: pays only if the goal is reached and it
 * hasn't been claimed yet today. Returns the updated state plus coins to pay.
 */
export function claimGoalReward(state: StepState): {
  state: StepState;
  coinsEarned: number;
} {
  if (state.goalRewarded || state.steps < DAILY_STEP_GOAL) {
    return { state, coinsEarned: 0 };
  }
  return {
    state: { ...state, goalRewarded: true },
    coinsEarned: DAILY_GOAL_COINS,
  };
}

export function stepsToGoal(steps: number): number {
  return Math.max(0, DAILY_STEP_GOAL - steps);
}

export function goalProgress(steps: number): number {
  return Math.min(1, Math.max(0, steps) / DAILY_STEP_GOAL);
}

/** Coins the day's steps are worth under the goal rule. */
export function coinsForSteps(steps: number): number {
  return steps >= DAILY_STEP_GOAL ? DAILY_GOAL_COINS : 0;
}

/** Local midnight at the start of the given YYYY-MM-DD date. */
export function startOfLocalDay(dateKey: string): Date {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d);
}
