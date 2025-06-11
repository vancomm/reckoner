import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { generateVariants } from './variants';

// https://vite.dev/config/
export default defineConfig(async ({ mode, command }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const basePath = env.BASE_PATH || '';
    const genVariants = await generateVariants();
    console.log({ command, mode, basePath, genVariants, nodeVersion: process.version });

    return {
        base: basePath,
        plugins: [
            tsconfigPaths(),
            tailwindcss(),
            TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
            react(),
        ],
        define: {
            __BUILD_DATE__: new Date(),
            __BASE_PATH__: JSON.stringify(basePath),
        },
    };
});
