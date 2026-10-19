import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  BackHandler,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';
import { saveSession } from '../services/workoutStorage';
import type { WorkoutSessionScreenProps } from '../types/navigation';
import type { ExerciseCompletion, WorkoutSession } from '../types/workout';
import { DEMO_WORKOUTS } from '../utils/demoData';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
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
    Alert.alert(
      'Cancel workout?',
      'Your progress will not be saved.',
      [
        { text: 'Keep going', style: 'cancel' },
        {
          text: 'Cancel workout',
          style: 'destructive',
          onPress: async () => {
            if (!workout) { navigation.goBack(); return; }
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
      ],
    );
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
    const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);

    const completedExercises: ExerciseCompletion[] = workout.exercises.map(ex => ({
      exerciseId: ex.id,
      completedAt: now,
    }));

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
        <Text style={styles.errorText}>Workout not found.</Text>
      </SafeAreaView>
    );
  }

  const totalCount = workout.exercises.length;
  const doneCount = completedIds.size;
  const progressPct = totalCount > 0 ? doneCount / totalCount : 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={confirmCancel} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.eyebrow} numberOfLines={1}>{workoutName}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { flex: progressPct }]} />
        <View style={{ flex: 1 - progressPct }} />
      </View>
      <Text style={styles.progressLabel}>
        {doneCount} / {totalCount} exercises
      </Text>

      {/* Exercise list */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {workout.exercises.map((ex, idx) => {
          const done = completedIds.has(ex.id);
          return (
            <Pressable
              key={ex.id}
              style={[styles.exerciseCard, done && styles.exerciseCardDone]}
              onPress={() => toggleExercise(ex.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: done }}
            >
              <View style={[styles.checkbox, done && styles.checkboxDone]}>
                {done && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.exerciseBody}>
                <Text style={[styles.exerciseNum, done && styles.textDone]}>
                  Exercise {idx + 1}
                </Text>
                <Text style={[styles.exerciseName, done && styles.textDone]}>
                  {ex.name}
                </Text>
                <Text style={styles.exerciseMeta}>
                  {ex.sets} sets · {ex.reps} reps
                </Text>
                {!done && (
                  <Text style={styles.exerciseInstructions}>
                    {ex.instructions}
                  </Text>
                )}
              </View>
            </Pressable>
          );
        })}
        <View style={styles.bottomPad} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable
          style={[
            styles.finishButton,
            doneCount < totalCount && styles.finishButtonDisabled,
          ]}
          onPress={finishWorkout}
          disabled={saving}
        >
          <Text style={styles.finishButtonText}>
            {saving ? 'Saving…' : 'Finish Workout'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: COLORS.text,
    fontSize: 29,
    lineHeight: 32,
  },
  eyebrow: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontFamily: FONTS.bold,
    letterSpacing: 0.5,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: { width: 42 },
  progressTrack: {
    flexDirection: 'row',
    height: 4,
    marginHorizontal: 20,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  progressLabel: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginHorizontal: 20,
    marginTop: 6,
    marginBottom: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  exerciseCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  exerciseCardDone: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    marginTop: 2,
    backgroundColor: COLORS.background,
  },
  checkboxDone: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.background,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  exerciseBody: { flex: 1 },
  exerciseNum: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  exerciseName: {
    fontFamily: FONTS.semibold,
    fontSize: 15,
    color: COLORS.text,
  },
  exerciseMeta: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.primary,
    marginTop: 3,
  },
  exerciseInstructions: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 17,
    marginTop: 8,
  },
  textDone: {
    color: COLORS.textSecondary,
  },
  bottomPad: { height: 16 },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  finishButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  finishButtonDisabled: {
    backgroundColor: COLORS.surface,
  },
  finishButtonText: {
    fontFamily: FONTS.semibold,
    color: COLORS.background,
    fontSize: 15,
  },
  errorText: {
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
});
