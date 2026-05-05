import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(() => {
  const base = process.env.VITE_BASE ?? '/';
  return {
    base,
    plugins: [glsl()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5173,
      host: true,
      open: false,
    },
    build: {
      target: 'es2022',
      sourcemap: true,
      cssCodeSplit: true,
      minify: 'esbuild' as const,
      rollupOptions: {
        output: {
          manualChunks: {
            three: ['three'],
            gsap: ['gsap'],
            lenis: ['lenis'],
          },
        },
      },
    },
  };
});
