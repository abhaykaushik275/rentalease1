// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/rentalease1/", // Crucial: Replace 'your-repo-name' with your actual GitHub repo name (e.g., /rental-ease-app/)
});
