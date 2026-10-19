import { StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';

export const screenStyles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 30,
  },
  pageTitle: {
    fontFamily: FONTS.bold,
    color: COLORS.text,
    fontSize: 31,
    lineHeight: 37,
    letterSpacing: -0.8,
  },
  pageSubtitle: {
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
  },
  sectionTitle: {
    fontFamily: FONTS.semibold,
    fontSize: 17,
    color: COLORS.text,
  },
  workoutList: {
    marginTop: 25,
  },
  pointsCard: {
    backgroundColor: COLORS.primaryLight,
    padding: 22,
    borderRadius: 22,
    marginTop: 25,
    marginBottom: 28,
  },
  pointsEyebrow: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
  },
  pointsValue: {
    color: COLORS.text,
    fontSize: 35,
    fontFamily: FONTS.bold,
    marginTop: 8,
  },
  pointsUnit: {
    color: COLORS.primary,
    fontSize: 15,
  },
  pointsNote: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 10,
  },
  comingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
    marginTop: 12,
  },
  comingIcon: {
    fontSize: 27,
    marginRight: 12,
  },
  workoutInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 5,
  },
  workoutName: {
    fontFamily: FONTS.semibold,
    color: COLORS.text,
    fontSize: 12,
  },
  workoutDetail: {
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 5,
    lineHeight: 15,
  },
  arrowText: {
    color: COLORS.primary,
    fontSize: 23,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 25,
    marginTop: 25,
    marginBottom: 15,
  },
  profileAvatar: {
    width: 76,
    height: 76,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryLight,
  },
  profileAvatarText: {
    color: COLORS.primary,
    fontSize: 32,
    fontFamily: FONTS.bold,
  },
  profileName: {
    color: COLORS.text,
    fontSize: 19,
    fontFamily: FONTS.bold,
    marginTop: 12,
  },
  profileEmail: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 5,
  },
});
