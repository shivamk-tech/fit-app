import { RewardedAd } from 'react-native-google-mobile-ads';
import { rewardEarned, watchRewardedAd } from '../src/services/rewardedAd';

type Behaviour = 'watch' | 'closeEarly' | 'loadError' | 'showError';

/** Fake rewarded ad that replays the given behaviour through its listeners. */
function fakeAd(behaviour: Behaviour) {
  const listeners: Record<string, Array<() => void>> = {};
  const fire = (type: string) => (listeners[type] ?? []).forEach(l => l());
  return {
    addAdEventListener: (type: string, cb: () => void) => {
      (listeners[type] ??= []).push(cb);
      return () => {
        listeners[type] = listeners[type].filter(l => l !== cb);
      };
    },
    load: () =>
      setTimeout(() =>
        fire(behaviour === 'loadError' ? 'error' : 'rewarded_loaded'),
      ),
    show: async () => {
      if (behaviour === 'showError') return fire('error');
      if (behaviour === 'watch') fire('rewarded_earned_reward');
      fire('closed');
    },
  };
}

const createAd = RewardedAd.createForAdRequest as jest.Mock;
const queue = (...behaviours: Behaviour[]) =>
  behaviours.forEach(b => createAd.mockReturnValueOnce(fakeAd(b)));

// Showing an ad starts preloading the next one in the background; let that
// finish before the next test so it can't take that test's fake ads.
afterEach(() => new Promise<void>(resolve => setTimeout(resolve, 0)));
beforeEach(() => createAd.mockReset());

test('watching to the end earns the reward', async () => {
  queue('watch');
  const outcome = await watchRewardedAd();
  expect(outcome).toBe('watched');
  expect(rewardEarned(outcome)).toBe(true);
});

test('closing the ad early earns nothing', async () => {
  queue('closeEarly');
  const outcome = await watchRewardedAd();
  expect(outcome).toBe('skipped');
  expect(rewardEarned(outcome)).toBe(false);
});

test('no ad available (twice) gives the reward for free', async () => {
  queue('loadError', 'loadError');
  const outcome = await watchRewardedAd();
  expect(outcome).toBe('unavailable');
  expect(rewardEarned(outcome)).toBe(true);
  expect(createAd).toHaveBeenCalledTimes(2);
});

test('retries once before giving up on loading', async () => {
  queue('loadError', 'watch');
  expect(await watchRewardedAd()).toBe('watched');
});

test('an ad that fails to show does not block the reward', async () => {
  queue('showError');
  expect(rewardEarned(await watchRewardedAd())).toBe(true);
});

test('a preloaded ad is used instead of loading a new one', async () => {
  const { preloadRewardedAd } = require('../src/services/rewardedAd');
  queue('watch');
  await preloadRewardedAd();
  expect(createAd).toHaveBeenCalledTimes(1);
  queue('watch'); // for the next preload after showing
  expect(await watchRewardedAd()).toBe('watched');
  // Showing used the preloaded ad; the only new load is the next preload.
  expect(createAd).toHaveBeenCalledTimes(2);
});
