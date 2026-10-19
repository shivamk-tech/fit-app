import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';
import type { Workout } from '../types/workout';

export interface WorkoutCardProps {
  workout: Workout;
  onPress: (workout: Workout) => void;
}

export function WorkoutCard({ workout, onPress }: WorkoutCardProps) {
  return (
    <Pressable style={styles.workoutCard} onPress={() => onPress(workout)}>
      <View style={[styles.workoutIcon, { backgroundColor: workout.tint }]}>
        <Text style={styles.workoutEmoji}>{workout.icon}</Text>
      </View>
      <View style={styles.workoutInfo}>
        <Text style={styles.workoutName}>{workout.name}</Text>
        <Text style={styles.workoutDetail}>{workout.detail}</Text>
      </View>
      <View style={styles.workoutArrow}>
        <Text style={styles.arrowText}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  workoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  workoutIcon: {
    width: 54,
    height: 54,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutEmoji: {
    fontSize: 27,
  },
  workoutInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 5,
  },
  workoutName: {
    fontFamily: FONTS.semibold,
    color: COLORS.text,
    fontSize: 12,
  },
  workoutDetail: {
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 5,
    lineHeight: 15,
  },
  workoutArrow: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    color: COLORS.primary,
    fontSize: 23,
  },
});
