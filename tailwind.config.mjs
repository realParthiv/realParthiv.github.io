/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    colors: {
      dark: { 
        bg: '#0E1512', 
        surface: '#161F1A', 
        text: '#DEE3DD', 
        muted: '#7C8983', 
        accent: '#B98A4F', 
        hairline: '#212A24' 
      },
      light: { 
        bg: '#F1F2EC', 
        surface: '#FFFFFF', 
        text: '#12160F', 
        muted: '#5F6960', 
        accent: '#8C6636', 
        hairline: '#DFE1D8' 
      }
    },
    fontFamily: {
      display: ['"IBM Plex Mono"', 'monospace'],
      body: ['"IBM Plex Sans"', 'sans-serif'],
      data: ['"IBM Plex Mono"', 'monospace']
    }
  },
  plugins: [],
}
