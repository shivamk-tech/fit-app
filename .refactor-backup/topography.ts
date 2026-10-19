
export const FONTS = {
  regular: 'Switzer-Regular',
  medium: 'Switzer-Medium',
  semibold: 'Switzer-Semibold',
  bold: 'Switzer-Bold',
} as const;

export const TYPOGRAPHY = {
  heading: {
    fontFamily: FONTS.bold,
  },
  subheading: {
    fontFamily: FONTS.semibold,
  },
  body: {
    fontFamily: FONTS.regular,
  },
  label: {
    fontFamily: FONTS.medium,
  },
  button: {
    fontFamily: FONTS.semibold,
  },
} as const;
