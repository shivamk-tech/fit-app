import React from 'react';
import { Platform, ScrollView, Text, View } from 'react-native';
import { WorkoutCard } from '../components/WorkoutCard';
import { FadeIn } from '../components/ui/FadeIn';
import type { WorkoutsScreenProps } from '../types/navigation';
import { DEMO_WORKOUTS } from '../utils/demoData';
import { screenStyles } from './screenStyles';

export function WorkoutsScreen({ navigation }: WorkoutsScreenProps) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={Platform.OS === 'android'}
      contentContainerStyle={screenStyles.content}
    >
      <FadeIn>
        <Text style={screenStyles.pageTitle}>Find your workout</Text>
        <Text style={screenStyles.pageSubtitle}>
          Choose a session that fits your day.
        </Text>
      </FadeIn>
      <View style={screenStyles.workoutList}>
        {DEMO_WORKOUTS.map((workout, i) => (
          <FadeIn key={workout.id} delay={60 + i * 60}>
            <WorkoutCard
              workout={workout}
              onPress={item =>
                navigation.navigate('WorkoutDetail', { workoutId: item.id })
              }
            />
          </FadeIn>
        ))}
      </View>
    </ScrollView>
  );
}
