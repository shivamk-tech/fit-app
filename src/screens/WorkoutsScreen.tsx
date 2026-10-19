import React from 'react';
import { Platform, ScrollView, Text, View } from 'react-native';
import { WorkoutCard } from '../components/WorkoutCard';
import type { WorkoutsScreenProps } from '../types/navigation';
import { DEMO_WORKOUTS } from '../utils/demoData';
import { screenStyles } from './screenStyles';

export function WorkoutsScreen({ navigation }: WorkoutsScreenProps) {
  return (
    <ScrollView
      removeClippedSubviews={Platform.OS === 'android'}
      contentContainerStyle={screenStyles.content}
    >
      <Text style={screenStyles.pageTitle}>Find your workout</Text>
      <Text style={screenStyles.pageSubtitle}>
        Choose a session that fits your day.
      </Text>
      <View style={screenStyles.workoutList}>
        {DEMO_WORKOUTS.map(workout => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            onPress={item =>
              navigation.navigate('WorkoutDetail', { workoutId: item.id })
            }
          />
        ))}
      </View>
    </ScrollView>
  );
}
