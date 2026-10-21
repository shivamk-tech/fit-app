import { useCallback, useRef, useState } from 'react';
import { rewardEarned, watchRewardedAd } from '../services/rewardedAd';

export interface AdClaim {
  /** Play a rewarded ad, then call `pay` if the reward was earned. */
  run: (pay: () => unknown) => Promise<void>;
  loading: boolean;
  /** The last ad was closed before the end, so nothing was paid. */
  skipped: boolean;
}

/**
 * Rewarded-ad claim flow, shareable between several triggers (e.g. today's
 * streak circle and the claim button) so they show one loading state.
 *  - watched to the end → paid
 *  - no ad available    → paid for free
 *  - closed early       → not paid (`skipped`)
 */
export function useAdClaim(): AdClaim {
  const [loading, setLoading] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const busy = useRef(false);

  const run = useCallback(async (pay: () => unknown) => {
    if (busy.current) return;
    busy.current = true;
    setLoading(true);
    setSkipped(false);
    try {
      const outcome = await watchRewardedAd();
      if (rewardEarned(outcome)) {
        await pay();
      } else {
        setSkipped(true);
      }
    } finally {
      busy.current = false;
      setLoading(false);
    }
  }, []);

  return { run, loading, skipped };
}
