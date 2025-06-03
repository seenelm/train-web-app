import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['e2e/**/*', 'node_modules/**/*'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/setup.ts',
        'src/test/mocks/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
        'dist/**/*',
        'e2e/**/*',
        'coverage/**/*',
        'public/**/*',
        'src/test/**/*',
        'src/common/mocks/**/*',
        'src/common/mocks/handlers.ts',
        'src/common/mocks/server.ts',
        'src/common/mocks/mocks.ts',
        'src/common/mocks/server.ts',
      ],
      thresholds: {
        statements: 50,
        branches: 50,
        functions: 50,
        lines: 50,
      },
    },
  },
});