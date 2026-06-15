import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://partidosdehoy.live',
  output: 'static',
  build: {
    format: 'directory',
  },
  compressHTML: true,
});
