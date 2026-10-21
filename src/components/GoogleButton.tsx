import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../theme/colors';
import { RADII, SHADOWS } from '../theme/layout';
import { FONTS } from '../theme/typography';
import { PressableScale } from './ui/PressableScale';

/**
 * Approximation of the Google "G" drawn with Views (no SVG dependency).
 * Swap for the official asset from Google's branding guidelines before release.
 */
function GoogleG() {
  return (
    <View style={g.box}>
      <View style={g.ring} />
      <View style={g.gap} />
      <View style={g.bar} />
    </View>
  );
}

export interface GoogleButtonProps {
  onPress: () => void;
  loading?: boolean;
  label?: string;
}

/** One button for both sign-in and sign-up. */
export function GoogleButton({
  onPress,
  loading = false,
  label = 'Continue with Google',
}: GoogleButtonProps) {
  return (
    <PressableScale
      style={styles.button}
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ busy: loading, disabled: loading }}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.primary} />
      ) : (
        <>
          <GoogleG />
          <Text style={styles.label}>{label}</Text>
        </>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderRadius: RADII.md + 2,
    backgroundColor: COLORS.surfaceWhite,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  label: {
    fontFamily: FONTS.semibold,
    fontSize: 16,
    color: COLORS.text,
  },
});

const G_SIZE = 20;
const G_STROKE = 4;
const g = StyleSheet.create({
  box: { width: G_SIZE, height: G_SIZE },
  ring: {
    width: G_SIZE,
    height: G_SIZE,
    borderRadius: G_SIZE / 2,
    borderWidth: G_STROKE,
    borderTopColor: '#EA4335',
    borderRightColor: '#4285F4',
    borderBottomColor: '#34A853',
    borderLeftColor: '#FBBC05',
  },
  // Opens the ring at the upper right to form the "G".
  gap: {
    position: 'absolute',
    right: -1,
    top: 1,
    width: G_SIZE / 2 - 1,
    height: G_SIZE / 2 - 2,
    backgroundColor: COLORS.surfaceWhite,
  },
  bar: {
    position: 'absolute',
    left: G_SIZE / 2 - 0.5,
    top: G_SIZE / 2 - G_STROKE / 2,
    width: G_SIZE / 2 + 0.5,
    height: G_STROKE,
    backgroundColor: '#4285F4',
  },
});
