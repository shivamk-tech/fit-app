import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FitCoin, FITCOINS } from '../components/FitCoin';
import { FadeIn } from '../components/ui/FadeIn';
import { DAILY_GOAL_COINS, DAILY_STEP_GOAL } from '../config/rewards';
import { useStepTracker } from '../hooks/useStepTracker';
import { COLORS } from '../theme/colors';
import { RADII } from '../theme/layout';
import { FONTS } from '../theme/typography';
import type { RewardsScreenProps } from '../types/navigation';
import type { CoinTransaction } from '../types/steps';
import { screenStyles } from './screenStyles';

function isToday(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

function formatWhen(iso: string) {
  const d = new Date(iso);
  const sameDay = isToday(iso);
  const time = d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
  if (sameDay) return `Today · ${time}`;
  return `${d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  })} · ${time}`;
}

function LedgerRow({ tx }: { tx: CoinTransaction }) {
  const positive = tx.amount > 0;
  const isStreak = /streak/i.test(tx.reason);
  const icon = !positive ? '🎁' : isStreak ? '🔥' : '👟';
  return (
    <View style={screenStyles.comingCard}>
      <View
        style={[
          screenStyles.rowIcon,
          positive && isStreak && styles.iconStreak,
          !positive && styles.iconSpend,
        ]}
      >
        <Text style={screenStyles.comingIcon}>{icon}</Text>
      </View>
      <View style={screenStyles.workoutInfo}>
        <Text style={screenStyles.workoutName}>{tx.reason}</Text>
        <Text style={screenStyles.workoutDetail}>{formatWhen(tx.at)}</Text>
      </View>
      <View style={[styles.amountPill, !positive && styles.amountPillNegative]}>
        <Text
          style={[
            styles.ledgerAmount,
            !positive && styles.ledgerAmountNegative,
          ]}
        >
          {positive ? '+' : ''}
          {tx.amount}
        </Text>
        <FitCoin size={14} />
      </View>
    </View>
  );
}

export function RewardsScreen(_props: RewardsScreenProps) {
  const { wallet, todaySteps, ready } = useStepTracker();
  // Everything earned today (steps goal, check-in, …), from the ledger.
  const earnedToday = wallet.ledger
    .filter(tx => tx.amount > 0 && isToday(tx.at))
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={Platform.OS === 'android'}
      contentContainerStyle={screenStyles.content}
    >
      <FadeIn>
        <Text style={screenStyles.pageTitle}>Your rewards</Text>
        <Text style={screenStyles.pageSubtitle}>
          Walk {DAILY_STEP_GOAL.toLocaleString('en-IN')} steps a day for{' '}
          {DAILY_GOAL_COINS} {FITCOINS}, plus daily check-in rewards.
        </Text>
      </FadeIn>

      <FadeIn delay={60}>
        <View style={screenStyles.pointsCardShadow}>
          <View style={screenStyles.pointsCard}>
            <View style={screenStyles.pointsOrb} />
            <Text style={screenStyles.pointsEyebrow}>FITCOIN BALANCE</Text>
            <View style={styles.balanceRow}>
              <FitCoin size={36} />
              <Text style={screenStyles.pointsValue}>
                {ready ? wallet.balance.toLocaleString('en-IN') : '—'}{' '}
                <Text style={screenStyles.pointsUnit}>{FITCOINS}</Text>
              </Text>
            </View>
            <View style={screenStyles.pointsStatRow}>
              <View style={screenStyles.pointsStat}>
                <Text style={screenStyles.pointsStatValue}>
                  {todaySteps.toLocaleString('en-IN')}
                </Text>
                <Text style={screenStyles.pointsNote}>steps today</Text>
              </View>
              <View style={screenStyles.pointsStat}>
                <Text style={screenStyles.pointsStatValue}>+{earnedToday}</Text>
                <Text style={screenStyles.pointsNote}>FitCoins today</Text>
              </View>
            </View>
          </View>
        </View>
      </FadeIn>

      <FadeIn delay={120}>
        <Text style={[screenStyles.sectionTitle, styles.heading]}>
          Recent activity
        </Text>
        {wallet.ledger.length === 0 ? (
          <View style={screenStyles.comingCard}>
            <View style={screenStyles.rowIcon}>
              <Text style={screenStyles.comingIcon}>👟</Text>
            </View>
            <View style={screenStyles.workoutInfo}>
              <Text style={screenStyles.workoutName}>No FitCoins yet</Text>
              <Text style={screenStyles.workoutDetail}>
                Reach {DAILY_STEP_GOAL.toLocaleString('en-IN')} steps today to
                earn your first {DAILY_GOAL_COINS} {FITCOINS}.
              </Text>
            </View>
          </View>
        ) : (
          wallet.ledger.map(tx => <LedgerRow key={tx.id} tx={tx} />)
        )}
      </FadeIn>

      <FadeIn delay={180}>
        <Text style={[screenStyles.sectionTitle, styles.heading]}>
          Coming up
        </Text>
        <View style={[screenStyles.comingCard, styles.comingSoon]}>
          <View style={[screenStyles.rowIcon, styles.iconSpend]}>
            <Text style={screenStyles.comingIcon}>🎁</Text>
          </View>
          <View style={screenStyles.workoutInfo}>
            <Text style={screenStyles.workoutName}>Redeem coins</Text>
            <Text style={screenStyles.workoutDetail}>
              Redemption will be added after backend setup.
            </Text>
          </View>
          <View style={styles.soonPill}>
            <Text style={styles.soonText}>SOON</Text>
          </View>
        </View>
      </FadeIn>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
  },
  heading: {
    marginTop: 28,
    marginBottom: 2,
  },
  iconStreak: {
    backgroundColor: COLORS.goldLight,
  },
  iconSpend: {
    backgroundColor: COLORS.errorLight,
  },
  amountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.successLight,
  },
  amountPillNegative: {
    backgroundColor: COLORS.errorLight,
  },
  ledgerAmount: {
    fontFamily: FONTS.bold,
    color: COLORS.success,
    fontSize: 14,
  },
  ledgerAmountNegative: {
    color: COLORS.error,
  },
  comingSoon: {
    opacity: 0.85,
  },
  soonPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.surface,
  },
  soonText: {
    fontFamily: FONTS.bold,
    color: COLORS.textMuted,
    fontSize: 10,
    letterSpacing: 0.6,
  },
});
