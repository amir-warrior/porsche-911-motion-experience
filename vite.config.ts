/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1200,
    // Never inline fonts as data: URIs — keep them cacheable files (and CSP-friendly).
    assetsInlineLimit: (file: string) => (file.endsWith('.woff2') ? false : undefined),
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/utils/**', 'src/store/**', 'src/data/**', 'src/animations/**'],
      thresholds: { lines: 80, functions: 80, statements: 80, branches: 75 },
    },
  },
})
