import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Room photos and the favicon are shared by every app.
  publicDir: '../../libs/ui/public',
  test: {
    environment: 'happy-dom',
  },
});
