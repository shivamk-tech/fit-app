import { STREAK_BASE_COINS, STREAK_CYCLE_DAYS } from '../src/config/rewards';
import {
  STREAK_REWARD_TABLE,
  nextStreakDayIndex,
  streakDayIndex,
  streakRewardCoins,
} from '../src/services/streakRewards';

describe('streakDayIndex', () => {
  test('no streak means no reward day', () => {
    expect(streakDayIndex(0)).toBe(0);
    expect(streakDayIndex(-3)).toBe(0);
  });

  test('days 1 to 7 map to themselves', () => {
    for (let d = 1; d <= STREAK_CYCLE_DAYS; d++) {
      expect(streakDayIndex(d)).toBe(d);
    }
  });

  test('cycle repeats after day 7', () => {
    expect(streakDayIndex(8)).toBe(1);
    expect(streakDayIndex(14)).toBe(7);
    expect(streakDayIndex(15)).toBe(1);
    expect(streakDayIndex(100)).toBe(((100 - 1) % 7) + 1);
  });
});

describe('streakRewardCoins', () => {
  test('pays 10, 20 … 70 for days 1 to 7', () => {
    expect(STREAK_REWARD_TABLE).toEqual([10, 20, 30, 40, 50, 60, 70]);
    expect(streakRewardCoins(1)).toBe(STREAK_BASE_COINS);
    expect(streakRewardCoins(7)).toBe(STREAK_BASE_COINS * 7);
  });

  test('pays nothing for day 0', () => {
    expect(streakRewardCoins(0)).toBe(0);
  });

  test('day 8 of a streak pays the day-1 amount again', () => {
    expect(streakRewardCoins(streakDayIndex(8))).toBe(10);
  });
});

describe('nextStreakDayIndex', () => {
  test('if already worked out today, the current day is the reward day', () => {
    expect(nextStreakDayIndex(3, true)).toBe(3);
  });

  test('if not yet worked out today, the next day is the reward day', () => {
    expect(nextStreakDayIndex(3, false)).toBe(4);
    expect(nextStreakDayIndex(0, false)).toBe(1);
    expect(nextStreakDayIndex(7, false)).toBe(1);
  });
});
