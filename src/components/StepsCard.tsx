import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COINS_PER_REWARD, DAILY_STEP_GOAL, STEPS_PER_REWARD } from '../config/rewards';
import { useStepTracker } from '../hooks/useStepTracker';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';

const SIMULATE_STEP_INCREMENT = 250;

function formatNumber(n: number) {
  return n.toLocaleString('en-IN');
}

export function StepsCard() {
  const {
    todaySteps,
    todayCoins,
    stepsToNextReward,
    progressToNextReward,
    source,
    ready,
    addSteps,
  } = useStepTracker();

  const goalProgress = Math.min(1, todaySteps / DAILY_STEP_GOAL);
  const showSimulator = source === 'manual';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>TODAY'S STEPS</Text>
          <Text style={styles.steps}>
            {ready ? formatNumber(todaySteps) : '—'}
            <Text style={styles.goal}> / {formatNumber(DAILY_STEP_GOAL)}</Text>
          </Text>
        </View>
        <View style={styles.coinBadge}>
          <Text style={styles.coinBadgeText}>🪙 {todayCoins}</Text>
          <Text style={styles.coinBadgeLabel}>earned today</Text>
        </View>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${goalProgress * 100}%` }]} />
      </View>

      <View style={styles.rewardRow}>
        <View style={styles.rewardTrack}>
          <View
            style={[styles.rewardFill, { width: `${progressToNextReward * 100}%` }]}
          />
        </View>
        <Text style={styles.rewardText}>
          {formatNumber(stepsToNextReward)} steps to next {COINS_PER_REWARD} coins
        </Text>
      </View>

      <Text style={styles.footer}>
        {source === 'sensor'
          ? `Counting automatically · ${COINS_PER_REWARD} coins per ${formatNumber(STEPS_PER_REWARD)} steps`
          : source === 'manual'
          ? 'No step sensor found on this device · using manual mode'
          : 'Starting step counter…'}
      </Text>

      {showSimulator && (
        <Pressable
          style={styles.simulateButton}
          onPress={() => addSteps(SIMULATE_STEP_INCREMENT)}
          accessibilityLabel={`Add ${SIMULATE_STEP_INCREMENT} steps`}
        >
          <Text style={styles.simulateText}>+ {SIMULATE_STEP_INCREMENT} steps</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 17,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  eyebrow: {
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
    fontSize: 9,
    letterSpacing: 1,
  },
  steps: {
    fontFamily: FONTS.bold,
    color: COLORS.text,
    fontSize: 30,
    marginTop: 5,
    letterSpacing: -0.5,
  },
  goal: {
    fontFamily: FONTS.medium,
    color: COLORS.textMuted,
    fontSize: 14,
    letterSpacing: 0,
  },
  coinBadge: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
  },
  coinBadgeText: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    fontSize: 16,
  },
  coinBadgeLabel: {
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    fontSize: 9,
    marginTop: 2,
  },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.background,
    marginTop: 16,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 10,
  },
  rewardTrack: {
    width: 64,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  rewardFill: {
    height: '100%',
    backgroundColor: COLORS.success,
  },
  rewardText: {
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    fontSize: 11,
    flex: 1,
  },
  footer: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 14,
  },
  simulateButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background,
  },
  simulateText: {
    fontFamily: FONTS.semibold,
    color: COLORS.primary,
    fontSize: 12,
  },
});
