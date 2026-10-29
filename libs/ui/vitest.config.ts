import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    coverage: {
      include: ['src/**/*.ts'],
      exclude: ['src/test-utils.ts', 'src/**/*.stories.ts'],
      thresholds: { lines: 90, branches: 85 },
    },
  },
});
