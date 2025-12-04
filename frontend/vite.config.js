import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,       // Lock port to 5173
    strictPort: true, // If 5173 is taken, fail instead of switching
  },
});
