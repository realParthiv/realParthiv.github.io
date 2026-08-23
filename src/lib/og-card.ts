import sharp from 'sharp';

/**
 * Social cards are a single fixed image per page — a link scraper fetches them
 * server-side and caches the result, so they cannot respond to a viewer's
 * theme. Flip THEME to re-render every card in the other palette.
 */
const PALETTES = {
  light: {
    bg: '#F1F2EC',
    surface: '#FFFFFF',
    text: '#12160F',
    muted: '#5F6960',
    accent: '#8C6636',
    hairline: '#DFE1D8',
    // Flat ground. A low-opacity wash over cream spans so few 8-bit values that
    // the renderer's gradient steps show as visible rings; dark absorbs them.
    glowStrong: 0,
    glowSoft: 0
  },
  dark: {
    bg: '#0E1512',
    surface: '#161F1A',
    text: '#DEE3DD',
    muted: '#7C8983',
    accent: '#B98A4F',
    hairline: '#212A24',
    glowStrong: 0.2,
    glowSoft: 0.18
  }
} as const;

const THEME: keyof typeof PALETTES = 'light';

const {
  bg: BG,
  surface: SURFACE,
  text: TEXT,
  muted: MUTED,
  accent: ACCENT,
  hairline: HAIRLINE,
  glowStrong: GLOW_STRONG,
  glowSoft: GLOW_SOFT
} = PALETTES[THEME];

const MONO = 'IBM Plex Mono, Consolas, DejaVu Sans Mono, monospace';
const SANS = 'IBM Plex Sans, Segoe UI, DejaVu Sans, sans-serif';

const W = 1200;
const H = 630;
const PAD = 80;
const INNER = W - PAD * 2;

export interface CardInput {
  /** Small uppercase label above the title. */
  eyebrow: string;
  title: string;
  /** One or two sentences under the title. */
  body?: string;
  /** Bottom-left metadata, e.g. a stack list or tags. */
  meta?: string;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Greedy word wrap into as many lines as it takes. SVG `<text>` does not wrap
 * on its own, so width is approximated from an average per-font advance ratio.
 */
function wrapAll(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  let line = '';

  for (const word of text.split(/\s+/).filter(Boolean)) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= maxChars || !line) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Wrap, then clamp to `maxLines` with an ellipsis if anything was dropped. */
function wrap(text: string, fontSize: number, ratio: number, maxLines: number): string[] {
  const all = wrapAll(text, Math.floor(INNER / (fontSize * ratio)));
  if (all.length <= maxLines) return all;

  const kept = all.slice(0, maxLines);
  kept[maxLines - 1] = kept[maxLines - 1].replace(/[.,;:]?$/, '') + '…';
  return kept;
}

/** Largest title size that still fits in two lines, falling back to three. */
function fitTitle(title: string): { size: number; lines: string[] } {
  const sizes = [64, 54, 46, 40];
  for (const size of sizes) {
    if (wrapAll(title, Math.floor(INNER / (size * 0.6))).length <= 2) {
      return { size, lines: wrapAll(title, Math.floor(INNER / (size * 0.6))) };
    }
  }
  const size = sizes[sizes.length - 1];
  return { size, lines: wrap(title, size, 0.6, 3) };
}

export async function renderCard({ eyebrow, title, body, meta }: CardInput): Promise<Buffer> {
  const { size: titleSize, lines: titleLines } = fitTitle(title);
  const titleTop = 250;
  const titleLineHeight = Math.round(titleSize * 1.15);

  const bodyLines = body ? wrap(body, 25, 0.52, 2) : [];
  const bodyTop = titleTop + titleLines.length * titleLineHeight + 34;

  const titleTspans = titleLines
    .map((l, i) => `<tspan x="${PAD}" dy="${i === 0 ? 0 : titleLineHeight}">${escapeXml(l)}</tspan>`)
    .join('');

  const bodyTspans = bodyLines
    .map((l, i) => `<tspan x="${PAD}" dy="${i === 0 ? 0 : 34}">${escapeXml(l)}</tspan>`)
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glowA" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="${GLOW_STRONG}"/>
      <stop offset="60%" stop-color="${ACCENT}" stop-opacity="${GLOW_STRONG * 0.25}"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="${GLOW_SOFT}"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${BG}"/>
  ${GLOW_STRONG > 0 ? `<ellipse cx="120" cy="60" rx="520" ry="420" fill="url(#glowA)"/>` : ''}
  ${GLOW_SOFT > 0 ? `<ellipse cx="1130" cy="520" rx="460" ry="380" fill="url(#glowB)"/>` : ''}

  <!-- brand mark -->
  <g transform="translate(${PAD}, 74)">
    <rect x="0" y="0" width="64" height="64" rx="15" fill="${SURFACE}" stroke="${HAIRLINE}" stroke-width="2"/>
    <g transform="translate(8,8) scale(0.75)">
      <path fill="${TEXT}" fill-rule="evenodd" clip-rule="evenodd"
        d="M14 15H31C37 15 41 19 41 25C41 31 37 35 31 35H21V49H14V15ZM21 22V28H30C32.5 28 34 26.8 34 25C34 23.2 32.5 22 30 22H21Z"/>
      <circle fill="${ACCENT}" cx="46" cy="46" r="3.5"/>
    </g>
  </g>
  <text x="${PAD + 84}" y="117" font-family="${MONO}" font-size="26" font-weight="600" fill="${TEXT}" letter-spacing="-0.5">Parthiv<tspan fill="${ACCENT}">.</tspan></text>

  <!-- eyebrow -->
  <text x="${W - PAD}" y="117" text-anchor="end" font-family="${MONO}" font-size="18" fill="${ACCENT}" letter-spacing="3">${escapeXml(eyebrow.toUpperCase())}</text>

  <!-- title -->
  <text x="${PAD}" y="${titleTop}" font-family="${MONO}" font-size="${titleSize}" font-weight="600" fill="${TEXT}" letter-spacing="-2">${titleTspans}</text>

  ${bodyLines.length ? `<text x="${PAD}" y="${bodyTop}" font-family="${SANS}" font-size="25" fill="${MUTED}">${bodyTspans}</text>` : ''}

  <!-- footer -->
  <rect x="${PAD}" y="512" width="${INNER}" height="1.5" fill="${HAIRLINE}"/>
  ${meta ? `<text x="${PAD}" y="562" font-family="${MONO}" font-size="18" fill="${MUTED}" letter-spacing="1.5">${escapeXml(meta)}</text>` : ''}
  <text x="${W - PAD}" y="562" text-anchor="end" font-family="${MONO}" font-size="18" fill="${MUTED}" letter-spacing="1.5">realparthiv.github.io</text>
</svg>`;

  return sharp(Buffer.from(svg))
    .flatten({ background: BG })
    // No `palette: true` here: 256-colour quantisation bands the soft radial
    // gradients badly, which is very visible on the light ground.
    .png({ compressionLevel: 9 })
    .toBuffer();
}
