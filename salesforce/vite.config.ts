import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  resolve: {
    alias: {
      '@salesforce': path.resolve(__dirname, './src'),
    },
  },
});
