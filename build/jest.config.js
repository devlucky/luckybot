const path = require('path');
const absPath = fileName => path.resolve(__dirname, fileName);

module.exports = {
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'json'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': absPath('preprocessor.js')
  },
  rootDir: absPath('..'),
  testMatch: [
    '**/__tests__/*.spec.(ts|tsx)'
  ],
  resetMocks: true
};