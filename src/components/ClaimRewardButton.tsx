import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useAdClaim } from '../hooks/useAdClaim';
import type { AdClaim } from '../hooks/useAdClaim';
import { COLORS } from '../theme/colors';
import { RADII, SHADOWS } from '../theme/layout';
import { FONTS } from '../theme/typography';
import { FitCoin, FITCOINS } from './FitCoin';
import { PressableScale } from './ui/PressableScale';

export interface ClaimRewardButtonProps {
  coins: number;
  /** Pays the reward; called only after the ad (or when no ad is available). */
  onClaim: () => unknown;
  /** Verb shown on the button, e.g. "Claim" or "Check in". */
  action?: string;
  /** Share an ad flow with other triggers (see useAdClaim). */
  claim?: AdClaim;
}

/** "▶ Watch ad · Claim +X FitCoins" — plays a rewarded ad, then pays. */
export function ClaimRewardButton({
  coins,
  onClaim,
  action = 'Claim',
  claim,
}: ClaimRewardButtonProps) {
  const own = useAdClaim();
  const { run, loading, skipped } = claim ?? own;

  return (
    <View>
      <PressableScale
        style={[styles.button, loading && styles.buttonLoading]}
        onPress={() => run(onClaim)}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel={`Watch an ad to ${action.toLowerCase()} for ${coins} ${FITCOINS}`}
        accessibilityState={{ busy: loading }}
      >
        {loading ? (
          <>
            <ActivityIndicator color={COLORS.text} />
            <Text style={styles.text}>Loading ad…</Text>
          </>
        ) : (
          <>
            <View style={styles.play}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
            <Text style={styles.text}>
              Watch ad · {action} +{coins}
            </Text>
            <FitCoin size={18} />
          </>
        )}
      </PressableScale>
      {skipped && (
        <Text style={styles.hint}>
          Watch the full ad to get your FitCoins. Tap to try again.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 14,
    paddingVertical: 14,
    borderRadius: RADII.md,
    backgroundColor: COLORS.gold,
    ...SHADOWS.card,
  },
  buttonLoading: {
    opacity: 0.85,
  },
  play: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    color: COLORS.gold,
    fontSize: 10,
    marginLeft: 2,
  },
  text: {
    fontFamily: FONTS.bold,
    color: COLORS.text,
    fontSize: 15,
  },
  hint: {
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});
