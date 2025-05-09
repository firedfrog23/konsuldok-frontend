import tailwindcss from '@tailwindcss/vite'; // Import the plugin
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Add the plugin here
  ],
  // Optional: Server configuration for Docker/WSL if needed
  // server: {
  //   host: true,
  //   port: 5173, // Default Vite port
  //   watch: {
  //     usePolling: true,
  //   },
  // },
})