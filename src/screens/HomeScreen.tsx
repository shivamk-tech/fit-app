import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ProfileHeader } from '../components/ProfileHeader';
import { WeeklyStreak } from '../components/WeeklyStreak';
import { WorkoutCard } from '../components/WorkoutCard';
import {
  calculateStreak,
  getCompletedSessions,
} from '../services/workoutStorage';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';
import type { HomeScreenProps } from '../types/navigation';
import type { WorkoutSession } from '../types/workout';
import { DEMO_WORKOUTS } from '../utils/demoData';

function buildStreakDays(completedSessions: WorkoutSession[]) {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const dayLabel = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()];
    const done = completedSessions.some(
      s => s.completedAt?.slice(0, 10) === dateStr,
    );
    return { day: dayLabel, date: String(d.getDate()), done };
  });
}

export function HomeScreen({ navigation }: HomeScreenProps) {
  const [completedSessions, setCompletedSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    const sessions = await getCompletedSessions();
    setCompletedSessions(sessions);
    setLoading(false);
  }, []);

  // Reload every time the tab comes into focus (e.g. after finishing a workout)
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadHistory();
    }, [loadHistory]),
  );

  const openWorkoutDetail = (workoutId: string) =>
    navigation.navigate('WorkoutDetail', { workoutId });

  const startFirstWorkout = () =>
    navigation.navigate('WorkoutDetail', { workoutId: DEMO_WORKOUTS[0].id });

  const streakCount = calculateStreak(completedSessions);
  const streakDays = buildStreakDays(completedSessions);
  const isFirstTimeUser = !loading && completedSessions.length === 0;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={Platform.OS === 'android'}
      contentContainerStyle={styles.scrollContent}
    >
      <ProfileHeader
        greeting="GOOD MORNING ☀️"
        userName="Hey, Shivam!"
        avatarInitial="S"
        onNotificationsPress={() => {}}
      />

      {/* Start Workout — always prominent at top */}
      <Pressable style={styles.startButton} onPress={startFirstWorkout}>
        <Text style={styles.startButtonText}>Start Workout</Text>
        <Text style={styles.startButtonArrow}>→</Text>
      </Pressable>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={COLORS.primary} />
        </View>
      ) : isFirstTimeUser ? (
        /* ── First-time empty state ── */
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🏁</Text>
          <Text style={styles.emptyTitle}>Ready to get moving?</Text>
          <Text style={styles.emptySubtitle}>
            Your fitness journey starts with one workout.
          </Text>
        </View>
      ) : (
        /* ── Returning user — real progress ── */
        <>
          <WeeklyStreak
            days={streakDays}
            streakLabel={`${streakCount} ${streakCount === 1 ? 'DAY' : 'DAYS'}`}
            footer={
              streakCount > 0
                ? `${streakCount}-day streak — keep it up!`
                : 'Complete a workout to start your streak.'
            }
          />

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Pick up where you left off</Text>
              <Text style={styles.sectionSubtitle}>Your next step starts here</Text>
            </View>
            <Pressable onPress={() => navigation.navigate('Workouts')}>
              <Text style={styles.seeAll}>See all →</Text>
            </Pressable>
          </View>

          {DEMO_WORKOUTS.slice(0, 2).map(workout => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onPress={item => openWorkoutDetail(item.id)}
            />
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingVertical: 18,
    marginBottom: 20,
  },
  startButtonText: {
    fontFamily: FONTS.bold,
    color: COLORS.background,
    fontSize: 17,
  },
  startButtonArrow: {
    color: COLORS.background,
    fontSize: 20,
    fontFamily: FONTS.bold,
  },
  loadingWrap: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  emptyIcon: {
    fontSize: 52,
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 13,
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: FONTS.semibold,
    fontSize: 17,
    color: COLORS.text,
  },
  sectionSubtitle: {
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 4,
  },
  seeAll: {
    color: COLORS.primary,
    fontSize: 11,
    fontFamily: FONTS.bold,
  },
});
