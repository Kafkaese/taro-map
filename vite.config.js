import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Keeps process.env.REACT_APP_API_HOST/PORT working exactly as they did
// under Create React App (see src/api.js's dev-time fallback), so neither
// that file nor its tests needed to change as part of the Vite migration.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'REACT_APP_');

  return {
    plugins: [react()],
    define: {
      'process.env.REACT_APP_API_HOST': JSON.stringify(env.REACT_APP_API_HOST),
      'process.env.REACT_APP_API_PORT': JSON.stringify(env.REACT_APP_API_PORT),
    },
    server: {
      port: 3000,
    },
    build: {
      // Keep the output directory name CI/Dockerfiles already expect.
      outDir: 'build',
    },
  };
});
