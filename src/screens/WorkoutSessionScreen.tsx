import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  BackHandler,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PressableScale } from '../components/ui/PressableScale';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { COLORS } from '../theme/colors';
import { CARD, RADII, SHADOWS } from '../theme/layout';
import { FONTS } from '../theme/typography';
import { saveSession } from '../services/workoutStorage';
import type { WorkoutSessionScreenProps } from '../types/navigation';
import type {
  Exercise,
  ExerciseCompletion,
  WorkoutSession,
} from '../types/workout';
import { DEMO_WORKOUTS } from '../utils/demoData';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Live mm:ss since the session started. Isolated so ticks don't re-render the list. */
function ElapsedTimer({ startedAt }: { startedAt: number }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const total = Math.max(0, Math.floor((now - startedAt) / 1000));
  const mm = String(Math.floor(total / 60)).padStart(2, '0');
  const ss = String(total % 60).padStart(2, '0');
  return (
    <Text style={styles.timerValue}>
      {mm}:{ss}
    </Text>
  );
}

function ExerciseRow({
  exercise,
  index,
  done,
  onToggle,
}: {
  exercise: Exercise;
  index: number;
  done: boolean;
  onToggle: (id: string) => void;
}) {
  const check = useRef(new Animated.Value(done ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(check, {
      toValue: done ? 1 : 0,
      useNativeDriver: true,
      speed: 20,
      bounciness: 12,
    }).start();
  }, [done, check]);

  return (
    <PressableScale
      style={[styles.exerciseCard, done && styles.exerciseCardDone]}
      onPress={() => onToggle(exercise.id)}
      scaleTo={0.98}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      accessibilityLabel={exercise.name}
    >
      <View style={[styles.checkbox, done && styles.checkboxDone]}>
        <Animated.Text
          style={[
            styles.checkmark,
            { opacity: check, transform: [{ scale: check }] },
          ]}
        >
          ✓
        </Animated.Text>
      </View>
      <View style={styles.exerciseBody}>
        <Text style={styles.exerciseNum}>EXERCISE {index + 1}</Text>
        <Text style={[styles.exerciseName, done && styles.textDone]}>
          {exercise.name}
        </Text>
        <Text style={[styles.exerciseMeta, done && styles.exerciseMetaDone]}>
          {exercise.sets} sets × {exercise.reps} reps
        </Text>
        {!done && (
          <Text style={styles.exerciseInstructions}>
            {exercise.instructions}
          </Text>
        )}
      </View>
    </PressableScale>
  );
}

