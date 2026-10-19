import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';
import type { StreakDay } from '../types/workout';

export interface WeeklyStreakProps {
  days: StreakDay[];
  streakLabel: string;
  footer: string;
}

export function WeeklyStreak({ days, streakLabel, footer }: WeeklyStreakProps) {
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
          const isToday = index === 3;
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
                    isToday && styles.dateLabelToday,
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
    </View>
  );
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
});
