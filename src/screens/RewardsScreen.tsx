import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COINS_PER_REWARD, STEPS_PER_REWARD } from '../config/rewards';
import { useStepTracker } from '../hooks/useStepTracker';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';
import type { RewardsScreenProps } from '../types/navigation';
import type { CoinTransaction } from '../types/steps';
import { screenStyles } from './screenStyles';

function formatWhen(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const sameDay =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();
  const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  if (sameDay) return `Today · ${time}`;
  return `${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · ${time}`;
}

function LedgerRow({ tx }: { tx: CoinTransaction }) {
  const positive = tx.amount > 0;
  const icon = !positive ? '🎁' : /streak/i.test(tx.reason) ? '🔥' : '👟';
  return (
    <View style={styles.ledgerRow}>
      <Text style={styles.ledgerIcon}>{icon}</Text>
      <View style={screenStyles.workoutInfo}>
        <Text style={screenStyles.workoutName}>{tx.reason}</Text>
        <Text style={screenStyles.workoutDetail}>{formatWhen(tx.at)}</Text>
      </View>
      <Text style={[styles.ledgerAmount, !positive && styles.ledgerAmountNegative]}>
        {positive ? '+' : ''}
        {tx.amount}
      </Text>
    </View>
  );
}

export function RewardsScreen(_props: RewardsScreenProps) {
  const { wallet, todaySteps, todayCoins, ready } = useStepTracker();

  return (
    <ScrollView
      removeClippedSubviews={Platform.OS === 'android'}
      contentContainerStyle={[screenStyles.content, styles.content]}
    >
      <Text style={screenStyles.pageTitle}>Your rewards</Text>
      <Text style={screenStyles.pageSubtitle}>
        {COINS_PER_REWARD} coins per {STEPS_PER_REWARD.toLocaleString('en-IN')} steps, plus a daily workout streak bonus.
      </Text>

      <View style={screenStyles.pointsCard}>
        <Text style={screenStyles.pointsEyebrow}>COIN BALANCE</Text>
        <Text style={screenStyles.pointsValue}>
          {ready ? wallet.balance : '—'}{' '}
          <Text style={screenStyles.pointsUnit}>coins</Text>
        </Text>
        <Text style={screenStyles.pointsNote}>
          {todaySteps.toLocaleString('en-IN')} steps today · {todayCoins} coins earned today
        </Text>
      </View>

      <Text style={[screenStyles.sectionTitle, styles.heading]}>Recent activity</Text>
      {wallet.ledger.length === 0 ? (
        <View style={screenStyles.comingCard}>
          <Text style={screenStyles.comingIcon}>👟</Text>
          <View style={screenStyles.workoutInfo}>
            <Text style={screenStyles.workoutName}>No coins yet</Text>
            <Text style={screenStyles.workoutDetail}>
              Walk {STEPS_PER_REWARD.toLocaleString('en-IN')} steps to earn your first {COINS_PER_REWARD} coins.
            </Text>
          </View>
        </View>
      ) : (
        wallet.ledger.map(tx => <LedgerRow key={tx.id} tx={tx} />)
      )}

      <Text style={[screenStyles.sectionTitle, styles.heading]}>Coming up</Text>
      <View style={screenStyles.comingCard}>
        <Text style={screenStyles.comingIcon}>🎁</Text>
        <View style={screenStyles.workoutInfo}>
          <Text style={screenStyles.workoutName}>Redeem coins</Text>
          <Text style={screenStyles.workoutDetail}>
            Redemption will be added after backend setup.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
  },
  heading: {
    marginTop: 24,
    marginBottom: 0,
  },
  ledgerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
    marginTop: 12,
  },
  ledgerIcon: {
    fontSize: 22,
  },
  ledgerAmount: {
    fontFamily: FONTS.bold,
    color: COLORS.success,
    fontSize: 15,
  },
  ledgerAmountNegative: {
    color: COLORS.error,
  },
});
