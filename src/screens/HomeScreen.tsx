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
import { useAuth } from '../hooks/useAuth';
import { ProfileHeader } from '../components/ProfileHeader';
import { StepsCard } from '../components/StepsCard';
import { WeeklyStreak } from '../components/WeeklyStreak';
import { WorkoutCard } from '../components/WorkoutCard';
import { FadeIn } from '../components/ui/FadeIn';
import { PressableScale } from '../components/ui/PressableScale';
import { preloadRewardedAd } from '../services/rewardedAd';
import { checkIn, getCheckInStatus } from '../services/streakRewards';
import type { CheckInStatus } from '../services/streakRewards';
import { localDateKey } from '../services/stepMath';
import {
  getCompletedSessions,
  sessionDateKey,
} from '../services/workoutStorage';
import { COLORS } from '../theme/colors';
import { CARD, RADII, SHADOWS } from '../theme/layout';
import { FONTS } from '../theme/typography';
import type { HomeScreenProps } from '../types/navigation';
import type { WorkoutSession } from '../types/workout';
import { DEMO_WORKOUTS } from '../utils/demoData';

/** Last 7 days, oldest first; `done` = checked in that day. */
function buildCheckInDays(checkedDates: string[]) {
  const today = new Date();
  const checked = new Set(checkedDates);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const dayLabel = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()];
    return {
      day: dayLabel,
      date: String(d.getDate()),
      done: checked.has(localDateKey(d)),
      isToday: i === 6,
    };
  });
}

function greetingForNow(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning ☀️';
  if (hour < 17) return 'Good afternoon 🌤️';
  return 'Good evening 🌙';
}

