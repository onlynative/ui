/** @type {import('jest').Config} */
module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFiles: ['./jest.setup.js'],
  moduleNameMapper: {
    '^@onlynative/core$': '<rootDir>/../core/src/index.ts',
    '^@onlynative/utils$': '<rootDir>/../utils/src/index.ts',
    '^@onlynative/utils/test$': '<rootDir>/../utils/src/test-utils/index.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@expo/vector-icons|react-native-safe-area-context|@material/material-color-utilities)/)',
  ],
}
