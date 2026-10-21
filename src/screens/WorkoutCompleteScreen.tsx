import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FadeIn } from '../components/ui/FadeIn';
import { PressableScale } from '../components/ui/PressableScale';
import { COLORS } from '../theme/colors';
import { CARD, RADII, SHADOWS } from '../theme/layout';
import { FONTS } from '../theme/typography';
import { ClaimRewardButton } from '../components/ClaimRewardButton';
import { FitCoin, FITCOINS } from '../components/FitCoin';
import { checkIn, getCheckInStatus } from '../services/streakRewards';
import type { CheckInStatus } from '../services/streakRewards';
import { loadSessions } from '../services/workoutStorage';
import type { WorkoutCompleteScreenProps } from '../types/navigation';
import type { WorkoutSession } from '../types/workout';

function formatDuration(seconds: number | null): string {
  if (!seconds) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

/** Counts from 0 up to `value` once it is known. */
function CountUp({ value, style }: { value: number; style: object }) {
  const anim = useRef(new Animated.Value(0)).current;
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const id = anim.addListener(({ value: v }) => setShown(Math.round(v)));
    Animated.timing(anim, {
      toValue: value,
      duration: 900,
      delay: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    return () => anim.removeListener(id);
  }, [anim, value]);

  return (
    <View style={coinRow.row}>
      <FitCoin size={30} />
      <Text style={style}>
        +{shown} {FITCOINS}
      </Text>
    </View>
  );
}

export function WorkoutCompleteScreen({
  navigation,
  route,
}: WorkoutCompleteScreenProps) {
  const { sessionId } = route.params;
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [streak, setStreak] = useState<CheckInStatus | null>(null);

  const pop = useRef(new Animated.Value(0)).current;
  const ring = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadSessions().then(async all => {
      const found = all.find(s => s.id === sessionId) ?? null;
      setSession(found);
      // Offer today's daily check-in here too if it hasn't been done yet.
      setStreak(await getCheckInStatus());
    });
  }, [sessionId]);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(pop, {
        toValue: 1,
        useNativeDriver: true,
        speed: 8,
        bounciness: 14,
      }),
      Animated.timing(ring, {
        toValue: 1,
        duration: 1100,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [pop, ring]);

  const goHome = () =>
    navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });

  const ringScale = ring.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.7],
  });
  const ringOpacity = ring.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>
        <View style={styles.iconStage}>
          <Animated.View
            style={[
              styles.ring,
              { opacity: ringOpacity, transform: [{ scale: ringScale }] },
            ]}
          />
          <Animated.View
            style={[styles.iconWrap, { transform: [{ scale: pop }] }]}
          >
            <Text style={styles.icon}>🎉</Text>
          </Animated.View>
        </View>

        <FadeIn delay={150}>
          <Text style={styles.title}>Workout complete!</Text>
          <Text style={styles.subtitle}>Great work. Every session counts.</Text>
        </FadeIn>

        {session && (
          <FadeIn delay={250} style={styles.statsRow}>
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
          </FadeIn>
        )}

        {streak && streak.dayIndex > 0 && (
          <FadeIn delay={350} style={styles.bonus}>
            <View style={styles.bonusBadge}>
              <Text style={styles.bonusTitle}>
                🔥 Day {streak.dayIndex} daily check-in
              </Text>
            </View>
            {streak.awarded > 0 ? (
              <CountUp value={streak.awarded} style={styles.bonusCoins} />
            ) : !streak.checkedInToday ? (
              <View style={coinRow.row}>
                <FitCoin size={30} />
                <Text style={styles.bonusCoins}>
                  {streak.coins} {FITCOINS}
                </Text>
              </View>
            ) : (
              <Text style={styles.bonusCoinsMuted}>
                Checked in today · {streak.coins} {FITCOINS}
              </Text>
            )}
            {!streak.checkedInToday && (
              <View style={styles.claim}>
                <ClaimRewardButton
                  coins={streak.coins}
                  action="Check in"
                  onClaim={async () => setStreak(await checkIn())}
                />
              </View>
            )}
            <Text style={[styles.noticeText, styles.noticeSpacing]}>
              {streak.checkedInToday
                ? 'Check in again tomorrow to keep your streak going.'
                : 'Check in every day. Miss one and the streak restarts.'}
            </Text>
          </FadeIn>
        )}
      </View>

      <View style={styles.footer}>
        <PressableScale
          style={styles.homeButton}
          onPress={goHome}
          accessibilityRole="button"
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </PressableScale>
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
    paddingHorizontal: 24,
  },
  iconStage: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  ring: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  iconWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: COLORS.surfaceWhite,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.raised,
  },
  icon: { fontSize: 54 },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 30,
    color: COLORS.text,
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
    alignSelf: 'stretch',
  },
  statCard: {
    ...CARD,
    flex: 1,
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
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  bonus: {
    ...CARD,
    marginTop: 12,
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: COLORS.goldLight,
  },
  bonusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.surfaceWhite,
  },
  bonusTitle: {
    fontFamily: FONTS.semibold,
    fontSize: 12,
    color: COLORS.text,
  },
  bonusCoins: {
    fontFamily: FONTS.bold,
    fontSize: 32,
    color: COLORS.gold,
    letterSpacing: -0.5,
    marginTop: 10,
    marginBottom: 6,
  },
  bonusCoinsMuted: {
    fontFamily: FONTS.semibold,
    fontSize: 15,
    color: COLORS.text,
    marginTop: 10,
    marginBottom: 6,
  },
  claim: {
    alignSelf: 'stretch',
  },
  noticeSpacing: {
    marginTop: 10,
  },
  noticeText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  homeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADII.md + 2,
    paddingVertical: 16,
    alignItems: 'center',
    ...SHADOWS.raised,
  },
  homeButtonText: {
    fontFamily: FONTS.bold,
    color: COLORS.textOnPrimary,
    fontSize: 16,
  },
});

const coinRow = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
