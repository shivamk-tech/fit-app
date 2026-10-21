/* eslint-env jest */
// AsyncStorage has no native implementation under Jest; use its in-memory mock.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest'),
);

// AdMob has no native implementation under Jest. Tests that exercise ad flows
// override RewardedAd.createForAdRequest with their own fake ad.
jest.mock('react-native-google-mobile-ads', () => ({
  __esModule: true,
  default: () => ({ initialize: jest.fn().mockResolvedValue([]) }),
  AdsConsent: { gatherConsent: jest.fn().mockResolvedValue({}) },
  TestIds: { REWARDED: 'test-rewarded' },
  AdEventType: { LOADED: 'loaded', ERROR: 'error', CLOSED: 'closed' },
  RewardedAdEventType: {
    LOADED: 'rewarded_loaded',
    EARNED_REWARD: 'rewarded_earned_reward',
  },
  RewardedAd: { createForAdRequest: jest.fn() },
}));