export function HomeScreen({ navigation }: HomeScreenProps) {
  const { user } = useAuth();
  const firstName = user?.givenName ?? user?.name?.split(' ')[0] ?? 'there';
  const [completedSessions, setCompletedSessions] = useState<WorkoutSession[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [checkInState, setCheckInState] = useState<CheckInStatus | null>(null);

  const loadHistory = useCallback(async () => {
    const sessions = await getCompletedSessions();
    setCompletedSessions(sessions);
    const status = await getCheckInStatus();
    setCheckInState(status);
    // Have an ad ready before the user taps "check in".
    if (!status.checkedInToday) preloadRewardedAd();
    setLoading(false);
  }, []);

  // Reload every time the tab comes into focus (e.g. after finishing a workout)
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory]),
  );

  const openWorkoutDetail = (workoutId: string) =>
    navigation.navigate('WorkoutDetail', { workoutId });

  const featured = DEMO_WORKOUTS[0];
  const isFirstTimeUser = !loading && completedSessions.length === 0;
  const workedOutToday = completedSessions.some(
    s => sessionDateKey(s) === localDateKey(),
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={Platform.OS === 'android'}
      contentContainerStyle={styles.scrollContent}
    >
      <FadeIn>
        <ProfileHeader
          greeting={greetingForNow()}
          userName={`Hey, ${firstName}!`}
          avatarInitial={(user?.name ?? user?.email ?? '?')[0].toUpperCase()}
          photoUrl={user?.photo}
          onNotificationsPress={() => {}}
        />
      </FadeIn>

      {/* Featured workout hero */}
      <FadeIn delay={60}>
        <PressableScale
          style={styles.heroShadow}
          onPress={() => openWorkoutDetail(featured.id)}
          scaleTo={0.98}
          accessibilityRole="button"
          accessibilityLabel={`Start ${featured.name}`}
        >
          {/* Inner view clips the orbs; the outer one keeps the shadow (iOS clips shadows with overflow). */}
          <View style={styles.hero}>
            <View style={[styles.heroOrb, styles.heroOrbLarge]} />
            <View style={[styles.heroOrb, styles.heroOrbSmall]} />
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>
                {workedOutToday ? 'GO AGAIN' : "TODAY'S WORKOUT"}
              </Text>
            </View>
            <View style={styles.heroBody}>
              <View style={styles.heroText}>
                <Text style={styles.heroTitle}>{featured.name}</Text>
                <Text style={styles.heroDetail}>{featured.detail}</Text>
              </View>
              <Text style={styles.heroEmoji}>{featured.icon}</Text>
            </View>
            <View style={styles.heroButton}>
              <Text style={styles.heroButtonText}>Start workout</Text>
              <Text style={styles.heroButtonArrow}>→</Text>
            </View>
          </View>
        </PressableScale>
      </FadeIn>

      {/* Steps + coins — always visible */}
      <FadeIn delay={120}>
        <StepsCard />
      </FadeIn>

      {/* Daily check-in streak — always visible */}
      {checkInState && (
        <FadeIn delay={180}>
          <WeeklyStreak
            days={buildCheckInDays(checkInState.checkedDates)}
            streak={checkInState.streak}
            rewardDayIndex={checkInState.dayIndex}
            checkedInToday={checkInState.checkedInToday}
            onCheckIn={async () => setCheckInState(await checkIn())}
          />
        </FadeIn>
      )}

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={COLORS.primary} />
        </View>
      ) : isFirstTimeUser ? (
        /* ── First-time empty state ── */
        <FadeIn delay={240} style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <Text style={styles.emptyIcon}>🏁</Text>
          </View>
          <Text style={styles.emptyTitle}>Ready to get moving?</Text>
          <Text style={styles.emptySubtitle}>
            Finish your first workout. Every session counts.
          </Text>
        </FadeIn>
      ) : (
        /* ── Returning user ── */
        <>
          <FadeIn delay={240}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>
                  Pick up where you left off
                </Text>
                <Text style={styles.sectionSubtitle}>
                  Your next step starts here
                </Text>
              </View>
              <Pressable
                onPress={() => navigation.navigate('Workouts')}
                hitSlop={10}
              >
                <Text style={styles.seeAll}>See all</Text>
              </Pressable>
            </View>

            {DEMO_WORKOUTS.slice(0, 2).map(workout => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onPress={item => openWorkoutDetail(item.id)}
              />
            ))}
          </FadeIn>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  heroShadow: {
    borderRadius: RADII.xl,
    marginBottom: 16,
    backgroundColor: COLORS.primary,
    ...SHADOWS.raised,
  },
  hero: {
    borderRadius: RADII.xl,
    padding: 20,
    overflow: 'hidden',
  },
  heroOrb: {
    position: 'absolute',
    borderRadius: RADII.pill,
    backgroundColor: COLORS.textOnPrimary,
  },
  heroOrbLarge: {
    width: 220,
    height: 220,
    right: -70,
    top: -90,
    opacity: 0.08,
  },
  heroOrbSmall: {
    width: 120,
    height: 120,
    right: 40,
    bottom: -60,
    opacity: 0.06,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADII.pill,
  },
  heroBadgeText: {
    fontFamily: FONTS.bold,
    color: COLORS.textOnPrimary,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  heroBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  heroText: { flex: 1 },
  heroTitle: {
    fontFamily: FONTS.bold,
    color: COLORS.textOnPrimary,
    fontSize: 24,
    lineHeight: 29,
    letterSpacing: -0.5,
  },
  heroDetail: {
    fontFamily: FONTS.regular,
    color: 'rgba(255,255,255,0.78)',
    fontSize: 13,
    marginTop: 4,
  },
  heroEmoji: {
    fontSize: 46,
    marginLeft: 12,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surfaceWhite,
    borderRadius: RADII.md,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginTop: 18,
  },
  heroButtonText: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    fontSize: 15,
  },
  heroButtonArrow: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    fontSize: 18,
  },
  loadingWrap: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyState: {
    ...CARD,
    alignItems: 'center',
    paddingVertical: 28,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: RADII.lg,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyTitle: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
    maxWidth: 260,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 3,
  },
  seeAll: {
    color: COLORS.primary,
    fontSize: 13,
    fontFamily: FONTS.semibold,
  },
});
