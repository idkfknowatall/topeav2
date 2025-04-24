import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'icons': ['react-icons'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: env.NODE_ENV !== 'production',
    // Optimize build
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: env.NODE_ENV === 'production',
        drop_debugger: env.NODE_ENV === 'production'
      }
    },
    // Add cache headers to assets
    assetsInlineLimit: 4096, // 4kb
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'react-icons'],
  },
  // Ensure TypeScript files are properly compiled
  esbuild: {
    loader: 'tsx',
    include: ['src/**/*.ts', 'src/**/*.tsx'],
    exclude: [],
  }
  };
});
