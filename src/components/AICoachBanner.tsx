import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';

export interface AICoachBannerProps {
  onPress: () => void;
}

export function AICoachBanner({ onPress }: AICoachBannerProps) {
  return (
    <Pressable style={styles.coachBanner} onPress={onPress}>
      <View style={styles.coachContent}>
        <View style={styles.aiBadge}>
          <Text style={styles.aiBadgeText}>✦ YOUR PERSONAL AI COACH</Text>
        </View>
        <Text style={styles.coachTitle}>
          Your goals.{ '\n' }Your workout.
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
}

const styles = StyleSheet.create({
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
    fontFamily: FONTS.bold,
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
    backgroundColor: '#B9D3E6',
    position: 'absolute',
    right: -28,
    bottom: 2,
  },
  coachEmoji: {
    fontSize: 52,
    zIndex: 1,
  },
});
