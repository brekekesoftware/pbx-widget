import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    // cssCodeSplit: false,
    // manifest: true,
    // sourcemap: true,
    // assetsInlineLimit: 0,
    // lib: {
    //   // name: 'brekekewidget',
    //   entry: {
    //     widget: './src/main.tsx',
    //     // main: './index.html',
    //     // salesforce: './salesforce/index.html',
    //   },
    //   formats: ['es'],
    //   fileName: (format, entryName) => {
    //     return `${entryName}/index.js`;
    //   },
    // },

    rollupOptions: {
      input: {
        widget: './src/main.tsx',
        // main: './index.html',
        salesforce: './salesforce/index.html',
      },
      // external: ['react', 'react-dom']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
