import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { AppTab } from '../../types/navigation';

const STROKE = 2;

/**
 * Simple line icons drawn with Views so they can be tinted without
 * adding an icon-font dependency (which would need a native rebuild).
 */
export function TabIcon({ tab, color }: { tab: AppTab; color: string }) {
  switch (tab) {
    case 'Home':
      return (
        <View style={styles.box}>
          <View style={[styles.roof, { borderColor: color }]} />
          <View style={[styles.house, { borderColor: color }]} />
        </View>
      );
    case 'Workouts':
      return (
        <View style={[styles.box, styles.row]}>
          <View style={[styles.plate, { backgroundColor: color }]} />
          <View style={[styles.bar, { backgroundColor: color }]} />
          <View style={[styles.plate, { backgroundColor: color }]} />
        </View>
      );
    case 'Rewards':
      return (
        <View style={styles.box}>
          <View style={[styles.coin, { borderColor: color }]}>
            <View style={[styles.coinInner, { borderColor: color }]} />
          </View>
        </View>
      );
    case 'Profile':
      return (
        <View style={styles.box}>
          <View style={[styles.head, { borderColor: color }]} />
          <View style={[styles.body, { borderColor: color }]} />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  box: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row' },
  // Home: a rotated square showing only two edges forms the roof.
  roof: {
    position: 'absolute',
    top: 4,
    width: 13,
    height: 13,
    borderTopWidth: STROKE,
    borderLeftWidth: STROKE,
    borderTopLeftRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  house: {
    position: 'absolute',
    top: 10,
    width: 13,
    height: 10,
    borderLeftWidth: STROKE,
    borderRightWidth: STROKE,
    borderBottomWidth: STROKE,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  // Workouts: dumbbell
  plate: { width: 5, height: 14, borderRadius: 2 },
  bar: { width: 9, height: STROKE + 1, borderRadius: 1 },
  // Rewards: coin
  coin: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: STROKE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinInner: { width: 8, height: 8, borderRadius: 4, borderWidth: STROKE },
  // Profile: head + shoulders
  head: {
    position: 'absolute',
    top: 1,
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: STROKE,
  },
  body: {
    position: 'absolute',
    top: 12,
    width: 17,
    height: 9,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    borderTopWidth: STROKE,
    borderLeftWidth: STROKE,
    borderRightWidth: STROKE,
  },
});
