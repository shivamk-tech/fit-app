import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';
import type { WorkoutDetailScreenProps } from '../types/navigation';
import { DEMO_WORKOUTS } from '../utils/demoData';

export function WorkoutDetailScreen({ navigation, route }: WorkoutDetailScreenProps) {
  const workout = DEMO_WORKOUTS.find(w => w.id === route.params.workoutId);

  if (!workout) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Workout not found.</Text>
      </View>
    );
  }

  const startSession = () =>
    navigation.replace('WorkoutSession', {
      workoutId: workout.id,
      workoutName: workout.name,
    });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.eyebrow}>WORKOUT DETAILS</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        removeClippedSubviews={Platform.OS === 'android'}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.iconWrap, { backgroundColor: workout.tint }]}>
          <Text style={styles.icon}>{workout.icon}</Text>
        </View>
        <Text style={styles.title}>{workout.name}</Text>
        <Text style={styles.detail}>{workout.detail}</Text>

        <Text style={styles.sectionTitle}>Exercises</Text>

        {workout.exercises.map((ex, idx) => (
          <View key={ex.id} style={styles.exerciseCard}>
            <View style={styles.exerciseIndex}>
              <Text style={styles.exerciseIndexText}>{idx + 1}</Text>
            </View>
            <View style={styles.exerciseBody}>
              <Text style={styles.exerciseName}>{ex.name}</Text>
              <Text style={styles.exerciseMeta}>
                {ex.sets} sets · {ex.reps} reps
              </Text>
              <Text style={styles.exerciseInstructions}>{ex.instructions}</Text>
            </View>
          </View>
        ))}

        <View style={styles.bottomPad} />
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.startButton} onPress={startSession}>
          <Text style={styles.startButtonText}>Start Workout</Text>
        </Pressable>
      </View>
    </View>
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
    fontSize: 10,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
  },
  headerSpacer: { width: 42 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  icon: { fontSize: 40 },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  detail: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 6,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: FONTS.semibold,
    fontSize: 17,
    color: COLORS.text,
    marginBottom: 12,
  },
  exerciseCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  exerciseIndex: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  exerciseIndexText: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    fontSize: 13,
  },
  exerciseBody: { flex: 1 },
  exerciseName: {
    fontFamily: FONTS.semibold,
    fontSize: 14,
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
    marginTop: 6,
  },
  bottomPad: { height: 16 },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startButtonText: {
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
