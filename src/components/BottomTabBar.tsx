import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { AppTab } from '../types/navigation';
import { COLORS } from '../theme/colors';
import { RADII, SHADOWS } from '../theme/layout';
import { FONTS } from '../theme/typography';
import { TabIcon } from './ui/TabIcon';

const TABS: AppTab[] = ['Home', 'Workouts', 'Rewards', 'Profile'];

export interface BottomTabBarProps {
  activeTab: AppTab;
  onTabPress: (tab: AppTab) => void;
}

function TabItem({
  tab,
  active,
  onPress,
}: {
  tab: AppTab;
  active: boolean;
  onPress: () => void;
}) {
  const progress = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: active ? 1 : 0,
      useNativeDriver: true,
      speed: 18,
      bounciness: 8,
    }).start();
  }, [active, progress]);

  const pillScale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });
  const iconLift = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -1],
  });
  const color = active ? COLORS.primary : COLORS.textMuted;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={tab}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={styles.navItem}
      hitSlop={6}
    >
      <View style={styles.iconWrap}>
        <Animated.View
          style={[
            styles.pill,
            { opacity: progress, transform: [{ scale: pillScale }] },
          ]}
        />
        <Animated.View style={{ transform: [{ translateY: iconLift }] }}>
          <TabIcon tab={tab} color={color} />
        </Animated.View>
      </View>
      <Text style={[styles.label, active && styles.labelActive]}>{tab}</Text>
    </Pressable>
  );
}

export function BottomTabBar({ activeTab, onTabPress }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {TABS.map(tab => (
        <TabItem
          key={tab}
          tab={tab}
          active={activeTab === tab}
          onPress={() => onTabPress(tab)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
    backgroundColor: COLORS.surfaceWhite,
    borderTopLeftRadius: RADII.xl,
    borderTopRightRadius: RADII.xl,
    ...SHADOWS.raised,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 68,
  },
  iconWrap: {
    width: 52,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    ...StyleSheet.absoluteFill,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.primaryLight,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    marginTop: 4,
    color: COLORS.textMuted,
  },
  labelActive: {
    fontFamily: FONTS.semibold,
    color: COLORS.primary,
  },
});
