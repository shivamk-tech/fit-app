import type { StreakDay, Workout } from '../types/workout';

// Static UI-preview data only; not connected to a backend.
export const WEEKLY_STREAK_DAYS: StreakDay[] = [
  { day: 'M', date: '12', done: true },
  { day: 'T', date: '13', done: true },
  { day: 'W', date: '14', done: true },
  { day: 'T', date: '15', done: false },
  { day: 'F', date: '16', done: false },
  { day: 'S', date: '17', done: false },
  { day: 'S', date: '18', done: false },
];

export const DEMO_WORKOUTS: Workout[] = [
  {
    id: '1',
    name: 'Full Body Workout',
    detail: '5 exercises · ~20 min',
    icon: '🏋️',
    tint: '#E3EEF6',
    exercises: [
      {
        id: '1-1',
        name: 'Bodyweight Squat',
        sets: 3,
        reps: 15,
        instructions:
          'Stand with feet shoulder-width apart. Lower until thighs are parallel to the floor, keeping chest up. Drive through heels to stand.',
      },
      {
        id: '1-2',
        name: 'Push-Up',
        sets: 3,
        reps: 12,
        instructions:
          'Start in a high plank. Lower your chest to the floor keeping elbows at 45°. Press back up to full arm extension.',
      },
      {
        id: '1-3',
        name: 'Reverse Lunge',
        sets: 3,
        reps: 10,
        instructions:
          'Step one foot back and lower your back knee toward the floor. Keep front shin vertical. Return to standing and alternate legs.',
      },
      {
        id: '1-4',
        name: 'Plank Hold',
        sets: 3,
        reps: 30,
        instructions:
          'Forearms on the floor, body in a straight line from head to heels. Brace your core and hold. Reps = seconds.',
      },
      {
        id: '1-5',
        name: 'Glute Bridge',
        sets: 3,
        reps: 15,
        instructions:
          'Lie on your back, knees bent, feet flat. Drive hips up until body forms a straight line from knees to shoulders. Squeeze glutes at the top.',
      },
    ],
  },
  {
    id: '2',
    name: 'Upper Body Strength',
    detail: '4 exercises · ~15 min',
    icon: '💪',
    tint: '#EAF1FF',
    exercises: [
      {
        id: '2-1',
        name: 'Wide Push-Up',
        sets: 3,
        reps: 12,
        instructions:
          'Hands wider than shoulder-width. Lower chest to floor, elbows flare out to ~60°. Press back up.',
      },
      {
        id: '2-2',
        name: 'Diamond Push-Up',
        sets: 3,
        reps: 8,
        instructions:
          'Form a diamond shape with thumbs and index fingers. Lower chest toward hands, keeping elbows close to body.',
      },
      {
        id: '2-3',
        name: 'Pike Push-Up',
        sets: 3,
        reps: 10,
        instructions:
          'Start in a downward-dog position. Bend elbows to lower the top of your head toward the floor, then press back up.',
      },
      {
        id: '2-4',
        name: 'Superman Hold',
        sets: 3,
        reps: 12,
        instructions:
          'Lie face down, arms extended overhead. Lift arms, chest, and legs off the floor simultaneously. Hold 2 seconds, lower.',
      },
    ],
  },
  {
    id: '3',
    name: 'Core & Abs',
    detail: '4 exercises · ~10 min',
    icon: '⚡',
    tint: '#E8F7EE',
    exercises: [
      {
        id: '3-1',
        name: 'Crunch',
        sets: 3,
        reps: 20,
        instructions:
          'Lie on your back, knees bent. Place hands behind head. Curl shoulders off the floor, exhale at the top, lower slowly.',
      },
      {
        id: '3-2',
        name: 'Bicycle Crunch',
        sets: 3,
        reps: 16,
        instructions:
          'Alternate bringing opposite elbow to knee while extending the other leg. Keep lower back pressed to the floor.',
      },
      {
        id: '3-3',
        name: 'Leg Raise',
        sets: 3,
        reps: 12,
        instructions:
          'Lie flat, hands under hips. Raise straight legs to 90°, lower slowly without letting heels touch the floor.',
      },
      {
        id: '3-4',
        name: 'Dead Bug',
        sets: 3,
        reps: 10,
        instructions:
          'Lie on back, arms up, knees at 90°. Slowly lower opposite arm and leg toward the floor while keeping lower back flat. Return and alternate.',
      },
    ],
  },
];
