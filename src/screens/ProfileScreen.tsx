import React from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FadeIn } from '../components/ui/FadeIn';
import { PressableScale } from '../components/ui/PressableScale';
import { useAuth } from '../hooks/useAuth';
import { authStore } from '../services/auth';
import { COLORS } from '../theme/colors';
import { RADII } from '../theme/layout';
import { FONTS } from '../theme/typography';
import type { ProfileScreenProps } from '../types/navigation';
import { screenStyles } from './screenStyles';

const PROFILE_ITEMS = [
  { icon: '📋', label: 'My workout history' },
  { icon: '📈', label: 'Weekly activity' },
  { icon: '⚙️', label: 'Settings' },
];

function memberSince(iso: string | undefined) {
  if (!iso) return 'FitRewards member';
  const d = new Date(iso);
  return `Member since ${d.toLocaleDateString('en-IN', {
    month: 'short',
    year: 'numeric',
  })}`;
}

export function ProfileScreen(_props: ProfileScreenProps) {
  const { user } = useAuth();
  const displayName = user?.name ?? user?.email ?? 'FitRewards member';
  const initial = displayName[0]?.toUpperCase() ?? '?';

  const confirmSignOut = () =>
    Alert.alert('Sign out?', 'Your progress stays saved on this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => authStore.signOut(),
      },
    ]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={Platform.OS === 'android'}
      contentContainerStyle={screenStyles.content}
    >
      <FadeIn>
        <Text style={screenStyles.pageTitle}>Your profile</Text>
        <Text style={screenStyles.pageSubtitle}>
          Your fitness journey starts with you.
        </Text>
      </FadeIn>
      <FadeIn delay={60}>
        <View style={screenStyles.profileCard}>
          <View style={[screenStyles.profileAvatar, styles.avatarClip]}>
            {user?.photo ? (
              <Image source={{ uri: user.photo }} style={styles.avatarImage} />
            ) : (
              <Text style={screenStyles.profileAvatarText}>{initial}</Text>
            )}
          </View>
          <Text style={screenStyles.profileName}>{displayName}</Text>
          {user?.email && (
            <Text style={screenStyles.profileEmail}>{user.email}</Text>
          )}
          <View style={styles.memberPill}>
            <Text style={styles.memberText}>
              {memberSince(user?.createdAt)}
            </Text>
          </View>
        </View>
      </FadeIn>
      {PROFILE_ITEMS.map((item, i) => (
        <FadeIn key={item.label} delay={120 + i * 50}>
          <PressableScale
            style={screenStyles.comingCard}
            accessibilityRole="button"
          >
            <View style={screenStyles.rowIcon}>
              <Text style={screenStyles.comingIcon}>{item.icon}</Text>
            </View>
            <View style={screenStyles.workoutInfo}>
              <Text style={screenStyles.workoutName}>{item.label}</Text>
            </View>
            <Text style={screenStyles.arrowText}>›</Text>
          </PressableScale>
        </FadeIn>
      ))}
      <FadeIn delay={300}>
        <PressableScale
          style={styles.signOut}
          onPress={confirmSignOut}
          accessibilityRole="button"
        >
          <Text style={styles.signOutText}>Sign out</Text>
        </PressableScale>
      </FadeIn>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  avatarClip: {
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  memberPill: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.primarySoft,
  },
  memberText: {
    fontFamily: FONTS.semibold,
    color: COLORS.primary,
    fontSize: 12,
  },
  signOut: {
    marginTop: 24,
    paddingVertical: 15,
    borderRadius: RADII.md + 2,
    alignItems: 'center',
    backgroundColor: COLORS.errorLight,
  },
  signOutText: {
    fontFamily: FONTS.semibold,
    color: COLORS.error,
    fontSize: 15,
  },
});
