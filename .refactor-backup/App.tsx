
import React, { useState } from 'react';
import {
  StatusBar,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from './src/theme/colors';
import { FONTS } from  "./src/theme/topography"

type Tab = 'Home' | 'Workouts' | 'Rewards' | 'Profile';

const DAYS = [
  { day: 'M', date: '12', done: true },
  { day: 'T', date: '13', done: true },
  { day: 'W', date: '14', done: true },
  { day: 'T', date: '15', done: false },
  { day: 'F', date: '16', done: false },
  { day: 'S', date: '17', done: false },
  { day: 'S', date: '18', done: false },
];

const EXERCISES = [
  { id: '1', name: 'Full Body Workout', detail: '12 exercises · 20 min', icon: '🏋️', tint: '#FFF0E1' },
  { id: '2', name: 'Upper Body Strength', detail: '8 exercises · 15 min', icon: '💪', tint: '#EAF1FF' },
  { id: '3', name: 'Core & Abs', detail: '6 exercises · 10 min', icon: '⚡', tint: '#E8F7EE' },
];

export default function App() {
  const [tab, setTab] = useState<Tab>('Home');
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);

  const openWorkout = (name: string) => {
    setSelectedWorkout(name);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>S</Text>
        </View>
        <View>
          <Text style={styles.greeting}>GOOD MORNING ☀️</Text>
          <Text style={styles.userName}>Hey, Shivam!</Text>
        </View>
      </View>
      <Pressable
        accessibilityLabel="Notifications"
        style={styles.notificationButton}
        onPress={() => {}}
      >
        <Text style={styles.bell}>♧</Text>
        <View style={styles.notificationDot} />
      </Pressable>
    </View>
  );

  const renderStreak = () => (
    <View style={styles.streakCard}>
      <View style={styles.streakHeader}>
        <View>
          <Text style={styles.cardEyebrow}>YOUR CONSISTENCY</Text>
          <Text style={styles.streakTitle}>Weekly streak 🔥</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakBadgeText}>3 DAYS</Text>
        </View>
      </View>

      <View style={styles.daysRow}>
        {DAYS.map((item, index) => (
          <View key={`${item.day}-${index}`} style={styles.dayItem}>
            <Text style={styles.dayLabel}>{item.day}</Text>
            <View
              style={[
                styles.dayCircle,
                item.done && styles.dayCircleDone,
                index === 3 && styles.dayCircleToday,
              ]}
            >
              <Text
                style={[
                  styles.dateLabel,
                  item.done && styles.dateLabelDone,
                  index === 3 && styles.dateLabelToday,
                ]}
              >
                {item.done ? '✓' : item.date}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <Text style={styles.streakFooter}>
        Great start! Keep showing up every day.
      </Text>
    </View>
  );

  const renderCoachBanner = () => (
    <Pressable
      style={styles.coachBanner}
      onPress={() => setTab('Workouts')}
    >
      <View style={styles.coachContent}>
        <View style={styles.aiBadge}>
          <Text style={styles.aiBadgeText}>✦ YOUR PERSONAL AI COACH</Text>
        </View>
        <Text style={styles.coachTitle}>
          Your goals.{'\n'}Your workout.
        </Text>
        <Text style={styles.coachDescription}>
          Find the right workout for your fitness journey.
        </Text>
        <View style={styles.coachButton}>
          <Text style={styles.coachButtonText}>Explore workouts  →</Text>
        </View>
      </View>
      <View style={styles.coachIllustration}>
        <Text style={styles.coachEmoji}>🏃</Text>
        <View style={styles.coachOrb} />
      </View>
    </Pressable>
  );

  const renderWorkoutCard = (
    workout: (typeof EXERCISES)[number],
  ) => (
    <Pressable
      key={workout.id}
      style={styles.workoutCard}
      onPress={() => openWorkout(workout.name)}
    >
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

  const renderHome = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={Platform.OS === 'android'}
      contentContainerStyle={styles.scrollContent}
    >
      {renderHeader()}

      <View style={styles.sectionIntro}>
        <Text style={styles.pageTitle}>
          Make today{'\n'}<Text style={styles.orangeText}>count.</Text>
        </Text>
        <Text style={styles.pageSubtitle}>
          Small steps today. Stronger you tomorrow.
        </Text>
      </View>

      {renderStreak()}

      <Pressable
        style={styles.searchBar}
        onPress={() => setTab('Workouts')}
      >
        <Text style={styles.searchIcon}>⌕</Text>
        <Text style={styles.searchPlaceholder}>
          What would you like to train today?
        </Text>
        <Text style={styles.searchSparkle}>✦</Text>
      </Pressable>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Meet your AI Coach</Text>
          <Text style={styles.sectionSubtitle}>
            A plan that fits your goals
          </Text>
        </View>
      </View>

      {renderCoachBanner()}

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Pick up where you left off</Text>
          <Text style={styles.sectionSubtitle}>
            Your next step starts here
          </Text>
        </View>
        <Pressable onPress={() => setTab('Workouts')}>
          <Text style={styles.seeAll}>See all →</Text>
        </Pressable>
      </View>

      {EXERCISES.slice(0, 2).map(renderWorkoutCard)}

      <View style={styles.motivationCard}>
        <Text style={styles.motivationIcon}>✦</Text>
        <View style={styles.motivationTextWrap}>
          <Text style={styles.motivationTitle}>Every rep counts.</Text>
          <Text style={styles.motivationText}>
            Build your routine, track your progress and keep going.
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderOtherTab = () => {
    const titleMap: Record<Exclude<Tab, 'Home'>, string> = {
      Workouts: 'Find your workout',
      Rewards: 'Your rewards',
      Profile: 'Your profile',
    };

    if (tab === 'Workouts') {
      return (
        <ScrollView
          removeClippedSubviews={Platform.OS === 'android'}
          contentContainerStyle={styles.otherContent}
        >
          <Text style={styles.pageTitle}>{titleMap.Workouts}</Text>
          <Text style={styles.pageSubtitle}>
            Choose a session that fits your day.
          </Text>
          <View style={styles.otherSection}>
            {EXERCISES.map(renderWorkoutCard)}
          </View>
        </ScrollView>
      );
    }

    if (tab === 'Rewards') {
      return (
        <ScrollView
          removeClippedSubviews={Platform.OS === 'android'}
          contentContainerStyle={styles.otherContent}
        >
          <Text style={styles.pageTitle}>{titleMap.Rewards}</Text>
          <Text style={styles.pageSubtitle}>
            Your fitness journey, one step at a time.
          </Text>
          <View style={styles.pointsCard}>
            <Text style={styles.pointsEyebrow}>DEMO BALANCE</Text>
            <Text style={styles.pointsValue}>240 <Text style={styles.pointsUnit}>points</Text></Text>
            <Text style={styles.pointsNote}>
              Reward points are for UI preview only. No real points have been earned.
            </Text>
          </View>
          <Text style={styles.sectionTitle}>Coming up</Text>
          <View style={styles.comingCard}>
            <Text style={styles.comingIcon}>🎁</Text>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutName}>Fitness rewards</Text>
              <Text style={styles.workoutDetail}>
                Redemption will be added after backend setup.
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }

    return (
      <ScrollView
        removeClippedSubviews={Platform.OS === 'android'}
        contentContainerStyle={styles.otherContent}
      >
        <Text style={styles.pageTitle}>{titleMap.Profile}</Text>
        <Text style={styles.pageSubtitle}>
          Your fitness journey starts with you.
        </Text>
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>S</Text>
          </View>
          <Text style={styles.profileName}>Shivam</Text>
          <Text style={styles.profileEmail}>FitRewards member</Text>
        </View>
        {['My workout history', 'Weekly activity', 'Settings'].map((item) => (
          <View key={item} style={styles.comingCard}>
            <Text style={styles.workoutName}>{item}</Text>
            <Text style={styles.arrowText}>›</Text>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderWorkoutSession = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.sessionHeader}>
        <Pressable
          onPress={() => setSelectedWorkout(null)}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.sessionEyebrow}>WORKOUT PREVIEW</Text>
        <View style={styles.headerSpacer} />
      </View>
      <View style={styles.sessionBody}>
        <View style={styles.sessionIcon}>
          <Text style={styles.sessionEmoji}>💪</Text>
        </View>
        <Text style={styles.sessionTitle}>{selectedWorkout}</Text>
        <Text style={styles.sessionDescription}>
          Your workout preview is ready.
        </Text>
        <View style={styles.sessionNotice}>
          <Text style={styles.sessionNoticeTitle}>Camera verification comes next</Text>
          <Text style={styles.sessionNoticeText}>
            This preview does not track reps or award points. We will add exercise
            instructions and on-device rep verification in a later step.
          </Text>
        </View>
        <Pressable
          style={styles.primaryButton}
          onPress={() => setSelectedWorkout(null)}
        >
          <Text style={styles.primaryButtonText}>Back to workouts</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );

  const navItems: { name: Tab; icon: string }[] = [
    { name: 'Home', icon: '⌂' },
    { name: 'Workouts', icon: '↗' },
    { name: 'Rewards', icon: '✧' },
    { name: 'Profile', icon: '○' },
  ];

  if (selectedWorkout) {
    return renderWorkoutSession();
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.pageContainer}>
        {tab === 'Home' ? renderHome() : renderOtherTab()}
      </View>
      <View style={styles.bottomNav}>
        {navItems.map((item) => {
          const active = tab === item.name;
          return (
            <Pressable
              key={item.name}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setTab(item.name)}
              style={styles.navItem}
            >
              <View style={[styles.navIconWrap, active && styles.navIconActive]}>
                <Text style={[styles.navIcon, active && styles.navIconSelected]}>
                  {item.icon}
                </Text>
              </View>
              <Text style={[styles.navLabel, active && styles.navLabelActive]}>
                {item.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  pageContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 22,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  avatar: {
    width: 47,
    height: 47,
    borderRadius: 17,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    fontSize: 21,
  },
  greeting: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
  },
  userName: {
    fontFamily: FONTS.bold,
    color: COLORS.text,
    fontSize: 18,
    marginTop: 3,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bell: {
    fontSize: 24,
    color: COLORS.text,
  },
  notificationDot: {
    position: 'absolute',
    right: 10,
    top: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  sectionIntro: {
    marginBottom: 20,
  },
  pageTitle: {
  fontFamily: FONTS.bold,
  color: COLORS.text,
  fontSize: 31,
  lineHeight: 37,
  letterSpacing: -0.8,
},
  orangeText: {
    color: COLORS.primary,
  },
  pageSubtitle: {
  fontFamily: FONTS.regular,
  color: COLORS.textSecondary,
  fontSize: 13,
  lineHeight: 20,
  marginTop: 7,
},
  streakCard: {
    padding: 17,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    marginBottom: 16,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardEyebrow: {
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
    fontSize: 9,
    letterSpacing: 1,
  },
  streakTitle: {
    fontFamily: FONTS.bold,
    color: COLORS.text,
    fontSize: 18,
    marginTop: 5,
  },
  streakBadge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 9,
  },
  streakBadgeText: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    fontSize: 10,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 21,
  },
  dayItem: {
    alignItems: 'center',
    gap: 8,
  },
  dayLabel: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dayCircleDone: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dayCircleToday: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  dateLabel: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  dateLabelDone: {
    color: COLORS.background,
    fontSize: 15,
  },
  dateLabelToday: {
    color: COLORS.primary,
  },
  streakFooter: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 25,
    backgroundColor: COLORS.background,
  },
  searchIcon: {
    fontSize: 25,
    color: COLORS.textSecondary,
    marginRight: 10,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  searchSparkle: {
    color: COLORS.primary,
    fontSize: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 13,
    marginTop: 1,
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
  coachBanner: {
    minHeight: 194,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 23,
    padding: 17,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 27,
  },
  coachContent: {
    flex: 1,
    zIndex: 1,
  },
  aiBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  aiBadgeText: {
    color: COLORS.primary,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  coachTitle: {
    fontFamily: FONTS.bold,
    color: COLORS.text,
    fontSize: 24,
    lineHeight: 29,
    marginTop: 13,
  },
  coachDescription: {
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    fontSize: 10,
    lineHeight: 15,
    maxWidth: 185,
    marginTop: 6,
  },
  coachButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 11,
    marginTop: 13,
  },
  coachButtonText: {
  fontFamily: FONTS.semibold,
  color: COLORS.background,
  fontSize: 10,
},
  coachIllustration: {
    width: 82,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coachOrb: {
    width: 85,
    height: 85,
    borderRadius: 43,
    backgroundColor: '#FFD5AE',
    position: 'absolute',
    right: -28,
    bottom: 2,
  },
  coachEmoji: {
    fontSize: 52,
    zIndex: 1,
  },
  seeAll: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
  },
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
  motivationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 17,
    backgroundColor: COLORS.surface,
    marginTop: 13,
  },
  motivationIcon: {
    color: COLORS.primary,
    fontSize: 24,
    marginRight: 12,
  },
  motivationTextWrap: {
    flex: 1,
  },
  motivationTitle: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 12,
  },
  motivationText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 9,
    paddingBottom: 5,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 66,
    paddingVertical: 2,
  },
  navIconWrap: {
    width: 43,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  navIconActive: {
    backgroundColor: COLORS.primaryLight,
  },
  navIcon: {
    fontSize: 22,
    color: COLORS.textSecondary,
  },
  navIconSelected: {
    color: COLORS.primary,
  },
  navLabel: {
    fontFamily: FONTS.medium,
    fontSize: 9,
    marginTop: 3,
    color: COLORS.textSecondary,
  },
  navLabelActive: {
    fontFamily: FONTS.semibold,
    color: COLORS.primary,
  },
  otherContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 30,
  },
  otherSection: {
    marginTop: 25,
  },
  pointsCard: {
    backgroundColor: COLORS.primaryLight,
    padding: 22,
    borderRadius: 22,
    marginTop: 25,
    marginBottom: 28,
  },
  pointsEyebrow: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  pointsValue: {
    color: COLORS.text,
    fontSize: 35,
    fontWeight: '900',
    marginTop: 8,
  },
  pointsUnit: {
    color: COLORS.primary,
    fontSize: 15,
  },
  pointsNote: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 10,
  },
  comingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
    marginTop: 12,
  },
  comingIcon: {
    fontSize: 27,
    marginRight: 12,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 25,
    marginTop: 25,
    marginBottom: 15,
  },
  profileAvatar: {
    width: 76,
    height: 76,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryLight,
  },
  profileAvatarText: {
    color: COLORS.primary,
    fontSize: 32,
    fontWeight: '900',
  },
  profileName: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: '800',
    marginTop: 12,
  },
  profileEmail: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 5,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
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
  sessionEyebrow: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  headerSpacer: {
    width: 42,
  },
  sessionBody: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  sessionIcon: {
    width: 90,
    height: 90,
    borderRadius: 27,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionEmoji: {
    fontSize: 42,
  },
  sessionTitle: {
    color: COLORS.text,
    fontSize: 29,
    fontWeight: '900',
    marginTop: 24,
  },
  sessionDescription: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 8,
  },
  sessionNotice: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 17,
    marginTop: 28,
  },
  sessionNoticeTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '800',
  },
  sessionNoticeText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 18,
  },
  primaryButtonText: {
    fontFamily: FONTS.semibold,
    color: COLORS.background,
    fontSize: 13,
  },
});
