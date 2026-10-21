/**
 * Auth store: Google sign-in / sign-up and the persisted signed-in user.
 *
 * Google has no separate "sign up" step — the first successful sign-in for an
 * account creates the user (here locally, later on the backend), and every
 * later sign-in just restores it. So one button covers both.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  isCancelledResponse,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_WEB_CLIENT_ID,
  isGoogleConfigured,
} from '../config/auth';
import type { AuthState, AuthUser, SignInResult } from '../types/auth';
import { authenticateWithGoogle } from './api';

const USER_KEY = '@fitrewards/auth_user';
/** Every account that has ever signed in on this device, keyed by Google ID. */
const KNOWN_ACCOUNTS_KEY = '@fitrewards/known_accounts';

type Listener = (state: AuthState) => void;

let configured = false;
function ensureConfigured() {
  if (configured) return;
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID || undefined,
    iosClientId: GOOGLE_IOS_CLIENT_ID || undefined,
    scopes: ['profile', 'email'],
  });
  configured = true;
}

async function loadKnownAccounts(): Promise<Record<string, string>> {
  try {
    const raw = await AsyncStorage.getItem(KNOWN_ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function describeError(error: unknown): string {
  if (isErrorWithCode(error)) {
    switch (error.code) {
      case statusCodes.IN_PROGRESS:
        return 'Sign-in is already in progress.';
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        return 'Google Play Services is missing or out of date on this device.';
      // DEVELOPER_ERROR (10) means the OAuth clients don't match this build.
      case '10':
      case 'DEVELOPER_ERROR':
        return 'Google Sign-In is misconfigured (check the client IDs and SHA-1).';
    }
    return error.message || `Google Sign-In failed (${error.code}).`;
  }
  return error instanceof Error ? error.message : 'Google Sign-In failed.';
}

class AuthStore {
  private state: AuthState = { status: 'restoring', user: null };
  private listeners = new Set<Listener>();
  private restorePromise: Promise<void> | null = null;

  snapshot(): AuthState {
    return this.state;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /** Load the persisted user on app start. Idempotent. */
  restore(): Promise<void> {
    if (!this.restorePromise) {
      this.restorePromise = (async () => {
        let user: AuthUser | null = null;
        try {
          const raw = await AsyncStorage.getItem(USER_KEY);
          user = raw ? (JSON.parse(raw) as AuthUser) : null;
        } catch {
          user = null;
        }
        this.set(
          user
            ? { status: 'signedIn', user }
            : { status: 'signedOut', user: null },
        );
      })();
    }
    return this.restorePromise;
  }

  /** Signs in, or signs up if this Google account is new. */
  async continueWithGoogle(): Promise<SignInResult> {
    if (!isGoogleConfigured()) {
      return {
        ok: false,
        cancelled: false,
        message:
          'Google Sign-In is not set up yet. Add GOOGLE_WEB_CLIENT_ID in src/config/auth.ts.',
      };
    }
    try {
      ensureConfigured();
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const response = await GoogleSignin.signIn();
      if (isCancelledResponse(response)) {
        return { ok: false, cancelled: true };
      }

      const { user: g, idToken } = response.data;
      const known = await loadKnownAccounts();
      const isNewUser = !known[g.id];
      const user: AuthUser = {
        id: g.id,
        email: g.email,
        name: g.name,
        givenName: g.givenName,
        photo: g.photo,
        provider: 'google',
        createdAt: known[g.id] ?? new Date().toISOString(),
      };

      // Backend exchange (creates the account server-side on first sign-in).
      // Not connected yet, so a failure here must not block local sign-in.
      if (idToken) {
        await authenticateWithGoogle(idToken);
      }

      await AsyncStorage.setMany({
        [USER_KEY]: JSON.stringify(user),
        [KNOWN_ACCOUNTS_KEY]: JSON.stringify({
          ...known,
          [g.id]: user.createdAt,
        }),
      });
      this.set({ status: 'signedIn', user });
      return { ok: true, user, isNewUser };
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        error.code === statusCodes.SIGN_IN_CANCELLED
      ) {
        return { ok: false, cancelled: true };
      }
      return { ok: false, cancelled: false, message: describeError(error) };
    }
  }

  async signOut(): Promise<void> {
    try {
      if (isGoogleConfigured()) {
        ensureConfigured();
        await GoogleSignin.signOut();
      }
    } catch {
      /* still clear the local session */
    }
    await AsyncStorage.removeItem(USER_KEY).catch(() => {});
    this.set({ status: 'signedOut', user: null });
  }

  private set(next: AuthState) {
    this.state = next;
    this.listeners.forEach(l => l(next));
  }
}

export const authStore = new AuthStore();
