import { StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';
import { CARD, RADII, SHADOWS } from '../theme/layout';
import { FONTS } from '../theme/typography';

export const screenStyles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  pageTitle: {
    fontFamily: FONTS.bold,
    color: COLORS.text,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.8,
  },
  pageSubtitle: {
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  workoutList: {
    marginTop: 24,
  },
  // Balance hero (Rewards). Inner view clips decorations; outer keeps the shadow.
  pointsCardShadow: {
    borderRadius: RADII.xl,
    backgroundColor: COLORS.primary,
    marginTop: 24,
    marginBottom: 8,
    ...SHADOWS.raised,
  },
  pointsCard: {
    padding: 22,
    borderRadius: RADII.xl,
    overflow: 'hidden',
  },
  pointsOrb: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    right: -60,
    top: -80,
    backgroundColor: COLORS.textOnPrimary,
    opacity: 0.08,
  },
  pointsEyebrow: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
  },
  pointsValue: {
    color: COLORS.textOnPrimary,
    fontSize: 42,
    fontFamily: FONTS.bold,
    letterSpacing: -1,
    marginTop: 6,
  },
  pointsUnit: {
    color: 'rgba(255,255,255,0.8)',
    fontFamily: FONTS.semibold,
    fontSize: 16,
    letterSpacing: 0,
  },
  pointsNote: {
    fontFamily: FONTS.regular,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    lineHeight: 18,
  },
  pointsStatRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  pointsStat: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: RADII.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  pointsStatValue: {
    fontFamily: FONTS.bold,
    color: COLORS.textOnPrimary,
    fontSize: 17,
  },
  // Generic white list row
  comingCard: {
    ...CARD,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginTop: 12,
  },
  rowIcon: {
    width: 44,
    height: 44,
    borderRadius: RADII.md,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingIcon: {
    fontSize: 22,
  },
  workoutInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  workoutName: {
    fontFamily: FONTS.semibold,
    color: COLORS.text,
    fontSize: 14,
  },
  workoutDetail: {
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 3,
    lineHeight: 17,
  },
  arrowText: {
    color: COLORS.textMuted,
    fontSize: 22,
  },
  profileCard: {
    ...CARD,
    alignItems: 'center',
    paddingVertical: 26,
    marginTop: 24,
    marginBottom: 12,
  },
  profileAvatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderWidth: 4,
    borderColor: COLORS.primaryLight,
  },
  profileAvatarText: {
    color: COLORS.textOnPrimary,
    fontSize: 32,
    fontFamily: FONTS.bold,
  },
  profileName: {
    color: COLORS.text,
    fontSize: 20,
    fontFamily: FONTS.bold,
    marginTop: 14,
  },
  profileEmail: {
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
});