export function WorkoutSessionScreen({
  navigation,
  route,
}: WorkoutSessionScreenProps) {
  const { workoutId, workoutName } = route.params;
  const workout = DEMO_WORKOUTS.find(w => w.id === workoutId);

  const sessionIdRef = useRef<string>(generateId());
  const startedAtRef = useRef<string>(new Date().toISOString());
  const startTimeRef = useRef<number>(Date.now());

  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  // Guard hardware back button on Android
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      confirmCancel();
      return true;
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmCancel = useCallback(() => {
    Alert.alert('Cancel workout?', 'Your progress will not be saved.', [
      { text: 'Keep going', style: 'cancel' },
      {
        text: 'Cancel workout',
        style: 'destructive',
        onPress: async () => {
          if (!workout) {
            navigation.goBack();
            return;
          }
          const session: WorkoutSession = {
            id: sessionIdRef.current,
            workoutId,
            workoutName,
            startedAt: startedAtRef.current,
            completedAt: null,
            status: 'cancelled',
            completedExercises: [],
            durationSeconds: null,
          };
          await saveSession(session);
          navigation.goBack();
        },
      },
    ]);
  }, [navigation, workout, workoutId, workoutName]);

  const toggleExercise = useCallback((exerciseId: string) => {
    setCompletedIds(prev => {
      const next = new Set(prev);
      if (next.has(exerciseId)) {
        next.delete(exerciseId);
      } else {
        next.add(exerciseId);
      }
      return next;
    });
  }, []);

  const finishWorkout = useCallback(async () => {
    if (!workout) return;
    if (saving) return; // prevent double-tap

    const allDone = workout.exercises.every(ex => completedIds.has(ex.id));
    if (!allDone) {
      Alert.alert(
        'Not all exercises done',
        'Mark all exercises as complete before finishing.',
      );
      return;
    }

    setSaving(true);
    const now = new Date().toISOString();
    const durationSeconds = Math.round(
      (Date.now() - startTimeRef.current) / 1000,
    );

    const completedExercises: ExerciseCompletion[] = workout.exercises.map(
      ex => ({
        exerciseId: ex.id,
        completedAt: now,
      }),
    );

    const session: WorkoutSession = {
      id: sessionIdRef.current,
      workoutId,
      workoutName,
      startedAt: startedAtRef.current,
      completedAt: now,
      status: 'completed',
      completedExercises,
      durationSeconds,
    };

    await saveSession(session);
    navigation.replace('WorkoutComplete', { sessionId: session.id });
  }, [workout, saving, completedIds, workoutId, workoutName, navigation]);

  if (!workout) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title={workoutName} onBack={() => navigation.goBack()} />
        <Text style={styles.errorText}>Workout not found.</Text>
      </SafeAreaView>
    );
  }

  const totalCount = workout.exercises.length;
  const doneCount = completedIds.size;
  const remaining = totalCount - doneCount;
  const progressPct = totalCount > 0 ? doneCount / totalCount : 0;
  const allDone = remaining === 0;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScreenHeader
        title={workoutName}
        onBack={confirmCancel}
        backLabel="Cancel workout"
      />

      {/* Progress summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryLabel}>Progress</Text>
            <Text style={styles.summaryValue}>
              {doneCount}
              <Text style={styles.summaryOf}> / {totalCount} done</Text>
            </Text>
          </View>
          <View style={styles.timerPill}>
            <View style={styles.liveDot} />
            <ElapsedTimer startedAt={startTimeRef.current} />
          </View>
        </View>
        <ProgressBar
          progress={progressPct}
          height={8}
          style={styles.progress}
        />
      </View>

      {/* Exercise list */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {workout.exercises.map((ex, idx) => (
          <ExerciseRow
            key={ex.id}
            exercise={ex}
            index={idx}
            done={completedIds.has(ex.id)}
            onToggle={toggleExercise}
          />
        ))}
      </ScrollView>

      {/* Footer */}
      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <PressableScale
          style={[styles.finishButton, !allDone && styles.finishButtonDisabled]}
          onPress={finishWorkout}
          disabled={saving}
          accessibilityRole="button"
          accessibilityState={{ disabled: !allDone || saving }}
        >
          <Text
            style={[
              styles.finishButtonText,
              !allDone && styles.finishButtonTextDisabled,
            ]}
          >
            {saving
              ? 'Saving…'
              : allDone
              ? 'Finish Workout  🎉'
              : `${remaining} ${
                  remaining === 1 ? 'exercise' : 'exercises'
                } left`}
          </Text>
        </PressableScale>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  summaryCard: {
    ...CARD,
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.text,
    letterSpacing: -0.4,
    marginTop: 1,
  },
  summaryOf: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textMuted,
    letterSpacing: 0,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.primarySoft,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.error,
  },
  timerValue: {
    fontFamily: FONTS.semibold,
    fontSize: 14,
    color: COLORS.primary,
    fontVariant: ['tabular-nums'],
  },
  progress: {
    marginTop: 14,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  exerciseCard: {
    ...CARD,
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  exerciseCardDone: {
    borderColor: COLORS.primaryLight,
    backgroundColor: COLORS.primarySoft,
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: RADII.pill,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    backgroundColor: COLORS.surfaceWhite,
  },
  checkboxDone: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.textOnPrimary,
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
  exerciseBody: { flex: 1 },
  exerciseNum: {
    fontFamily: FONTS.semibold,
    fontSize: 10,
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  exerciseName: {
    fontFamily: FONTS.semibold,
    fontSize: 16,
    color: COLORS.text,
  },
  exerciseMeta: {
    fontFamily: FONTS.semibold,
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 4,
  },
  exerciseMetaDone: {
    color: COLORS.textMuted,
  },
  exerciseInstructions: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginTop: 8,
  },
  textDone: {
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: COLORS.surfaceWhite,
    borderTopLeftRadius: RADII.xl,
    borderTopRightRadius: RADII.xl,
    ...SHADOWS.raised,
  },
  finishButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADII.md + 2,
    paddingVertical: 16,
    alignItems: 'center',
  },
  finishButtonDisabled: {
    backgroundColor: COLORS.surface,
  },
  finishButtonText: {
    fontFamily: FONTS.bold,
    color: COLORS.textOnPrimary,
    fontSize: 16,
  },
  finishButtonTextDisabled: {
    color: COLORS.textSecondary,
  },
  errorText: {
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
});
