import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FadeIn } from '../components/ui/FadeIn';
import { PressableScale } from '../components/ui/PressableScale';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { COLORS } from '../theme/colors';
import { CARD, RADII, SHADOWS } from '../theme/layout';
import { FONTS } from '../theme/typography';
import type { WorkoutDetailScreenProps } from '../types/navigation';
import { DEMO_WORKOUTS } from '../utils/demoData';

export function WorkoutDetailScreen({
  navigation,
  route,
}: WorkoutDetailScreenProps) {
  const workout = DEMO_WORKOUTS.find(w => w.id === route.params.workoutId);

  if (!workout) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <ScreenHeader
          title="Workout details"
          onBack={() => navigation.goBack()}
        />
        <Text style={styles.errorText}>Workout not found.</Text>
      </SafeAreaView>
    );
  }

  const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const estimate = workout.detail.split('·')[1]?.trim() ?? '—';

  const startSession = () =>
    navigation.replace('WorkoutSession', {
      workoutId: workout.id,
      workoutName: workout.name,
    });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScreenHeader
        title="Workout details"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        removeClippedSubviews={Platform.OS === 'android'}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <FadeIn>
          <View style={[styles.iconWrap, { backgroundColor: workout.tint }]}>
            <Text style={styles.icon}>{workout.icon}</Text>
          </View>
          <Text style={styles.title}>{workout.name}</Text>

          <View style={styles.statsRow}>
            <Stat value={String(workout.exercises.length)} label="Exercises" />
            <Stat value={String(totalSets)} label="Total sets" />
            <Stat value={estimate.replace('~', '')} label="Duration" />
          </View>
        </FadeIn>

        <FadeIn delay={80}>
          <Text style={styles.sectionTitle}>Exercises</Text>
        </FadeIn>

        {workout.exercises.map((ex, idx) => (
          <FadeIn key={ex.id} delay={120 + idx * 50}>
            <View style={styles.exerciseCard}>
              <View style={styles.exerciseIndex}>
                <Text style={styles.exerciseIndexText}>{idx + 1}</Text>
              </View>
              <View style={styles.exerciseBody}>
                <Text style={styles.exerciseName}>{ex.name}</Text>
                <View style={styles.metaPill}>
                  <Text style={styles.exerciseMeta}>
                    {ex.sets} sets × {ex.reps} reps
                  </Text>
                </View>
                <Text style={styles.exerciseInstructions}>
                  {ex.instructions}
                </Text>
              </View>
            </View>
          </FadeIn>
        ))}
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <PressableScale
          style={styles.startButton}
          onPress={startSession}
          accessibilityRole="button"
        >
          <Text style={styles.startButtonText}>Start Workout</Text>
          <Text style={styles.startButtonArrow}>→</Text>
        </PressableScale>
      </SafeAreaView>
    </SafeAreaView>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  iconWrap: {
    width: 76,
    height: 76,
    borderRadius: RADII.lg + 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  icon: { fontSize: 38 },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    lineHeight: 34,
    color: COLORS.text,
    letterSpacing: -0.6,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
    marginBottom: 28,
  },
  stat: {
    ...CARD,
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.text,
  },
  statLabel: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.text,
    letterSpacing: -0.2,
    marginBottom: 12,
  },
  exerciseCard: {
    ...CARD,
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
  },
  exerciseIndex: {
    width: 34,
    height: 34,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  exerciseIndexText: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    fontSize: 14,
  },
  exerciseBody: { flex: 1 },
  exerciseName: {
    fontFamily: FONTS.semibold,
    fontSize: 15,
    color: COLORS.text,
    marginTop: 1,
  },
  metaPill: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primarySoft,
    borderRadius: RADII.pill,
    paddingHorizontal: 9,
    paddingVertical: 3,
    marginTop: 6,
  },
  exerciseMeta: {
    fontFamily: FONTS.semibold,
    fontSize: 11,
    color: COLORS.primary,
  },
  exerciseInstructions: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginTop: 8,
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
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: RADII.md + 2,
    paddingVertical: 16,
  },
  startButtonText: {
    fontFamily: FONTS.bold,
    color: COLORS.textOnPrimary,
    fontSize: 16,
  },
  startButtonArrow: {
    fontFamily: FONTS.bold,
    color: COLORS.textOnPrimary,
    fontSize: 18,
  },
  errorText: {
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
});
