import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { STREAK_REWARD_TABLE } from '../services/streakRewards';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';
import type { StreakDay } from '../types/workout';

export interface WeeklyStreakProps {
  days: StreakDay[];
  streakLabel: string;
  footer: string;
  /**
   * Position (1..7) in the reward cycle that is currently active.
   * When `todayClaimed` is true this day has been paid; otherwise it's the
   * day the user will earn by working out today.
   */
  rewardDayIndex: number;
  todayClaimed: boolean;
}

export function WeeklyStreak({
  days,
  streakLabel,
  footer,
  rewardDayIndex,
  todayClaimed,
}: WeeklyStreakProps) {
  const rewardFooter = buildRewardFooter(rewardDayIndex, todayClaimed);

  return (
    <View style={styles.streakCard}>
      <View style={styles.streakHeader}>
        <View>
          <Text style={styles.cardEyebrow}>YOUR CONSISTENCY</Text>
          <Text style={styles.streakTitle}>Weekly streak 🔥</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakBadgeText}>{streakLabel}</Text>
        </View>
      </View>

      <View style={styles.daysRow}>
        {days.map((item, index) => {
          const isToday = item.isToday ?? index === days.length - 1;
          return (
            <View key={`${item.day}-${index}`} style={styles.dayItem}>
              <Text style={styles.dayLabel}>{item.day}</Text>
              <View
                style={[
                  styles.dayCircle,
                  item.done && styles.dayCircleDone,
                  isToday && styles.dayCircleToday,
                ]}
              >
                <Text
                  style={[
                    styles.dateLabel,
                    item.done && styles.dateLabelDone,
                    isToday && !item.done && styles.dateLabelToday,
                  ]}
                >
                  {item.done ? '✓' : item.date}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
      <Text style={styles.streakFooter}>{footer}</Text>

      {/* ── Daily streak rewards ── */}
      <View style={styles.rewardHeader}>
        <Text style={styles.cardEyebrow}>DAILY STREAK BONUS</Text>
        <Text style={styles.rewardHint}>repeats every 7 days</Text>
      </View>
      <View style={styles.rewardRow}>
        {STREAK_REWARD_TABLE.map((coins, i) => {
          const day = i + 1;
          const isCurrent = day === rewardDayIndex;
          const isEarned = day < rewardDayIndex || (isCurrent && todayClaimed);
          return (
            <View
              key={day}
              style={[
                styles.rewardChip,
                isEarned && styles.rewardChipEarned,
                isCurrent && styles.rewardChipCurrent,
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
              {!isEarned && <Text style={styles.rewardCoinIcon}>🪙</Text>}
            </View>
          );
        })}
      </View>
      <Text style={styles.streakFooter}>{rewardFooter}</Text>
    </View>
  );
}

function buildRewardFooter(dayIndex: number, claimed: boolean): string {
  if (dayIndex <= 0) {
    return `Complete a workout today to earn ${STREAK_REWARD_TABLE[0]} coins (Day 1).`;
  }
  const coins = STREAK_REWARD_TABLE[dayIndex - 1];
  if (claimed) {
    const next = dayIndex % STREAK_REWARD_TABLE.length;
    const nextCoins = STREAK_REWARD_TABLE[next];
    return `Day ${dayIndex} bonus earned: +${coins} coins. Come back tomorrow for ${nextCoins}.`;
  }
  return `Work out today to earn your Day ${dayIndex} bonus: ${coins} coins.`;
}

const styles = StyleSheet.create({
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
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  rewardHint: {
    fontFamily: FONTS.regular,
    fontSize: 9,
    color: COLORS.textMuted,
  },
  rewardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 4,
  },
  rewardChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rewardChipEarned: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  rewardChipCurrent: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  rewardDay: {
    fontFamily: FONTS.bold,
    fontSize: 9,
    color: COLORS.textMuted,
  },
  rewardDayActive: {
    color: COLORS.primary,
  },
  rewardCoins: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: COLORS.text,
    marginTop: 3,
  },
  rewardCoinsActive: {
    color: COLORS.primary,
  },
  rewardTextEarned: {
    color: COLORS.background,
  },
  rewardCoinIcon: {
    fontSize: 9,
    marginTop: 1,
  },
});
