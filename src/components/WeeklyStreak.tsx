import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAdClaim } from '../hooks/useAdClaim';
import { STREAK_REWARD_TABLE } from '../services/streakRewards';
import { COLORS } from '../theme/colors';
import { CARD, RADII } from '../theme/layout';
import { FONTS } from '../theme/typography';
import type { StreakDay } from '../types/workout';
import { ClaimRewardButton } from './ClaimRewardButton';
import { FitCoin, FITCOINS } from './FitCoin';

export interface WeeklyStreakProps {
  /** Last 7 days, oldest first; `done` = checked in that day. */
  days: StreakDay[];
  /** Consecutive check-in days. */
  streak: number;
  /** 1..7: today's position in the reward cycle. */
  rewardDayIndex: number;
  checkedInToday: boolean;
  /** Pays today's check-in (called after the rewarded ad). */
  onCheckIn: () => unknown;
}

export function WeeklyStreak({
  days,
  streak,
  rewardDayIndex,
  checkedInToday,
  onCheckIn,
}: WeeklyStreakProps) {
  // One ad flow shared by today's circle and the button below.
  const claim = useAdClaim();
  const todayCoins = STREAK_REWARD_TABLE[rewardDayIndex - 1] ?? 0;
  const canCheckIn = !checkedInToday && !claim.loading;

  return (
    <View style={styles.streakCard}>
      <View style={styles.streakHeader}>
        <View>
          <Text style={styles.cardEyebrow}>Your streak</Text>
          <Text style={styles.streakTitle}>Daily check-in</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakBadgeText}>
            🔥 {streak} {streak === 1 ? 'day' : 'days'}
          </Text>
        </View>
      </View>

      <View style={styles.daysRow}>
        {days.map((item, index) => {
          const isToday = item.isToday ?? index === days.length - 1;
          const open = isToday && !item.done;
          return (
            <View key={`${item.day}-${index}`} style={styles.dayItem}>
              <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>
                {item.day}
              </Text>
              <Pressable
                disabled={!open || !canCheckIn}
                onPress={() => claim.run(onCheckIn)}
                hitSlop={8}
                accessibilityRole={open ? 'button' : undefined}
                accessibilityLabel={
                  open
                    ? `Check in today for ${todayCoins} ${FITCOINS}`
                    : undefined
                }
                style={[
                  styles.dayCircle,
                  item.done && styles.dayCircleDone,
                  open && styles.dayCircleOpen,
                ]}
              >
                {open && claim.loading ? (
                  <ActivityIndicator size="small" color={COLORS.gold} />
                ) : (
                  <Text
                    style={[
                      styles.dateLabel,
                      item.done && styles.dateLabelDone,
                      open && styles.dateLabelOpen,
                    ]}
                  >
                    {item.done ? '✓' : item.date}
                  </Text>
                )}
              </Pressable>
              <Text style={styles.tapLabel}>{open ? 'TAP' : ' '}</Text>
            </View>
          );
        })}
      </View>

      {/* ── Reward cycle ── */}
      <View style={styles.rewardHeader}>
        <Text style={styles.cardEyebrow}>Check-in rewards</Text>
        <Text style={styles.rewardHint}>repeats every 7 days</Text>
      </View>
      <View style={styles.rewardRow}>
        {STREAK_REWARD_TABLE.map((coins, i) => {
          const day = i + 1;
          const isCurrent = day === rewardDayIndex;
          const isEarned =
            day < rewardDayIndex || (isCurrent && checkedInToday);
          return (
            <View
              key={day}
              style={[
                styles.rewardChip,
                isCurrent && !isEarned && styles.rewardChipCurrent,
                isEarned && styles.rewardChipEarned,
              ]}
            >
              <Text
                style={[
                  styles.rewardDay,
                  isCurrent && styles.rewardDayActive,
                  isEarned && styles.rewardTextEarned,
                ]}
              >
                D{day}
              </Text>
              <Text
                style={[
                  styles.rewardCoins,
                  isCurrent && styles.rewardCoinsActive,
                  isEarned && styles.rewardTextEarned,
                ]}
              >
                {isEarned ? '✓' : coins}
              </Text>
              {!isEarned && (
                <View style={styles.rewardCoinIcon}>
                  <FitCoin size={13} />
                </View>
              )}
            </View>
          );
        })}
      </View>

      <Text style={styles.streakFooter}>
        {checkedInToday
          ? `Checked in · +${todayCoins} ${FITCOINS}. Come back tomorrow for ${
              STREAK_REWARD_TABLE[rewardDayIndex % STREAK_REWARD_TABLE.length]
            }.`
          : `Check in today for ${todayCoins} ${FITCOINS}. Miss a day and the streak restarts.`}
      </Text>

      {!checkedInToday && (
        <ClaimRewardButton
          coins={todayCoins}
          action="Check in"
          onClaim={onCheckIn}
          claim={claim}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  streakCard: {
    ...CARD,
    marginBottom: 24,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardEyebrow: {
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  streakTitle: {
    fontFamily: FONTS.bold,
    color: COLORS.text,
    fontSize: 18,
    marginTop: 2,
    letterSpacing: -0.2,
  },
  streakBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: COLORS.goldLight,
    borderRadius: RADII.pill,
  },
  streakBadgeText: {
    fontFamily: FONTS.bold,
    color: COLORS.text,
    fontSize: 12,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  dayItem: {
    alignItems: 'center',
    gap: 8,
  },
  dayLabel: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  dayLabelToday: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleDone: {
    backgroundColor: COLORS.primary,
  },
  dayCircleOpen: {
    backgroundColor: COLORS.goldLight,
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  dateLabel: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  dateLabelDone: {
    fontFamily: FONTS.bold,
    color: COLORS.textOnPrimary,
    fontSize: 15,
  },
  dateLabelOpen: {
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  tapLabel: {
    fontFamily: FONTS.bold,
    fontSize: 9,
    letterSpacing: 0.6,
    color: COLORS.gold,
    marginTop: -2,
  },
  streakFooter: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textSecondary,
    marginTop: 14,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  rewardHint: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  rewardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 6,
  },
  rewardChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: RADII.sm + 2,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  rewardChipEarned: {
    backgroundColor: COLORS.primary,
  },
  rewardChipCurrent: {
    backgroundColor: COLORS.goldLight,
    borderColor: COLORS.gold,
  },
  rewardDay: {
    fontFamily: FONTS.semibold,
    fontSize: 10,
    color: COLORS.textMuted,
  },
  rewardDayActive: {
    color: COLORS.gold,
  },
  rewardCoins: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.text,
    marginTop: 3,
  },
  rewardCoinsActive: {
    color: COLORS.text,
  },
  rewardCoinIcon: {
    marginTop: 4,
  },
  rewardTextEarned: {
    color: COLORS.textOnPrimary,
  },
});
