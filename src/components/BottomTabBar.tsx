import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { AppTab } from '../types/navigation';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';

const TAB_ICONS: Record<AppTab, string> = {
  Home: '⌂',
  Workouts: '↗',
  Rewards: '✧',
  Profile: '○',
};

export interface BottomTabBarProps {
  activeTab: AppTab;
  onTabPress: (tab: AppTab) => void;
}

export function BottomTabBar({ activeTab, onTabPress }: BottomTabBarProps) {
  return (
    <View style={styles.bottomNav}>
      {(Object.keys(TAB_ICONS) as AppTab[]).map((tab) => {
        const active = activeTab === tab;
        return (
          <Pressable
            key={tab}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onTabPress(tab)}
            style={styles.navItem}
          >
            <View style={[styles.navIconWrap, active && styles.navIconActive]}>
              <Text style={[styles.navIcon, active && styles.navIconSelected]}>
                {TAB_ICONS[tab]}
              </Text>
            </View>
            <Text style={[styles.navLabel, active && styles.navLabelActive]}>
              {tab}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 9,
    paddingBottom: 5,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 66,
    paddingVertical: 2,
  },
  navIconWrap: {
    width: 43,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  navIconActive: {
    backgroundColor: COLORS.primaryLight,
  },
  navIcon: {
    fontSize: 22,
    color: COLORS.textSecondary,
  },
  navIconSelected: {
    color: COLORS.primary,
  },
  navLabel: {
    fontFamily: FONTS.medium,
    fontSize: 9,
    marginTop: 3,
    color: COLORS.textSecondary,
  },
  navLabelActive: {
    fontFamily: FONTS.semibold,
    color: COLORS.primary,
  },
});
