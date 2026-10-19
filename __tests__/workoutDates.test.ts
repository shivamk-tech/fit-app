import { calculateStreak, sessionDateKey } from '../src/services/workoutStorage';
import type { WorkoutSession } from '../src/types/workout';

function completed(at: Date, id = String(at.getTime())): WorkoutSession {
  return {
    id,
    workoutId: '1',
    workoutName: 'Test',
    startedAt: at.toISOString(),
    completedAt: at.toISOString(),
    status: 'completed',
    completedExercises: [],
    durationSeconds: 60,
  };
}

describe('sessionDateKey', () => {
  test('uses the local calendar day, not UTC', () => {
    // 01:30 local on the 20th; in zones ahead of UTC this is still the 19th in UTC.
    const at = new Date(2026, 9, 20, 1, 30);
    expect(sessionDateKey(completed(at))).toBe('2026-10-20');
  });

  test('ignores sessions that are not completed', () => {
    const s = { ...completed(new Date()), status: 'in_progress' as const };
    expect(sessionDateKey(s)).toBeNull();
  });
});

describe('calculateStreak', () => {
  test('counts consecutive local days ending today', () => {
    const today = new Date();
    today.setHours(1, 0, 0, 0); // just after midnight to stress the timezone edge
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);
    const sessions = [completed(twoDaysAgo), completed(yesterday), completed(today)];
    expect(calculateStreak(sessions)).toBe(3);
  });

  test('a gap breaks the streak', () => {
    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);
    expect(calculateStreak([completed(threeDaysAgo), completed(today)])).toBe(1);
  });
});
