import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../src/config/auth', () => ({
  GOOGLE_WEB_CLIENT_ID: 'test-web-client-id',
  GOOGLE_IOS_CLIENT_ID: '',
  isGoogleConfigured: () => true,
}));

type Store = typeof import('../src/services/auth').authStore;
type Google =
  typeof import('@react-native-google-signin/google-signin').GoogleSignin;

// Fresh store per test so state doesn't leak between cases. The Google module
// is returned from the same registry so spies hit the copy the store uses.
function loadModules(): { store: Store; google: Google } {
  let mods!: { store: Store; google: Google };
  jest.isolateModules(() => {
    mods = {
      store: require('../src/services/auth').authStore,
      google: require('@react-native-google-signin/google-signin').GoogleSignin,
    };
  });
  return mods;
}
const loadStore = () => loadModules().store;

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.restoreAllMocks();
});

test('first Google sign-in creates the account (sign up)', async () => {
  const store = loadStore();
  const result = await store.continueWithGoogle();

  expect(result.ok).toBe(true);
  if (!result.ok) return;
  expect(result.isNewUser).toBe(true);
  expect(result.user.email).toBe('mockEmail');
  expect(store.snapshot().status).toBe('signedIn');
});

test('the same button signs a returning account in', async () => {
  const first = loadStore();
  await first.continueWithGoogle();
  await first.signOut();

  const second = loadStore();
  const result = await second.continueWithGoogle();
  expect(result.ok && result.isNewUser).toBe(false);
});

test('the session is restored on the next launch', async () => {
  await loadStore().continueWithGoogle();

  const relaunched = loadStore();
  await relaunched.restore();
  expect(relaunched.snapshot().status).toBe('signedIn');
  expect(relaunched.snapshot().user?.id).toBe('mockId');
});

test('cancelling the Google sheet is not an error', async () => {
  const { store, google } = loadModules();
  jest
    .spyOn(google, 'signIn')
    .mockResolvedValue({ type: 'cancelled', data: null });
  const result = await store.continueWithGoogle();
  expect(result).toEqual({ ok: false, cancelled: true });
  expect(store.snapshot().status).not.toBe('signedIn');
});

test('sign out clears the session', async () => {
  const store = loadStore();
  await store.continueWithGoogle();
  await store.signOut();
  expect(store.snapshot()).toEqual({ status: 'signedOut', user: null });
  expect(await AsyncStorage.getItem('@fitrewards/auth_user')).toBeNull();
});
