export default {
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\.(css|less|scss|sass)$': '<rootDir>/tests/jest/mocks/styleMock.js',
    '\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/tests/jest/mocks/fileMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/jest/setup.js'],
  testMatch: ['<rootDir>/tests/jest/**/*.test.{ts,tsx}'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true,
      tsconfig: 'tsconfig.test.json'
    }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!.*\\.mjs$)'
  ],
};
