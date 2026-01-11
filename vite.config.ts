import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Google AI Studio / Gemini API Key configuration
  const apiKey = env.API_KEY || env.GEMINI_API_KEY || env.VITE_API_KEY || '';
  
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(apiKey),
      'process.env.GEMINI_API_KEY': JSON.stringify(apiKey),
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    server: {
      host: true,
      port: 5173,
      strictPort: false,
      open: false
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'charts': ['recharts'],
            'icons': ['lucide-react']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'lucide-react', 'recharts']
    }
  };
});