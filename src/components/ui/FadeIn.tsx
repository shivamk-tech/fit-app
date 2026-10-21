import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

export interface FadeInProps {
  children: React.ReactNode;
  /** Delay in ms, used to stagger a list of sections. */
  delay?: number;
  /** Distance in px the content rises while fading in. */
  offset?: number;
  style?: StyleProp<ViewStyle>;
}

/** Fades and slides its children up once on mount. */
export function FadeIn({
  children,
  delay = 0,
  offset = 14,
  style,
}: FadeInProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 450,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [delay, progress]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [offset, 0],
  });

  return (
    <Animated.View
      style={[style, { opacity: progress, transform: [{ translateY }] }]}
    >
      {children}
    </Animated.View>
  );
}
