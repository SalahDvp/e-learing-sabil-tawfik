import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx'], // Ensure .jsx is included
  },
  server: {
    historyApiFallback: true, // Fix 404 on refresh in development
  },
});


