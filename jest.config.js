module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: [
    '<rootDir>/jest.setup.js',
    '<rootDir>/node_modules/@react-native-google-signin/google-signin/jest/build/jest/setup.js',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|@react-navigation|@react-native-async-storage|@react-native-google-signin)/)',
  ],
  modulePathIgnorePatterns: ['<rootDir>/.refactor-backup/'],
};
