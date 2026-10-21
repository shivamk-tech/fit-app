import React, { useRef } from 'react';
import { Animated, Pressable } from 'react-native';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface PressableScaleProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  /** Scale while pressed. */
  scaleTo?: number;
}

/** Pressable that springs down slightly on touch for tactile feedback. */
export function PressableScale({
  style,
  scaleTo = 0.97,
  onPressIn,
  onPressOut,
  children,
  ...rest
}: PressableScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const springTo = (toValue: number) =>
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      speed: 40,
      bounciness: toValue === 1 ? 6 : 0,
    }).start();

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={e => {
        springTo(scaleTo);
        onPressIn?.(e);
      }}
      onPressOut={e => {
        springTo(1);
        onPressOut?.(e);
      }}
      style={[style, { transform: [{ scale }] }]}
    >
      {children}
    </AnimatedPressable>
  );
}
