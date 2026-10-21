import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DAILY_GOAL_COINS, DAILY_STEP_GOAL } from '../config/rewards';
import { useStepTracker } from '../hooks/useStepTracker';
import { openHealthConnectInStore } from '../services/healthConnect';
import { COLORS } from '../theme/colors';
import { CARD, RADII } from '../theme/layout';
import { FONTS } from '../theme/typography';
import type { HealthConnectStatus, StepSource } from '../types/steps';
import { ClaimRewardButton } from './ClaimRewardButton';
import { FitCoin, FITCOINS } from './FitCoin';
import { PressableScale } from './ui/PressableScale';
import { ProgressBar } from './ui/ProgressBar';

const SIMULATE_STEP_INCREMENT = 1000;

function formatNumber(n: number) {
  return n.toLocaleString('en-IN');
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function sourceLabel(source: StepSource, lastSyncedAt: string | null) {
  switch (source) {
    case 'connecting':
      return 'Connecting to your step data…';
    case 'healthConnect':
      return lastSyncedAt
        ? `Synced from Health Connect · ${formatTime(lastSyncedAt)}`
        : 'Syncing with Health Connect…';
    case 'sensor':
      return 'Counting with your phone’s sensor (since you opened the app)';
    case 'manual':
      return 'No step data on this device · dev manual mode';
    case 'unavailable':
      return 'Step counting isn’t available on this device';
  }
}

/** The Health Connect fix to offer, if any. */
function healthConnectAction(
  status: HealthConnectStatus,
): { label: string; kind: 'store' | 'connect' } | null {
  switch (status) {
    case 'notInstalled':
      return { label: 'Install Health Connect', kind: 'store' };
    case 'updateRequired':
      return { label: 'Update Health Connect', kind: 'store' };
    case 'permissionDenied':
      return { label: 'Connect Health Connect', kind: 'connect' };
    default:
      return null;
  }
}

export function StepsCard() {
  const {
    todaySteps,
    stepsToGoal,
    goalProgress,
    goalReached,
    goalClaimable,
    source,
    healthConnect,
    lastSyncedAt,
    ready,
    addSteps,
    connectHealthConnect,
    claimStepGoal,
  } = useStepTracker();

  const goalPct = Math.round(goalProgress * 100);
  const action = healthConnectAction(healthConnect);
  const live = source === 'healthConnect' || source === 'sensor';
  const claimed = goalReached && !goalClaimable;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.iconBubble}>
            <Text style={styles.iconText}>👟</Text>
          </View>
          <View>
            <Text style={styles.eyebrow}>Today's steps</Text>
            <Text style={styles.steps}>
              {ready ? formatNumber(todaySteps) : '—'}
              <Text style={styles.goal}>
                {' '}
                / {formatNumber(DAILY_STEP_GOAL)}
              </Text>
            </Text>
          </View>
        </View>
        <View style={[styles.coinBadge, claimed && styles.coinBadgeDone]}>
          <View style={styles.coinBadgeRow}>
            {claimed ? (
              <Text style={styles.coinBadgeText}>✓</Text>
            ) : (
              <FitCoin size={18} />
            )}
            <Text style={styles.coinBadgeText}>{DAILY_GOAL_COINS}</Text>
          </View>
          <Text style={styles.coinBadgeLabel}>
            {claimed ? 'claimed' : goalClaimable ? 'ready' : 'at goal'}
          </Text>
        </View>
      </View>

      <ProgressBar
        progress={goalProgress}
        height={10}
        color={goalReached ? COLORS.success : COLORS.primary}
        style={styles.goalBar}
      />

      <View style={styles.goalRow}>
        <Text style={styles.goalText}>
          {claimed ? (
            <Text style={styles.goalDone}>
              Daily goal reached · +{DAILY_GOAL_COINS} {FITCOINS} claimed 🎉
            </Text>
          ) : goalClaimable ? (
            <Text style={styles.goalStrong}>
              Daily goal reached! Claim before midnight.
            </Text>
          ) : (
            <>
              <Text style={styles.goalStrong}>{formatNumber(stepsToGoal)}</Text>{' '}
              steps to go for {DAILY_GOAL_COINS} {FITCOINS}
            </>
          )}
        </Text>
        <Text style={styles.goalPct}>{goalPct}%</Text>
      </View>

      {goalClaimable && (
        <ClaimRewardButton coins={DAILY_GOAL_COINS} onClaim={claimStepGoal} />
      )}

      <View style={styles.footerRow}>
        <View
          style={[
            styles.statusDot,
            live && styles.statusDotLive,
            source === 'manual' && styles.statusDotManual,
          ]}
        />
        <Text style={styles.footer}>{sourceLabel(source, lastSyncedAt)}</Text>
      </View>

      {action && (
        <PressableScale
          style={styles.actionButton}
          onPress={
            action.kind === 'store'
              ? openHealthConnectInStore
              : () => connectHealthConnect()
          }
          accessibilityRole="button"
        >
          <Text style={styles.actionText}>{action.label}</Text>
        </PressableScale>
      )}

      {action && source !== 'healthConnect' && (
        <Text style={styles.hint}>
          Health Connect counts every step from midnight, even when the app is
          closed.
        </Text>
      )}

      {source === 'manual' && (
        <PressableScale
          style={styles.simulateButton}
          onPress={() => addSteps(SIMULATE_STEP_INCREMENT)}
          accessibilityRole="button"
          accessibilityLabel={`Add ${SIMULATE_STEP_INCREMENT} steps`}
        >
          <Text style={styles.simulateText}>
            + {formatNumber(SIMULATE_STEP_INCREMENT)} steps (dev)
          </Text>
        </PressableScale>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...CARD,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: RADII.md,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 22 },
  eyebrow: {
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  steps: {
    fontFamily: FONTS.bold,
    color: COLORS.text,
    fontSize: 26,
    marginTop: 1,
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
    backgroundColor: COLORS.goldLight,
    borderRadius: RADII.md,
  },
  coinBadgeDone: {
    backgroundColor: COLORS.successLight,
  },
  coinBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  coinBadgeText: {
    fontFamily: FONTS.bold,
    color: COLORS.text,
    fontSize: 16,
  },
  coinBadgeLabel: {
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 1,
  },
  goalBar: {
    marginTop: 18,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  goalText: {
    flex: 1,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  goalStrong: {
    fontFamily: FONTS.semibold,
    color: COLORS.text,
  },
  goalDone: {
    fontFamily: FONTS.semibold,
    color: COLORS.success,
  },
  goalPct: {
    fontFamily: FONTS.medium,
    color: COLORS.textMuted,
    fontSize: 12,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
    gap: 8,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.textMuted,
  },
  statusDotLive: { backgroundColor: COLORS.success },
  statusDotManual: { backgroundColor: COLORS.gold },
  footer: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textSecondary,
    flex: 1,
  },
  actionButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: RADII.md,
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  actionText: {
    fontFamily: FONTS.semibold,
    color: COLORS.textOnPrimary,
    fontSize: 14,
  },
  hint: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },
  simulateButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.primarySoft,
  },
  simulateText: {
    fontFamily: FONTS.semibold,
    color: COLORS.primary,
    fontSize: 13,
  },
});
