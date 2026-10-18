import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The site lives at https://adil-zero-one.github.io/showcase/ (a GitHub Pages "project site",
// repository adil-zero-one/showcase), so the base is "/showcase/". Another repository name:
// build with VITE_BASE=/other-name/. In code use `asset()` from src/lib/asset.ts for files in /public.
export default defineConfig({
  base: (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.VITE_BASE ?? '/showcase/',
  plugins: [react()],
  build: {
    target: 'es2022',
    sourcemap: false,
    rollupOptions: {
      output: {
        // GSAP is the heaviest dependency; its own chunk is cached separately from app code.
        manualChunks(id: string) {
          if (id.includes('node_modules/gsap')) return 'gsap';
          return undefined;
        },
      },
    },
  },
});
