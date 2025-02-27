import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'], // Exclude lucide-react from dependency optimization
  },
  server: {
    port: 3000, // Change to your desired port
    host: true, // Optional: Expose the server to your network
  },
});