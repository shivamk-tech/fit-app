import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../theme/colors';
import { RADII, SHADOWS } from '../../theme/layout';
import { FONTS } from '../../theme/typography';
import { PressableScale } from './PressableScale';

export interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
  backLabel?: string;
}

/** Back button + centered title used by the stacked workout screens. */
export function ScreenHeader({
  title,
  onBack,
  backLabel = 'Go back',
}: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <PressableScale
        onPress={onBack}
        style={styles.backButton}
        scaleTo={0.9}
        accessibilityRole="button"
        accessibilityLabel={backLabel}
        hitSlop={8}
      >
        <Text style={styles.backText}>‹</Text>
      </PressableScale>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.surfaceWhite,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  backText: {
    color: COLORS.text,
    fontSize: 28,
    lineHeight: 30,
    marginRight: 2,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 13,
    fontFamily: FONTS.semibold,
    marginHorizontal: 12,
  },
  spacer: { width: 42 },
});
