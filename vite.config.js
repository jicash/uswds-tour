import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    // Dev server: serve demo as an app
    return {
      root: 'demo',
      server: {
        open: true
      }
    };
  } else {
    // Build: output library
    return {
      build: {
        lib: {
          entry: 'src/uswds-tour.js',
          name: 'USWDSTour',
          formats: ['es', 'iife'],
          fileName: (format) => format === 'iife' ? 'uswds-tour.min.js' : 'uswds-tour.js'
        },
        outDir: 'dist',
        emptyOutDir: true,
        minify: 'terser',
        rollupOptions: {
          external: [],
          output: {
            globals: {}
          }
        }
      }
    };
  }
});
