import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Keeps process.env.REACT_APP_API_HOST/PORT working exactly as they did
// under Create React App (see src/api.js's dev-time fallback), so neither
// that file nor its tests needed to change as part of the Vite migration.
// Confirmed working for `vite build` (production), but NOT for `vite`'s
// dev server - traced this fairly deep (direct esbuild.transformSync calls
// and Vite's own import.meta.env injection both substitute correctly for
// the exact same file; this define config, dotted or flat keys, top-level
// or under `esbuild.define`, does not) without finding the actual cause.
// Local docker-compose dev doesn't depend on this working: Dockerfile_dev
// generates a real env-config.js at container startup instead, and
// api.js's getApiHost()/getApiPort() check window._env_ (env-config.js)
// before ever falling back to process.env.
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
      // Vite binds to 127.0.0.1 only by default ("Network: use --host to
      // expose" in its own startup banner is the tell). That's fine bare-
      // metal, but inside this container Docker's published port connects
      // via the container's bridge-network IP, not its own loopback -
      // nothing was listening on that interface, so every host-side
      // request got a bare TCP reset. host: true binds 0.0.0.0 instead.
      host: true,
    },
    build: {
      // Keep the output directory name CI/Dockerfiles already expect.
      outDir: 'build',
    },
  };
});
