// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Lowercase: GitHub Pages serves the canonical host in lowercase, and this
  // value is the base for every canonical/OG URL emitted by the layout.
  site: 'https://realparthiv.github.io',
  output: 'static',
  integrations: [tailwind(), sitemap()]
});
