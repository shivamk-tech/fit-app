/**
 * Pure functions for step counting and coin rewards.
 * No I/O here so everything is easy to unit test.
 */
import { COINS_PER_REWARD, STEPS_PER_REWARD } from '../config/rewards';
import type { StepState } from '../types/steps';

/** Local calendar date as YYYY-MM-DD (not UTC, so "today" matches the user's clock). */
export function localDateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function emptyStepState(date: string): StepState {
  return { date, baseline: null, lastSensor: null, steps: 0, rewardedUnits: 0 };
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
 * Work out how many coins are newly owed for the day's steps.
 * Returns the updated state (with rewardedUnits advanced) plus coins to pay.
 */
export function settleRewards(state: StepState): {
  state: StepState;
  coinsEarned: number;
  unitsEarned: number;
} {
  const earnedUnits = Math.floor(state.steps / STEPS_PER_REWARD);
  const unitsEarned = Math.max(0, earnedUnits - state.rewardedUnits);
  if (unitsEarned === 0) {
    return { state, coinsEarned: 0, unitsEarned: 0 };
  }
  return {
    state: { ...state, rewardedUnits: earnedUnits },
    coinsEarned: unitsEarned * COINS_PER_REWARD,
    unitsEarned,
  };
}

export function stepsToNextReward(steps: number): number {
  const remainder = steps % STEPS_PER_REWARD;
  return remainder === 0 && steps > 0 ? STEPS_PER_REWARD : STEPS_PER_REWARD - remainder;
}

export function progressToNextReward(steps: number): number {
  return (steps % STEPS_PER_REWARD) / STEPS_PER_REWARD;
}

export function coinsForSteps(steps: number): number {
  return Math.floor(steps / STEPS_PER_REWARD) * COINS_PER_REWARD;
}
