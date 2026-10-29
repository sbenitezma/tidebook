import { defineConfig, devices } from '@playwright/test';

// The same tests run against every app: they share the core, components and markup, so a guest
// must get the same result in each one.
const apps = [
  { name: 'react', port: 4173 },
  { name: 'vue', port: 4174 },
  { name: 'angular', port: 4175 },
];
const screens = [
  { name: 'desktop', device: devices['Desktop Chrome'] },
  { name: 'mobile', device: devices['Pixel 7'] },
];

export default defineConfig({
  testDir: './tests',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { trace: 'on-first-retry' },
  projects: apps.flatMap((app) =>
    screens.map((screen) => ({
      name: `${app.name}-${screen.name}`,
      use: { ...screen.device, baseURL: `http://localhost:${app.port}` },
    })),
  ),
  // Tests run against the production builds, the same files Netlify serves.
  webServer: apps.map((app) => ({
    command: `npx nx build ${app.name} && npm run preview -w apps/${app.name} -- --port ${app.port} --strictPort`,
    url: `http://localhost:${app.port}`,
    cwd: '../..',
    reuseExistingServer: !process.env.CI,
  })),
});
