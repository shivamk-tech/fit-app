import React, { useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';
import { settleStreakReward, streakRewardCoins } from '../services/streakRewards';
import type { StreakRewardStatus } from '../services/streakRewards';
import { loadSessions } from '../services/workoutStorage';
import type { WorkoutCompleteScreenProps } from '../types/navigation';
import type { WorkoutSession } from '../types/workout';

function formatDuration(seconds: number | null): string {
  if (!seconds) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export function WorkoutCompleteScreen({
  navigation,
  route,
}: WorkoutCompleteScreenProps) {
  const { sessionId } = route.params;
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [streak, setStreak] = useState<StreakRewardStatus | null>(null);

  useEffect(() => {
    loadSessions().then(async all => {
      const found = all.find(s => s.id === sessionId) ?? null;
      setSession(found);
      // Pay today's streak bonus (no-op if already paid).
      setStreak(await settleStreakReward(all));
    });
  }, [sessionId]);

  const goHome = () =>
    navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.body}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>🎉</Text>
        </View>
        <Text style={styles.title}>Workout complete!</Text>
        <Text style={styles.subtitle}>
          Great work. Every session counts.
        </Text>

        {session && (
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {session.completedExercises.length}
              </Text>
              <Text style={styles.statLabel}>Exercises</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {formatDuration(session.durationSeconds)}
              </Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
          </View>
        )}

        {streak && streak.dayIndex > 0 && (
          <View style={styles.bonus}>
            <Text style={styles.bonusTitle}>
              🔥 Day {streak.dayIndex} streak bonus
            </Text>
            <Text style={styles.bonusCoins}>
              {streak.awarded > 0
                ? `+${streak.awarded} coins`
                : `${streakRewardCoins(streak.dayIndex)} coins already earned today`}
            </Text>
            <Text style={styles.noticeText}>
              Keep your streak going tomorrow to earn even more.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.homeButton} onPress={goHome}>
          <Text style={styles.homeButtonText}>Back to Home</Text>
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
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  icon: { fontSize: 52 },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 30,
    color: COLORS.text,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.text,
  },
  statLabel: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  bonus: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  bonusTitle: {
    fontFamily: FONTS.semibold,
    fontSize: 13,
    color: COLORS.text,
  },
  bonusCoins: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.primary,
    marginTop: 6,
    marginBottom: 6,
  },
  noticeText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  homeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  homeButtonText: {
    fontFamily: FONTS.semibold,
    color: COLORS.background,
    fontSize: 15,
  },
});
