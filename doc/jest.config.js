module.exports = {
  browser: true,
  setupFiles: ['jest-localstorage-mock', './tests/jest-setup.js'],
  verbose: true,
  moduleFileExtensions: ['js', 'ts', 'vue'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^src/(.*)': '<rootDir>/src/$1',
    '^tests/(.*)': '<rootDir>/tests/$1',
  },
  testRegex: 'tests/.*.spec.(js|ts)$',
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/tests/',
  ],
  globals: {
    'vue-jest': {
      tsConfig: true,
    },
  },
  preset: 'ts-jest/presets/js-with-babel',
  testMatch: null,
}
