import { DAILY_GOAL_COINS, DAILY_STEP_GOAL } from '../src/config/rewards';
import {
  addManualSteps,
  applyDayTotal,
  applySensorReading,
  coinsForSteps,
  emptyStepState,
  goalProgress,
  localDateKey,
  claimGoalReward,
  startOfLocalDay,
  stepsToGoal,
} from '../src/services/stepMath';

const TODAY = '2026-10-20';
const TOMORROW = '2026-10-21';

describe('applySensorReading', () => {
  test('first reading of the day sets the baseline and counts zero steps', () => {
    const s = applySensorReading(emptyStepState(TODAY), 5000, TODAY);
    expect(s.baseline).toBe(5000);
    expect(s.steps).toBe(0);
  });

  test('subsequent readings count steps relative to the baseline', () => {
    let s = applySensorReading(emptyStepState(TODAY), 5000, TODAY);
    s = applySensorReading(s, 5750, TODAY);
    expect(s.steps).toBe(750);
  });

  test('a new day resets the counter', () => {
    let s = applySensorReading(emptyStepState(TODAY), 5000, TODAY);
    s = applySensorReading(s, 8000, TODAY);
    expect(s.steps).toBe(3000);
    s = applySensorReading(s, 8100, TOMORROW);
    expect(s.date).toBe(TOMORROW);
    expect(s.steps).toBe(0);
    expect(s.goalRewarded).toBe(false);
  });

  test('a device reboot (counter goes backwards) keeps the steps already walked', () => {
    let s = applySensorReading(emptyStepState(TODAY), 5000, TODAY);
    s = applySensorReading(s, 6200, TODAY); // 1200 steps
    s = applySensorReading(s, 40, TODAY); // reboot, sensor restarted
    expect(s.steps).toBe(1200);
    s = applySensorReading(s, 140, TODAY);
    expect(s.steps).toBe(1300);
  });
});

describe('addManualSteps', () => {
  test('adds steps when there is no sensor baseline', () => {
    const s = addManualSteps(emptyStepState(TODAY), 250, TODAY);
    expect(s.steps).toBe(250);
    expect(s.baseline).toBeNull();
  });

  test('manual steps survive later sensor readings', () => {
    let s = applySensorReading(emptyStepState(TODAY), 1000, TODAY);
    s = addManualSteps(s, 300, TODAY);
    s = applySensorReading(s, 1100, TODAY);
    expect(s.steps).toBe(400);
  });

  test('ignores negative counts', () => {
    const s = addManualSteps(emptyStepState(TODAY), -50, TODAY);
    expect(s.steps).toBe(0);
  });
});

describe('applyDayTotal (Health Connect)', () => {
  test('takes the full-day total, including steps from before the app opened', () => {
    const s = applyDayTotal(emptyStepState(TODAY), 6400, TODAY);
    expect(s.steps).toBe(6400);
  });

  test('replaces steps counted by another source (no carry-over)', () => {
    let s = addManualSteps(emptyStepState(TODAY), 9500, TODAY);
    s = applyDayTotal(s, 0, TODAY);
    expect(s.steps).toBe(0);
  });

  test('keeps goalRewarded so a source switch never pays twice', () => {
    const paid = { ...emptyStepState(TODAY), steps: 10000, goalRewarded: true };
    const s = applyDayTotal(paid, 10500, TODAY);
    expect(claimGoalReward(s).coinsEarned).toBe(0);
  });

  test('a new day starts from that day’s total, not yesterday’s', () => {
    let s = applyDayTotal(emptyStepState(TODAY), 12000, TODAY);
    s = { ...s, goalRewarded: true };
    s = applyDayTotal(s, 300, TOMORROW);
    expect(s).toMatchObject({
      date: TOMORROW,
      steps: 300,
      goalRewarded: false,
    });
  });
});

describe('claimGoalReward (daily goal)', () => {
  test(`pays nothing below ${DAILY_STEP_GOAL} steps`, () => {
    const s = { ...emptyStepState(TODAY), steps: DAILY_STEP_GOAL - 1 };
    expect(claimGoalReward(s).coinsEarned).toBe(0);
  });

  test(`pays ${DAILY_GOAL_COINS} coins exactly at the goal`, () => {
    const s = { ...emptyStepState(TODAY), steps: DAILY_STEP_GOAL };
    const r = claimGoalReward(s);
    expect(r.coinsEarned).toBe(DAILY_GOAL_COINS);
    expect(r.state.goalRewarded).toBe(true);
  });

  test('pays only once per day', () => {
    const s = { ...emptyStepState(TODAY), steps: DAILY_STEP_GOAL };
    const first = claimGoalReward(s);
    const later = claimGoalReward({
      ...first.state,
      steps: DAILY_STEP_GOAL * 2,
    });
    expect(first.coinsEarned).toBe(DAILY_GOAL_COINS);
    expect(later.coinsEarned).toBe(0);
  });

  test('walking double the goal still pays the same amount', () => {
    const s = { ...emptyStepState(TODAY), steps: DAILY_STEP_GOAL * 2 };
    expect(claimGoalReward(s).coinsEarned).toBe(DAILY_GOAL_COINS);
  });
});

describe('helpers', () => {
  test('stepsToGoal counts down and stops at zero', () => {
    expect(stepsToGoal(0)).toBe(DAILY_STEP_GOAL);
    expect(stepsToGoal(2500)).toBe(DAILY_STEP_GOAL - 2500);
    expect(stepsToGoal(DAILY_STEP_GOAL + 50)).toBe(0);
  });

  test('goalProgress is a 0..1 fraction capped at 1', () => {
    expect(goalProgress(0)).toBe(0);
    expect(goalProgress(DAILY_STEP_GOAL / 2)).toBe(0.5);
    expect(goalProgress(DAILY_STEP_GOAL * 3)).toBe(1);
  });

  test('coinsForSteps mirrors the goal rule', () => {
    expect(coinsForSteps(DAILY_STEP_GOAL - 1)).toBe(0);
    expect(coinsForSteps(DAILY_STEP_GOAL)).toBe(DAILY_GOAL_COINS);
  });

  test('startOfLocalDay is local midnight', () => {
    const d = startOfLocalDay('2026-10-20');
    expect([d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()]).toEqual([
      2026, 9, 20, 0,
    ]);
  });

  test('localDateKey uses the local calendar date', () => {
    expect(localDateKey(new Date(2026, 9, 20, 23, 59))).toBe('2026-10-20');
    expect(localDateKey(new Date(2026, 0, 5, 0, 1))).toBe('2026-01-05');
  });
});
