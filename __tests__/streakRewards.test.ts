import { STREAK_BASE_COINS, STREAK_CYCLE_DAYS } from '../src/config/rewards';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  STREAK_REWARD_TABLE,
  checkIn,
  checkInStatus,
  previousDateKey,
  streakDayIndex,
  streakRewardCoins,
} from '../src/services/streakRewards';
import { walletStore } from '../src/services/wallet';

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

const TODAY = '2026-10-20';
const YESTERDAY = '2026-10-19';
const TWO_DAYS_AGO = '2026-10-18';

describe('checkInStatus (daily check-in)', () => {
  test('first ever day: not checked in, Day 1 pays 10', () => {
    expect(checkInStatus([], TODAY)).toMatchObject({
      streak: 0,
      checkedInToday: false,
      dayIndex: 1,
      coins: 10,
    });
  });

  test('checked in yesterday: today continues the streak as Day 2', () => {
    expect(checkInStatus([YESTERDAY], TODAY)).toMatchObject({
      streak: 1,
      checkedInToday: false,
      dayIndex: 2,
      coins: 20,
    });
  });

  test('checked in today: streak includes today and nothing more to claim', () => {
    expect(checkInStatus([YESTERDAY, TODAY], TODAY)).toMatchObject({
      streak: 2,
      checkedInToday: true,
      dayIndex: 2,
    });
  });

  test('missing a day restarts the streak at Day 1', () => {
    expect(checkInStatus([TWO_DAYS_AGO], TODAY)).toMatchObject({
      streak: 0,
      dayIndex: 1,
      coins: 10,
    });
  });

  test('after 7 days in a row the cycle restarts at 10 coins', () => {
    let d = TODAY;
    const week: string[] = [];
    for (let i = 0; i < 7; i++) {
      d = previousDateKey(d);
      week.push(d);
    }
    expect(checkInStatus(week, TODAY)).toMatchObject({
      streak: 7,
      dayIndex: 1,
      coins: 10,
    });
  });

  test('previousDateKey crosses month boundaries', () => {
    expect(previousDateKey('2026-11-01')).toBe('2026-10-31');
  });
});

describe('checkIn', () => {
  beforeEach(() => AsyncStorage.clear());

  test('pays the day’s coins once and ticks today', async () => {
    await walletStore.load();
    const before = walletStore.snapshot().balance;
    const first = await checkIn(TODAY);
    const again = await checkIn(TODAY);
    expect(first).toMatchObject({ checkedInToday: true, awarded: 10 });
    expect(again.awarded).toBe(0);
    expect(walletStore.snapshot().balance).toBe(before + 10);
  });
});
