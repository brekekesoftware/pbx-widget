import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
  ],
  base: '',
  define: {
    'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
  },
  build: {
    cssCodeSplit: false,
    manifest: true,
    sourcemap: true,
    copyPublicDir: true,
    // assetsInlineLimit: 0,
    lib: {
      // name: 'brekekewidget',
      entry: './src/main.tsx',
      formats: ['cjs'],
      fileName: (format, entryName) => {
        return `widget.js`;
      },
    },

    // rollupOptions: {
    //   input: {
    //     widget: './src/main.tsx',
    //     // main: './index.html',
    //     salesforce: './salesforce/index.html',
    //   },
    //   // external: ['react', 'react-dom']
    // }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src'),
    },
  },
});
