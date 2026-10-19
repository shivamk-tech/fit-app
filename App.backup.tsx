
import React, { useState } from 'react';
import {
  StatusBar,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GREEN = '#C6FF4D';
const BG = '#0B0D0A';
const CARD = '#171A15';
const MUTED = '#92978C';

type Exercise = {
  id: string;
  name: string;
  detail: string;
  target: string;
  icon: string;
  color: string;
};

const exercises: Exercise[] = [
  {
    id: 'pushups',
    name: 'Push-ups',
    detail: 'Chest · Triceps',
    target: '20 reps',
    icon: '↗',
    color: '#C6FF4D',
  },
  {
    id: 'squats',
    name: 'Squats',
    detail: 'Legs · Glutes',
    target: '25 reps',
    icon: '↘',
    color: '#A9B9FF',
  },
  {
    id: 'plank',
    name: 'Plank',
    detail: 'Core · Abs',
    target: '30 sec',
    icon: '▬',
    color: '#FFBD75',
  },
];

export default function App() {
  const [tab, setTab] = useState('Home');
  const [selectedExercise, setSelectedExercise] =
    useState<Exercise | null>(null);
  const [reps, setReps] = useState(0);
  const [points, setPoints] = useState(240);
  const [streak, setStreak] = useState(7);
  const [completed, setCompleted] = useState(false);

  const startWorkout = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setReps(0);
    setCompleted(false);
  };

  const finishWorkout = () => {
    if (completed) return;

    setPoints((previous) => previous + 50);
    setStreak((previous) => previous + 1);
    setCompleted(true);
  };

  const goHome = () => {
    setSelectedExercise(null);
    setCompleted(false);
    setTab('Home');
  };

  if (selectedExercise) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={BG} />

        <View style={styles.workoutHeader}>
          <Pressable onPress={goHome} style={styles.backButton}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.eyebrow}>WORKOUT SESSION</Text>
          <View style={{ width: 42 }} />
        </View>

        <View style={styles.sessionContent}>
          <Text style={styles.eyebrow}>TODAY'S CHALLENGE</Text>
          <Text style={styles.sessionTitle}>
            {selectedExercise.name}
          </Text>
          <Text style={styles.mutedText}>
            {selectedExercise.detail}
          </Text>

          <View style={styles.counterCard}>
            <View
              style={[
                styles.exerciseIcon,
                { backgroundColor: selectedExercise.color },
              ]}
            >
              <Text style={styles.exerciseIconText}>
                {selectedExercise.icon}
              </Text>
            </View>

            <Text style={styles.counterLabel}>
              {selectedExercise.id === 'plank'
                ? 'SECONDS COMPLETED'
                : 'REPS COMPLETED'}
            </Text>

            <Text style={styles.counter}>
              {reps}
              <Text style={styles.counterTarget}>
                {' / '}
                {selectedExercise.id === 'pushups'
                  ? 20
                  : selectedExercise.id === 'squats'
                    ? 25
                    : 30}
              </Text>
            </Text>

            <Text style={styles.mutedText}>
              {completed
                ? 'Workout completed!'
                : 'Camera verification will be added next.'}
            </Text>
          </View>

          {!completed ? (
            <>
              <Text style={styles.demoNotice}>
                DEMO MODE · Manual counter, not AI verified
              </Text>

              <Pressable
                style={styles.primaryButton}
                onPress={() => setReps((previous) => previous + 1)}
              >
                <Text style={styles.primaryButtonText}>
                  + Add rep / second
                </Text>
              </Pressable>

              <Pressable
                style={styles.secondaryButton}
                onPress={finishWorkout}
              >
                <Text style={styles.secondaryButtonText}>
                  Finish workout
                </Text>
              </Pressable>
            </>
          ) : (
            <View style={styles.successCard}>
              <Text style={styles.successTitle}>Nice work! 🎉</Text>
              <Text style={styles.mutedText}>
                +50 points added in this UI demo.
              </Text>
              <Pressable
                style={styles.primaryButton}
                onPress={goHome}
              >
                <Text style={styles.primaryButtonText}>
                  Back to home
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>
            fit<Text style={{ color: GREEN }}>rewards.</Text>
          </Text>
          <Text style={styles.greeting}>LET'S GET STRONGER</Text>
        </View>

        <Pressable
          style={styles.avatar}
          onPress={() => setTab('Profile')}
        >
          <Text style={styles.avatarText}>S</Text>
        </Pressable>
      </View>

      {tab === 'Home' ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.welcome}>
            Build your{"\n"}
            <Text style={styles.highlight}>strongest self.</Text>
          </Text>

          <Text style={styles.subtitle}>
            Small efforts. Real progress. Every day.
          </Text>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, { marginRight: 8 }]}>
              <Text style={styles.statIcon}>🔥</Text>
              <Text style={styles.statValue}>{streak} days</Text>
              <Text style={styles.statLabel}>CURRENT STREAK</Text>
            </View>

            <View style={[styles.statCard, { marginLeft: 8 }]}>
              <Text style={styles.statIcon}>✦</Text>
              <Text style={styles.statValue}>{points}</Text>
              <Text style={styles.statLabel}>TOTAL POINTS</Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's mission</Text>
            <View style={styles.todayBadge}>
              <Text style={styles.todayBadgeText}>DAY {streak + 1}</Text>
            </View>
          </View>

          <View style={styles.missionCard}>
            <View style={styles.missionTop}>
              <View style={styles.missionTag}>
                <Text style={styles.missionTagText}>DAILY CHALLENGE</Text>
              </View>
              <Text style={styles.missionEmoji}>💪</Text>
            </View>

            <Text style={styles.missionTitle}>Push your limits.</Text>
            <Text style={styles.missionDescription}>
              Complete 20 push-ups and start building your streak.
            </Text>

            <View style={styles.missionFooter}>
              <Text style={styles.rewardText}>✦ 50 points</Text>
              <Pressable
                style={styles.startButton}
                onPress={() => startWorkout(exercises[0])}
              >
                <Text style={styles.startButtonText}>START ↗</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore workouts</Text>
            <Pressable onPress={() => setTab('Workouts')}>
              <Text style={styles.seeAll}>See all ↗</Text>
            </Pressable>
          </View>

          {exercises.map((exercise) => (
            <Pressable
              key={exercise.id}
              style={styles.exerciseCard}
              onPress={() => startWorkout(exercise)}
            >
              <View
                style={[
                  styles.exerciseIcon,
                  { backgroundColor: exercise.color },
                ]}
              >
                <Text style={styles.exerciseIconText}>
                  {exercise.icon}
                </Text>
              </View>

              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseDetail}>
                  {exercise.detail}
                </Text>
              </View>

              <View style={styles.exerciseRight}>
                <Text style={styles.exerciseTarget}>
                  {exercise.target}
                </Text>
                <Text style={styles.chevron}>›</Text>
              </View>
            </Pressable>
          ))}

          <View style={styles.bottomNote}>
            <Text style={styles.bottomNoteTitle}>
              CONSISTENCY WINS.
            </Text>
            <Text style={styles.mutedText}>
              Show up today. Thank yourself tomorrow.
            </Text>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={styles.otherTab}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.welcome}>{tab}</Text>
          <Text style={styles.subtitle}>
            {tab === 'Workouts'
              ? 'Choose an exercise to get moving.'
              : tab === 'Rewards'
                ? 'Your points balance and rewards.'
                : 'Your fitness journey at a glance.'}
          </Text>

          {tab === 'Workouts' ? (
            exercises.map((exercise) => (
              <Pressable
                key={exercise.id}
                style={styles.exerciseCard}
                onPress={() => startWorkout(exercise)}
              >
                <View
                  style={[
                    styles.exerciseIcon,
                    { backgroundColor: exercise.color },
                  ]}
                >
                  <Text style={styles.exerciseIconText}>
                    {exercise.icon}
                  </Text>
                </View>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>
                    {exercise.name}
                  </Text>
                  <Text style={styles.exerciseDetail}>
                    {exercise.detail}
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            ))
          ) : (
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>
                {tab === 'Rewards' ? '✦' : '🔥'}
              </Text>
              <Text style={styles.statValue}>
                {tab === 'Rewards' ? points : `${streak} days`}
              </Text>
              <Text style={styles.statLabel}>
                {tab === 'Rewards' ? 'DEMO POINTS BALANCE' : 'CURRENT STREAK'}
              </Text>
              <Text style={styles.mutedText}>
                {tab === 'Rewards'
                  ? 'Real reward redemption is coming later.'
                  : 'Your workout history will appear here later.'}
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      <View style={styles.bottomNav}>
        {[
          { name: 'Home', icon: '⌂' },
          { name: 'Workouts', icon: '↗' },
          { name: 'Rewards', icon: '✦' },
          { name: 'Profile', icon: '○' },
        ].map((item) => (
          <Pressable
            key={item.name}
            style={styles.navItem}
            onPress={() => setTab(item.name)}
          >
            <Text
              style={[
                styles.navIcon,
                tab === item.name && styles.navActive,
              ]}
            >
              {item.icon}
            </Text>
            <Text
              style={[
                styles.navLabel,
                tab === item.name && styles.navActive,
              ]}
            >
              {item.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 18,
  },
  brand: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '900',
    letterSpacing: -1,
  },
  greeting: {
    color: MUTED,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 4,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: '#252B1E',
    borderWidth: 1,
    borderColor: '#414A31',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: GREEN,
    fontSize: 17,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 26,
  },
  welcome: {
    color: '#F7F8F4',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1.3,
    lineHeight: 41,
    marginTop: 8,
  },
  highlight: {
    color: GREEN,
  },
  subtitle: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 9,
    marginBottom: 22,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: CARD,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#292D25',
    padding: 17,
    minHeight: 125,
    justifyContent: 'center',
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  statLabel: {
    color: MUTED,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginTop: 7,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 2,
  },
  sectionTitle: {
    color: '#F5F6F1',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  todayBadge: {
    backgroundColor: '#22291A',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  todayBadgeText: {
    color: GREEN,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  missionCard: {
    backgroundColor: '#20291A',
    borderRadius: 22,
    padding: 19,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#39462A',
  },
  missionTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  missionTag: {
    backgroundColor: '#303C25',
    borderRadius: 7,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  missionTagText: {
    color: GREEN,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  missionEmoji: {
    fontSize: 25,
  },
  missionTitle: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800',
    marginTop: 17,
    letterSpacing: -0.6,
  },
  missionDescription: {
    color: '#B3BBA8',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
    maxWidth: 250,
  },
  missionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 21,
  },
  rewardText: {
    color: GREEN,
    fontSize: 13,
    fontWeight: '800',
  },
  startButton: {
    backgroundColor: GREEN,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },
  startButtonText: {
    color: '#11150B',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  seeAll: {
    color: GREEN,
    fontSize: 12,
    fontWeight: '700',
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    borderRadius: 17,
    padding: 13,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#292D25',
  },
  exerciseIcon: {
    width: 47,
    height: 47,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseIconText: {
    color: '#14170F',
    fontSize: 24,
    fontWeight: '900',
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: 13,
  },
  exerciseName: {
    color: '#F5F6F1',
    fontSize: 14,
    fontWeight: '800',
  },
  exerciseDetail: {
    color: MUTED,
    fontSize: 11,
    marginTop: 5,
  },
  exerciseRight: {
    alignItems: 'flex-end',
  },
  exerciseTarget: {
    color: '#E4E8DE',
    fontSize: 11,
    fontWeight: '700',
  },
  chevron: {
    color: GREEN,
    fontSize: 25,
    marginLeft: 10,
  },
  bottomNote: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  bottomNoteTitle: {
    color: GREEN,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 7,
  },
  mutedText: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 6,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 9,
    backgroundColor: '#10120E',
    borderTopWidth: 1,
    borderTopColor: '#252820',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 62,
    paddingVertical: 3,
  },
  navIcon: {
    color: MUTED,
    fontSize: 21,
    fontWeight: '700',
  },
  navLabel: {
    color: MUTED,
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
  },
  navActive: {
    color: GREEN,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: CARD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 34,
  },
  eyebrow: {
    color: MUTED,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  sessionContent: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 35,
  },
  sessionTitle: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    marginTop: 12,
    letterSpacing: -1,
  },
  counterCard: {
    backgroundColor: CARD,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#292D25',
    padding: 24,
    marginTop: 30,
    alignItems: 'center',
  },
  counterLabel: {
    color: MUTED,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 25,
  },
  counter: {
    color: GREEN,
    fontSize: 57,
    fontWeight: '900',
    marginVertical: 8,
    letterSpacing: -2,
  },
  counterTarget: {
    color: '#6C7364',
    fontSize: 29,
  },
  demoNotice: {
    color: '#E8BD78',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: GREEN,
    padding: 17,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 12,
  },
  primaryButtonText: {
    color: '#14170F',
    fontSize: 14,
    fontWeight: '900',
  },
  secondaryButton: {
    backgroundColor: CARD,
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#30342C',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  successCard: {
    marginTop: 20,
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 20,
  },
  successTitle: {
    color: GREEN,
    fontSize: 22,
    fontWeight: '900',
  },
  otherTab: {
    paddingHorizontal: 22,
    paddingTop: 30,
    paddingBottom: 30,
  },
});
