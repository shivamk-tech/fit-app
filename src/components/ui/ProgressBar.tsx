import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { COLORS } from '../../theme/colors';

export interface ProgressBarProps {
  /** 0..1 */
  progress: number;
  height?: number;
  color?: string;
  trackColor?: string;
  style?: StyleProp<ViewStyle>;
}

/** Rounded progress bar that animates smoothly between values. */
export function ProgressBar({
  progress,
  height = 8,
  color = COLORS.primary,
  trackColor = COLORS.surface,
  style,
}: ProgressBarProps) {
  const value = useRef(new Animated.Value(0)).current;
  const clamped = Math.max(0, Math.min(1, progress || 0));

  useEffect(() => {
    // Width can't use the native driver; this is a single cheap view.
    Animated.timing(value, {
      toValue: clamped,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [clamped, value]);

  const width = value.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={[
        styles.track,
        { height, borderRadius: height / 2, backgroundColor: trackColor },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          { width, borderRadius: height / 2, backgroundColor: color },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { overflow: 'hidden' },
  fill: { height: '100%' },
});
