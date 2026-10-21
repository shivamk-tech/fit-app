import React, { useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleButton } from '../components/GoogleButton';
import { FadeIn } from '../components/ui/FadeIn';
import { authStore } from '../services/auth';
import { COLORS } from '../theme/colors';
import { RADII, SHADOWS } from '../theme/layout';
import { FONTS } from '../theme/typography';

const FEATURES = [
  {
    icon: '👟',
    title: 'Earn FitCoins for steps',
    detail: '100 FitCoins for 10,000 steps a day',
  },
  {
    icon: '🔥',
    title: 'Daily check-in streak',
    detail: 'Up to 70 FitCoins a day',
  },
  {
    icon: '🏋️',
    title: 'Guided workouts',
    detail: 'Short sessions, no equipment',
  },
];

export function WelcomeScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const continueWithGoogle = async () => {
    setError(null);
    setLoading(true);
    const result = await authStore.continueWithGoogle();
    // On success the navigator swaps to the app, unmounting this screen.
    if (!result.ok) {
      setLoading(false);
      if (!result.cancelled) setError(result.message);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.hero} edges={['top', 'left', 'right']}>
        <View style={[styles.orb, styles.orbLarge]} />
        <View style={[styles.orb, styles.orbSmall]} />

        <FadeIn>
          <View style={styles.logo}>
            <Text style={styles.logoEmoji}>⚡</Text>
          </View>
          <Text style={styles.brand}>FitRewards</Text>
          <Text style={styles.tagline}>
            Move more.{'\n'}Get rewarded for it.
          </Text>
        </FadeIn>

        <View style={styles.features}>
          {FEATURES.map((f, i) => (
            <FadeIn key={f.title} delay={120 + i * 80} style={styles.feature}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureEmoji}>{f.icon}</Text>
              </View>
              <View>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDetail}>{f.detail}</Text>
              </View>
            </FadeIn>
          ))}
        </View>
      </SafeAreaView>

      <FadeIn delay={300} offset={30}>
        <SafeAreaView style={styles.sheet} edges={['bottom', 'left', 'right']}>
          <Text style={styles.sheetTitle}>Get started</Text>
          <Text style={styles.sheetSubtitle}>
            Sign in or create your account in one tap.
          </Text>

          <GoogleButton onPress={continueWithGoogle} loading={loading} />

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Text style={styles.legal}>
            New to FitRewards? The same button creates your account.
          </Text>
        </SafeAreaView>
      </FadeIn>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  hero: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 32,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: RADII.pill,
    backgroundColor: COLORS.textOnPrimary,
  },
  orbLarge: {
    width: 320,
    height: 320,
    right: -140,
    top: -100,
    opacity: 0.07,
  },
  orbSmall: {
    width: 180,
    height: 180,
    left: -90,
    bottom: 20,
    opacity: 0.05,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: RADII.lg,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: { fontSize: 30 },
  brand: {
    fontFamily: FONTS.semibold,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginTop: 20,
  },
  tagline: {
    fontFamily: FONTS.bold,
    color: COLORS.textOnPrimary,
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: -1,
    marginTop: 6,
  },
  features: {
    marginTop: 36,
    gap: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  featureIcon: {
    width: 46,
    height: 46,
    borderRadius: RADII.md,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureEmoji: { fontSize: 22 },
  featureTitle: {
    fontFamily: FONTS.semibold,
    color: COLORS.textOnPrimary,
    fontSize: 15,
  },
  featureDetail: {
    fontFamily: FONTS.regular,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 2,
  },
  sheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADII.xl + 4,
    borderTopRightRadius: RADII.xl + 4,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 16,
    ...SHADOWS.raised,
  },
  sheetTitle: {
    fontFamily: FONTS.bold,
    color: COLORS.text,
    fontSize: 24,
    letterSpacing: -0.5,
  },
  sheetSubtitle: {
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 22,
  },
  errorBox: {
    backgroundColor: COLORS.errorLight,
    borderRadius: RADII.md,
    padding: 12,
    marginTop: 14,
  },
  errorText: {
    fontFamily: FONTS.medium,
    color: COLORS.error,
    fontSize: 13,
    lineHeight: 19,
  },
  legal: {
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 18,
  },
});
