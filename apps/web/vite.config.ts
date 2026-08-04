import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function expressApiPlugin(): Plugin {
  let appPromise: Promise<any> | null = null;
  return {
    name: 'express-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && (req.url.startsWith('/api') || req.url.startsWith('/api/'))) {
          try {
            if (!appPromise) {
              const apiModule = await server.ssrLoadModule(path.resolve(__dirname, '../api/src/app.ts'));
              appPromise = apiModule.createApiApp();
            }
            const app = await appPromise;
            app(req, res, next);
          } catch (err) {
            console.error('[Vite Api Plugin Error]', err);
            next(err);
          }
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig(() => {
  const rootDir = path.resolve(__dirname, '../..');
  return {
    root: __dirname,
    plugins: [react(), tailwindcss(), expressApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@manaratak/application': path.resolve(rootDir, 'packages/application/src/index.ts'),
        '@manaratak/config': path.resolve(rootDir, 'packages/config/src/index.ts'),
        '@manaratak/core': path.resolve(rootDir, 'packages/core/src/index.ts'),
        '@manaratak/domain': path.resolve(rootDir, 'packages/domain/src/index.ts'),
        '@manaratak/infrastructure': path.resolve(rootDir, 'packages/infrastructure/src/index.ts'),
        '@manaratak/shared': path.resolve(rootDir, 'packages/shared/src/index.ts'),
        '@manaratak/types': path.resolve(rootDir, 'packages/types/src/index.ts'),
        '@manaratak/ui': path.resolve(rootDir, 'packages/ui/src/index.tsx'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      port: 3000,
      host: '0.0.0.0'
    },
  };
});

