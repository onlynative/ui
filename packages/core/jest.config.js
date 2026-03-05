/** @type {import('jest').Config} */
module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transformIgnorePatterns: [
    'node_modules/(?!(@material/material-color-utilities|react-native|@react-native|@react-native-community)/)',
  ],
}
