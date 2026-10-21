/**
 * Rewarded ads gate every coin reward (step goal, streak bonus).
 *
 * Rules:
 *  - Watched to the end            → reward is paid.
 *  - Closed before the end         → nothing is paid; the user can try again.
 *  - No ad available (no fill,
 *    offline, timeout, SDK error)  → reward is paid for free, so users are
 *                                     never blocked by a missing ad.
 *
 * NOTE: the "watched" signal comes from the device and can be spoofed. Once
 * the backend exists, switch to AdMob server-side verification (SSV) and let
 * the server pay the coins.
 */
import mobileAds, {
  AdEventType,
  AdsConsent,
  RewardedAd,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';
import { AD_LOAD_TIMEOUT_MS, REWARDED_AD_UNIT_ID } from '../config/ads';

export type AdOutcome = 'watched' | 'skipped' | 'unavailable';

let initPromise: Promise<void> | null = null;

/**
 * Ask for consent where required (EEA/UK) and start the SDK. Idempotent.
 * Failures are swallowed: no consent form / no init just means no ads,
 * and rewards are then given for free.
 */
export function initAds(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      try {
        await AdsConsent.gatherConsent();
      } catch {
        /* no consent config yet (test mode) or offline */
      }
      try {
        await mobileAds().initialize();
      } catch {
        /* treated as "no ad available" later */
      }
    })();
  }
  return initPromise;
}

/** Load one rewarded ad, or null if none is available in time. Never throws. */
function loadRewardedAd(): Promise<RewardedAd | null> {
  return new Promise(resolve => {
    let done = false;
    let unsubs: Array<() => void> = [];
    let timer: ReturnType<typeof setTimeout> | undefined;
    const finish = (result: RewardedAd | null) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      unsubs.forEach(u => u());
      resolve(result);
    };
    try {
      const ad = RewardedAd.createForAdRequest(REWARDED_AD_UNIT_ID);
      timer = setTimeout(() => finish(null), AD_LOAD_TIMEOUT_MS);
      unsubs = [
        ad.addAdEventListener(RewardedAdEventType.LOADED, () => finish(ad)),
        ad.addAdEventListener(AdEventType.ERROR, () => finish(null)),
      ];
      ad.load();
    } catch {
      finish(null);
    }
  });
}

/** Show a loaded ad and report whether the user earned the reward. */
function presentRewardedAd(ad: RewardedAd): Promise<AdOutcome> {
  return new Promise(resolve => {
    let earned = false;
    const unsubs: Array<() => void> = [];
    const finish = (outcome: AdOutcome) => {
      unsubs.forEach(u => u());
      resolve(outcome);
    };
    unsubs.push(
      ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
        earned = true;
      }),
      ad.addAdEventListener(AdEventType.CLOSED, () =>
        finish(earned ? 'watched' : 'skipped'),
      ),
      // Failed to show after loading: same as no ad, don't block the user.
      ad.addAdEventListener(AdEventType.ERROR, () => finish('unavailable')),
    );
    ad.show().catch(() => finish('unavailable'));
  });
}

// Loaded rewarded ads expire after an hour; refresh a bit earlier.
const PRELOAD_MAX_AGE_MS = 50 * 60_000;
let preloaded: { ad: RewardedAd; at: number } | null = null;
let preloading: Promise<void> | null = null;

/**
 * Load an ad in the background (e.g. when a claim button appears) so it
 * shows instantly when tapped. Safe to call often.
 */
export function preloadRewardedAd(): Promise<void> {
  if (preloaded && Date.now() - preloaded.at < PRELOAD_MAX_AGE_MS) {
    return Promise.resolve();
  }
  if (!preloading) {
    preloading = (async () => {
      await initAds();
      const ad = await loadRewardedAd();
      preloaded = ad ? { ad, at: Date.now() } : null;
    })()
      .catch(() => {
        preloaded = null;
      })
      .finally(() => {
        preloading = null;
      });
  }
  return preloading;
}

/** Take the preloaded ad if it is still fresh (each ad can be shown once). */
async function takePreloadedAd(): Promise<RewardedAd | null> {
  if (preloading) await preloading;
  const entry = preloaded;
  preloaded = null;
  return entry && Date.now() - entry.at < PRELOAD_MAX_AGE_MS ? entry.ad : null;
}

/** Show a rewarded ad: the preloaded one, else load (retrying once). */
export async function watchRewardedAd(): Promise<AdOutcome> {
  await initAds();
  const ad =
    (await takePreloadedAd()) ??
    (await loadRewardedAd()) ??
    (await loadRewardedAd());
  if (!ad) return 'unavailable';
  const outcome = await presentRewardedAd(ad);
  preloadRewardedAd(); // get the next one ready (e.g. steps after check-in)
  return outcome;
}

/** True when the reward should be paid for this outcome. */
export function rewardEarned(outcome: AdOutcome): boolean {
  return outcome !== 'skipped';
}
