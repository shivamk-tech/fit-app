import React, { useEffect } from 'react';
import { AppNavigator } from './src/navigation/AppNavigator';
import { stepTracker } from './src/services/stepTracker';

export default function App() {
  // Start counting steps as soon as the app opens so no steps are missed
  // while the user is on a screen that doesn't show the counter.
  useEffect(() => {
    stepTracker.start().catch(() => {});
  }, []);

  return <AppNavigator />;
}
