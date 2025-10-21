import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'frontend', // o Vite ainda precisa apontar para onde está o index.html
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'frontend/src') // alias global para todos os scripts/utils/styles
    },
  },
  build: {
    outDir: 'dist', // build final vai para raiz/dist
    emptyOutDir: true // limpa a pasta dist antes de buildar
  },
  publicDir: 'frontend/public' // para servir imagens, ícones, fontes
});
