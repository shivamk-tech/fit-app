import { useEffect, useState } from 'react';
import { stepTracker } from '../services/stepTracker';
import type { StepSnapshot } from '../types/steps';

/**
 * Subscribe a component to live step / coin data.
 * The tracker is a singleton, so many components can use this cheaply.
 */
export function useStepTracker(): StepSnapshot & {
  addSteps: (count: number) => void;
  connectHealthConnect: () => Promise<void>;
  claimStepGoal: () => number;
} {
  const [snapshot, setSnapshot] = useState<StepSnapshot>(() =>
    stepTracker.snapshot(),
  );

  useEffect(() => {
    const unsubscribe = stepTracker.subscribe(setSnapshot);
    stepTracker.start().catch(() => {
      /* surfaced via snapshot.source === 'unavailable' */
    });
    return unsubscribe;
  }, []);

  return {
    ...snapshot,
    addSteps: count => stepTracker.addSteps(count),
    connectHealthConnect: () => stepTracker.connectHealthConnect(),
    claimStepGoal: () => stepTracker.claimStepGoal(),
  };
}
