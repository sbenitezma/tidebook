import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Room illustrations and the favicon are shared by every app.
  publicDir: '../../libs/ui/public',
  test: {
    environment: 'happy-dom',
  },
});
