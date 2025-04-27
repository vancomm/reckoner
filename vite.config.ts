import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [tailwindcss(), TanStackRouterVite({ target: 'react', autoCodeSplitting: true }), react()],
    define: {
        __BUILD_DATE__: new Date(),
    },
});
