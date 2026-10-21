import { useEffect, useState } from 'react';
import { authStore } from '../services/auth';
import type { AuthState } from '../types/auth';

/** Subscribe a component to the signed-in user. */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>(() => authStore.snapshot());

  useEffect(() => {
    const unsubscribe = authStore.subscribe(setState);
    authStore.restore();
    return unsubscribe;
  }, []);

  return state;
}
