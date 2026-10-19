/* eslint-env jest */
// AsyncStorage has no native implementation under Jest; use its in-memory mock.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest'),
);
