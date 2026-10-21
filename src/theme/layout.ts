import { Platform } from 'react-native';
import type { ViewStyle } from 'react-native';
import { COLORS } from './colors';

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
} as const;

export const RADII = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 26,
  pill: 999,
} as const;

function shadow(
  elevation: number,
  opacity: number,
  radius: number,
  y: number,
): ViewStyle {
  return Platform.select<ViewStyle>({
    ios: {
      shadowColor: COLORS.shadow,
      shadowOpacity: opacity,
      shadowRadius: radius,
      shadowOffset: { width: 0, height: y },
    },
    default: { elevation, shadowColor: COLORS.shadow },
  });
}

export const SHADOWS = {
  /** Resting cards. */
  card: shadow(2, 0.06, 14, 6),
  /** Hero cards, primary buttons, the tab bar. */
  raised: shadow(8, 0.14, 20, 10),
} as const;

/** Standard white card on the off-white canvas. */
export const CARD: ViewStyle = {
  backgroundColor: COLORS.surfaceWhite,
  borderRadius: RADII.lg,
  padding: SPACING.lg + 2,
  ...SHADOWS.card,
};
