import { defineConfig } from 'vite';

export default defineConfig({
  root: 'demo',
  build: {
    lib: {
      entry: '../src/uswds-tour.js',
      name: 'USWDSTour',
      formats: ['es', 'iife'],
      fileName: (format) => format === 'iife' ? 'uswds-tour.min' : 'uswds-tour'
    },
    outDir: '../dist',
    emptyOutDir: true,
    minify: 'terser',
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      }
    }
  },
  server: {
    open: true
  }
});
