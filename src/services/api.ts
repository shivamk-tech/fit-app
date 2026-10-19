/**
 * API service layer — foundation for Django backend integration.
 *
 * Currently all methods are stubs that resolve immediately.
 * When the backend is ready, replace the stub bodies with real fetch calls
 * and set API_BASE_URL to your server address.
 *
 * Android emulator note: use http://10.0.2.2:8000 to reach localhost on the host machine.
 * iOS simulator: http://localhost:8000 works directly.
 */

// TODO: move to a .env file once react-native-config or similar is added
export const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:8000/api/v1'
  : 'https://api.fitrewards.app/api/v1';

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string };

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
    });
    if (!res.ok) {
      const body = await res.text();
      return { ok: false, status: res.status, message: body };
    }
    const data = (await res.json()) as T;
    return { ok: true, data };
  } catch (err) {
    return { ok: false, status: 0, message: String(err) };
  }
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

/** Stub — not yet connected. */
export async function registerUser(
  _payload: RegisterPayload,
): Promise<ApiResult<AuthTokens>> {
  // TODO: return request<AuthTokens>('/auth/register/', { method: 'POST', body: JSON.stringify(_payload) });
  return { ok: false, status: 0, message: 'Backend not yet connected.' };
}

/** Stub — not yet connected. */
export async function loginUser(
  _email: string,
  _password: string,
): Promise<ApiResult<AuthTokens>> {
  // TODO: return request<AuthTokens>('/auth/token/', { method: 'POST', body: JSON.stringify({ email: _email, password: _password }) });
  return { ok: false, status: 0, message: 'Backend not yet connected.' };
}

// ── Workouts ──────────────────────────────────────────────────────────────────

/** Stub — not yet connected. */
export async function fetchWorkouts(): Promise<ApiResult<unknown[]>> {
  // TODO: return request<unknown[]>('/workouts/');
  return { ok: false, status: 0, message: 'Backend not yet connected.' };
}

// ── Sessions ──────────────────────────────────────────────────────────────────

/** Stub — not yet connected. */
export async function syncSession(_session: unknown): Promise<ApiResult<unknown>> {
  // TODO: return request<unknown>('/sessions/', { method: 'POST', body: JSON.stringify(_session) });
  return { ok: false, status: 0, message: 'Backend not yet connected.' };
}

// Export request for future use in feature-specific services
export { request };
