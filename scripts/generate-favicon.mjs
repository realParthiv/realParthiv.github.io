import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';

/**
 * Rasterises public/favicon.svg into the fallback icons browsers ask for by
 * name: /favicon.ico (auto-probed for any non-HTML response, e.g. a directly
 * opened image) and /apple-touch-icon.png.
 *
 * The source SVG is theme-aware via prefers-color-scheme; a rasteriser has no
 * such preference, so these bake the default (dark) variant.
 *
 * Run with: npm run favicon
 */

const SVG = readFileSync(new URL('../public/favicon.svg', import.meta.url));
const ICO_SIZES = [16, 32, 48];

const png = (size) =>
  sharp(SVG, { density: 384 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

/** Build an ICO container around PNG-encoded frames (supported since Vista). */
function buildIco(frames) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(frames.length, 4);

  let offset = 6 + frames.length * 16;
  const entries = frames.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width  (0 means 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...frames.map(f => f.data)]);
}

const frames = await Promise.all(
  ICO_SIZES.map(async size => ({ size, data: await png(size) }))
);

writeFileSync(new URL('../public/favicon.ico', import.meta.url), buildIco(frames));
console.log(`favicon.ico  ${ICO_SIZES.join('/')}px`);

writeFileSync(new URL('../public/apple-touch-icon.png', import.meta.url), await png(180));
console.log('apple-touch-icon.png  180px');
