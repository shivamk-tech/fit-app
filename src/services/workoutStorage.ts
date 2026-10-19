import AsyncStorage from '@react-native-async-storage/async-storage';
import type { WorkoutSession } from '../types/workout';
import { localDateKey } from './stepMath';

const SESSIONS_KEY = '@fitrewards/workout_sessions';

export async function loadSessions(): Promise<WorkoutSession[]> {
  try {
    const raw = await AsyncStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WorkoutSession[];
  } catch {
    return [];
  }
}

export async function saveSession(session: WorkoutSession): Promise<void> {
  const sessions = await loadSessions();
  const idx = sessions.findIndex(s => s.id === session.id);
  if (idx >= 0) {
    sessions[idx] = session;
  } else {
    sessions.push(session);
  }
  await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export async function getCompletedSessions(): Promise<WorkoutSession[]> {
  const sessions = await loadSessions();
  return sessions.filter(s => s.status === 'completed');
}

/** Local calendar date (YYYY-MM-DD) a session was completed on, or null. */
export function sessionDateKey(session: WorkoutSession): string | null {
  if (session.status !== 'completed' || !session.completedAt) return null;
  return localDateKey(new Date(session.completedAt));
}

/** Returns unique local workout dates (YYYY-MM-DD) for streak calculation */
export function getWorkoutDates(sessions: WorkoutSession[]): string[] {
  const dates = sessions
    .map(sessionDateKey)
    .filter((d): d is string => d !== null);
  return [...new Set(dates)].sort();
}

/** Calculates current consecutive-day streak ending today or yesterday */
export function calculateStreak(sessions: WorkoutSession[]): number {
  const dates = getWorkoutDates(sessions);
  if (dates.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let cursor = new Date(today);

  // Allow streak to include yesterday if nothing done today yet
  const lastDate = new Date(dates[dates.length - 1] + 'T00:00:00');
  const diffDays = Math.round((today.getTime() - lastDate.getTime()) / 86400000);
  if (diffDays > 1) return 0;
  if (diffDays === 1) cursor = lastDate;

  for (let i = dates.length - 1; i >= 0; i--) {
    const d = new Date(dates[i] + 'T00:00:00');
    const diff = Math.round((cursor.getTime() - d.getTime()) / 86400000);
    if (diff === 0) {
      streak++;
      cursor = new Date(d);
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
