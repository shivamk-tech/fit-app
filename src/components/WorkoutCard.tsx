import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../theme/colors';
import { CARD, RADII } from '../theme/layout';
import { FONTS } from '../theme/typography';
import type { Workout } from '../types/workout';
import { PressableScale } from './ui/PressableScale';

export interface WorkoutCardProps {
  workout: Workout;
  onPress: (workout: Workout) => void;
}

export function WorkoutCard({ workout, onPress }: WorkoutCardProps) {
  return (
    <PressableScale
      style={styles.workoutCard}
      onPress={() => onPress(workout)}
      accessibilityRole="button"
      accessibilityLabel={`${workout.name}, ${workout.detail}`}
    >
      <View style={[styles.workoutIcon, { backgroundColor: workout.tint }]}>
        <Text style={styles.workoutEmoji}>{workout.icon}</Text>
      </View>
      <View style={styles.workoutInfo}>
        <Text style={styles.workoutName} numberOfLines={1}>
          {workout.name}
        </Text>
        <Text style={styles.workoutDetail}>{workout.detail}</Text>
      </View>
      <View style={styles.workoutArrow}>
        <Text style={styles.arrowText}>›</Text>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  workoutCard: {
    ...CARD,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 12,
  },
  workoutIcon: {
    width: 56,
    height: 56,
    borderRadius: RADII.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutEmoji: {
    fontSize: 28,
  },
  workoutInfo: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  workoutName: {
    fontFamily: FONTS.semibold,
    color: COLORS.text,
    fontSize: 15,
  },
  workoutDetail: {
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  workoutArrow: {
    width: 32,
    height: 32,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    color: COLORS.primary,
    fontSize: 22,
    lineHeight: 24,
    marginLeft: 2,
  },
});
