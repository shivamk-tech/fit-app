import { COINS_PER_REWARD, STEPS_PER_REWARD } from '../src/config/rewards';
import {
  addManualSteps,
  applySensorReading,
  coinsForSteps,
  emptyStepState,
  localDateKey,
  progressToNextReward,
  settleRewards,
  stepsToNextReward,
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
    expect(s.rewardedUnits).toBe(0);
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

describe('settleRewards', () => {
  test('pays nothing below the first milestone', () => {
    const s = { ...emptyStepState(TODAY), steps: STEPS_PER_REWARD - 1 };
    expect(settleRewards(s).coinsEarned).toBe(0);
  });

  test('pays coins exactly at the milestone', () => {
    const s = { ...emptyStepState(TODAY), steps: STEPS_PER_REWARD };
    const r = settleRewards(s);
    expect(r.coinsEarned).toBe(COINS_PER_REWARD);
    expect(r.state.rewardedUnits).toBe(1);
  });

  test('does not pay the same milestone twice', () => {
    const s = { ...emptyStepState(TODAY), steps: STEPS_PER_REWARD + 10 };
    const first = settleRewards(s);
    const second = settleRewards(first.state);
    expect(first.coinsEarned).toBe(COINS_PER_REWARD);
    expect(second.coinsEarned).toBe(0);
  });

  test('pays for several milestones crossed at once', () => {
    const s = { ...emptyStepState(TODAY), steps: STEPS_PER_REWARD * 3 + 5 };
    const r = settleRewards(s);
    expect(r.unitsEarned).toBe(3);
    expect(r.coinsEarned).toBe(COINS_PER_REWARD * 3);
  });
});

describe('helpers', () => {
  test('stepsToNextReward counts down and resets after a milestone', () => {
    expect(stepsToNextReward(0)).toBe(STEPS_PER_REWARD);
    expect(stepsToNextReward(400)).toBe(STEPS_PER_REWARD - 400);
    expect(stepsToNextReward(STEPS_PER_REWARD)).toBe(STEPS_PER_REWARD);
  });

  test('progressToNextReward is a 0..1 fraction', () => {
    expect(progressToNextReward(0)).toBe(0);
    expect(progressToNextReward(STEPS_PER_REWARD / 2)).toBe(0.5);
    expect(progressToNextReward(STEPS_PER_REWARD)).toBe(0);
  });

  test('coinsForSteps mirrors the reward rule', () => {
    expect(coinsForSteps(STEPS_PER_REWARD * 2 + 999)).toBe(COINS_PER_REWARD * 2);
  });

  test('localDateKey uses the local calendar date', () => {
    expect(localDateKey(new Date(2026, 9, 20, 23, 59))).toBe('2026-10-20');
    expect(localDateKey(new Date(2026, 0, 5, 0, 1))).toBe('2026-01-05');
  });
});
