import { defineConfig, devices } from '@playwright/test';

const port = 4173;

export default defineConfig({
  testDir: './tests',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  // Tests run against the production build, the same files Netlify serves.
  webServer: {
    command: `npx nx build react && npm run preview -w apps/react -- --port ${port} --strictPort`,
    url: `http://localhost:${port}`,
    cwd: '../..',
    reuseExistingServer: !process.env.CI,
  },
});
