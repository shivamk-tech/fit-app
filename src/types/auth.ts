export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  givenName: string | null;
  photo: string | null;
  provider: 'google';
  /** ISO timestamp of the first sign-in on this device. */
  createdAt: string;
}

export type AuthStatus = 'restoring' | 'signedOut' | 'signedIn';

export interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
}

export type SignInResult =
  | { ok: true; user: AuthUser; isNewUser: boolean }
  | { ok: false; cancelled: true }
  | { ok: false; cancelled: false; message: string };
