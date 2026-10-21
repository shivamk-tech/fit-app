import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FONTS } from '../theme/typography';

/** The app currency's display name. */
export const FITCOIN = 'FitCoin';
export const FITCOINS = 'FitCoins';

const GOLD = '#F2B705';
const GOLD_RIM = '#C98A00';
const GOLD_TEXT = '#7A4F00';

/** The FitCoin badge: a gold coin stamped "FT". */
export function FitCoin({ size = 20 }: { size?: number }) {
  const rim = Math.max(1.5, size * 0.09);
  return (
    <View
      accessible
      accessibilityLabel={FITCOIN}
      style={[
        styles.coin,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: rim,
        },
      ]}
    >
      <Text
        allowFontScaling={false}
        style={[
          styles.label,
          { fontSize: size * 0.42, letterSpacing: -size * 0.02 },
        ]}
      >
        FT
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  coin: {
    backgroundColor: GOLD,
    borderColor: GOLD_RIM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: FONTS.bold,
    color: GOLD_TEXT,
    includeFontPadding: false,
    textAlign: 'center',
  },
});
