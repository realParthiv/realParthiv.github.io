import typography from '@tailwindcss/typography';

const dark = {
  bg: '#0E1512',
  surface: '#161F1A',
  text: '#DEE3DD',
  muted: '#7C8983',
  accent: '#B98A4F',
  hairline: '#212A24',
  glow: 'rgba(185, 138, 79, 0.15)'
};

const light = {
  bg: '#F1F2EC',
  surface: '#FFFFFF',
  text: '#12160F',
  muted: '#5F6960',
  accent: '#8C6636',
  hairline: '#DFE1D8',
  glow: 'rgba(140, 102, 54, 0.1)'
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    // NOTE: colors live under `extend` on purpose. Replacing `theme.colors`
    // wholesale deletes Tailwind's built-ins — including `transparent`,
    // `current`, `black`, `white` and every default hue — which silently
    // breaks `text-transparent` (gradient headings) and `text-red-*` (form errors).
    extend: {
      colors: { dark, light },
      // Restoring the default palette also restores Tailwind's default border
      // colour (gray-200). This project previously inherited `currentColor`
      // because the palette was empty — keep that behaviour for bare `border`.
      borderColor: { DEFAULT: 'currentColor' },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': light.text,
            '--tw-prose-headings': light.text,
            '--tw-prose-lead': light.muted,
            '--tw-prose-links': light.accent,
            '--tw-prose-bold': light.text,
            '--tw-prose-counters': light.muted,
            '--tw-prose-bullets': light.muted,
            '--tw-prose-hr': light.hairline,
            '--tw-prose-quotes': light.text,
            '--tw-prose-quote-borders': light.accent,
            '--tw-prose-captions': light.muted,
            '--tw-prose-code': light.accent,
            '--tw-prose-pre-code': light.text,
            '--tw-prose-pre-bg': light.surface,
            '--tw-prose-th-borders': light.hairline,
            '--tw-prose-td-borders': light.hairline
          }
        },
        invert: {
          css: {
            '--tw-prose-body': dark.text,
            '--tw-prose-headings': dark.text,
            '--tw-prose-lead': dark.muted,
            '--tw-prose-links': dark.accent,
            '--tw-prose-bold': dark.text,
            '--tw-prose-counters': dark.muted,
            '--tw-prose-bullets': dark.muted,
            '--tw-prose-hr': dark.hairline,
            '--tw-prose-quotes': dark.text,
            '--tw-prose-quote-borders': dark.accent,
            '--tw-prose-captions': dark.muted,
            '--tw-prose-code': dark.accent,
            '--tw-prose-pre-code': dark.text,
            '--tw-prose-pre-bg': dark.surface,
            '--tw-prose-th-borders': dark.hairline,
            '--tw-prose-td-borders': dark.hairline
          }
        }
      }
    },
    fontFamily: {
      display: ['"IBM Plex Mono"', 'monospace'],
      body: ['"IBM Plex Sans"', 'sans-serif'],
      data: ['"IBM Plex Mono"', 'monospace']
    }
  },
  plugins: [
    typography,
  ],
}
