import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../theme/colors';
import { RADII, SHADOWS } from '../theme/layout';
import { FONTS } from '../theme/typography';
import { PressableScale } from './ui/PressableScale';

export interface ProfileHeaderProps {
  greeting: string;
  userName: string;
  avatarInitial: string;
  photoUrl?: string | null;
  onNotificationsPress: () => void;
}

export function ProfileHeader({
  greeting,
  userName,
  avatarInitial,
  photoUrl,
  onNotificationsPress,
}: ProfileHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.avatar}>
          {photoUrl ? (
            <Image source={{ uri: photoUrl }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{avatarInitial}</Text>
          )}
        </View>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
      </View>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Notifications"
        style={styles.notificationButton}
        onPress={onNotificationsPress}
        scaleTo={0.92}
      >
        <Text style={styles.bell}>🔔</Text>
        <View style={styles.notificationDot} />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 22,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.primaryLight,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontFamily: FONTS.bold,
    color: COLORS.textOnPrimary,
    fontSize: 19,
  },
  greeting: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  userName: {
    fontFamily: FONTS.bold,
    color: COLORS.text,
    fontSize: 20,
    marginTop: 2,
    letterSpacing: -0.3,
  },
  notificationButton: {
    width: 46,
    height: 46,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.surfaceWhite,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  bell: {
    fontSize: 19,
  },
  notificationDot: {
    position: 'absolute',
    right: 12,
    top: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
    borderWidth: 1.5,
    borderColor: COLORS.surfaceWhite,
  },
});
