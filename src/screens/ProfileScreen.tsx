import React from 'react';
import { Platform, ScrollView, Text, View } from 'react-native';
import type { ProfileScreenProps } from '../types/navigation';
import { screenStyles } from './screenStyles';

const PROFILE_ITEMS = ['My workout history', 'Weekly activity', 'Settings'];

export function ProfileScreen(_props: ProfileScreenProps) {
  return (
    <ScrollView
      removeClippedSubviews={Platform.OS === 'android'}
      contentContainerStyle={screenStyles.content}
    >
      <Text style={screenStyles.pageTitle}>Your profile</Text>
      <Text style={screenStyles.pageSubtitle}>
        Your fitness journey starts with you.
      </Text>
      <View style={screenStyles.profileCard}>
        <View style={screenStyles.profileAvatar}>
          <Text style={screenStyles.profileAvatarText}>S</Text>
        </View>
        <Text style={screenStyles.profileName}>Shivam</Text>
        <Text style={screenStyles.profileEmail}>FitRewards member</Text>
      </View>
      {PROFILE_ITEMS.map((item) => (
        <View key={item} style={screenStyles.comingCard}>
          <Text style={screenStyles.workoutName}>{item}</Text>
          <Text style={screenStyles.arrowText}>›</Text>
        </View>
      ))}
    </ScrollView>
  );
}
