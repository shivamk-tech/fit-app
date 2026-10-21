/**
 * AdMob configuration.
 *
 * Development builds always use Google's official test ad units, which work
 * without an AdMob account. Release builds use the real IDs:
 *  - Android: real app ID (app.json) and ad unit (below) are set.
 *  - iOS: still Google's sample IDs — add the iOS app in AdMob, then
 *    replace ios_app_id in app.json and the ios unit below.
 * Never show real ads in development — clicking your own ads can get the
 * AdMob account suspended.
 */
import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

// Real rewarded ad units ("Daily check in" in AdMob). iOS: TODO once the
// iOS app exists in AdMob.
const PRODUCTION_REWARDED_UNIT = Platform.select({
  android: 'ca-app-pub-4970387894307683/3579749328',
  ios: '',
  default: '',
});

export const REWARDED_AD_UNIT_ID =
  __DEV__ || !PRODUCTION_REWARDED_UNIT
    ? TestIds.REWARDED
    : PRODUCTION_REWARDED_UNIT;

/**
 * How long to wait for an ad to load (tried twice) before giving the reward
 * for free.
 */
export const AD_LOAD_TIMEOUT_MS = 7_000;
