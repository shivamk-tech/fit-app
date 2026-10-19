import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../theme/colors';
import type { RewardsScreenProps } from '../types/navigation';
import { screenStyles } from './screenStyles';

export function RewardsScreen(_props: RewardsScreenProps) {
  return (
    <ScrollView
      removeClippedSubviews={Platform.OS === 'android'}
      contentContainerStyle={[screenStyles.content, styles.content]}
    >
      <Text style={screenStyles.pageTitle}>Your rewards</Text>
      <Text style={screenStyles.pageSubtitle}>
        Your fitness journey, one step at a time.
      </Text>
      <View style={screenStyles.pointsCard}>
        <Text style={screenStyles.pointsEyebrow}>DEMO BALANCE</Text>
        <Text style={screenStyles.pointsValue}>
          240 <Text style={screenStyles.pointsUnit}>points</Text>
        </Text>
        <Text style={screenStyles.pointsNote}>
          Reward points are for UI preview only. No real points have been earned.
        </Text>
      </View>
      <Text style={[screenStyles.sectionTitle, styles.comingHeading]}>Coming up</Text>
      <View style={screenStyles.comingCard}>
        <Text style={screenStyles.comingIcon}>🎁</Text>
        <View style={screenStyles.workoutInfo}>
          <Text style={screenStyles.workoutName}>Fitness rewards</Text>
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
  comingHeading: {
    marginBottom: 0,
  },
});
