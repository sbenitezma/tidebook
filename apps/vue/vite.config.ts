import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      // tb-* are web components: Vue renders them as plain elements instead of resolving them as
      // Vue components.
      template: { compilerOptions: { isCustomElement: (tag) => tag.startsWith('tb-') } },
    }),
  ],
  // Room photos and the favicon are shared by every app.
  publicDir: '../../libs/ui/public',
  // Next to the React app's 5173, so both can run at once.
  server: { port: 5174 },
  test: {
    environment: 'happy-dom',
  },
});
