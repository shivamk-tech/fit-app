export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  instructions: string;
}

export interface Workout {
  id: string;
  name: string;
  detail: string;
  icon: string;
  tint: string;
  exercises: Exercise[];
}

export interface StreakDay {
  day: string;
  date: string;
  done: boolean;
}

export type SessionStatus = 'in_progress' | 'completed' | 'cancelled';

export interface ExerciseCompletion {
  exerciseId: string;
  completedAt: string; // ISO timestamp
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  workoutName: string;
  startedAt: string;   // ISO timestamp
  completedAt: string | null;
  status: SessionStatus;
  completedExercises: ExerciseCompletion[];
  durationSeconds: number | null;
}
