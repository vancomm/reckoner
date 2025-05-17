import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const basePath = env.BASE_PATH || '';
    console.log(`building for ${mode} to mount on base_path=${basePath}`);
    return {
        base: basePath,
        plugins: [tsconfigPaths(), tailwindcss(), TanStackRouterVite({ target: 'react', autoCodeSplitting: true }), react()],
        define: {
            __BUILD_DATE__: new Date(),
            __BASE_PATH__: JSON.stringify(basePath),
        },
    };
});
