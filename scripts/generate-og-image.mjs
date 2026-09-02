/**
 * Genera la tarjeta 1200x630 que acompaña al enlace en WhatsApp y redes.
 * La fotografía de comunidad mantiene el relato humano de la portada.
 *
 * Uso: npm run media:og
 */

import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = join(ROOT, 'public');
const WIDTH = 1200;
const HEIGHT = 630;
const PHOTO = join(PUBLIC_DIR, 'fabio', 'fabio-comunidad-portada.jpg');
const OUTPUT = join(PUBLIC_DIR, 'og-fabio-palacios-historia-valores.jpg');

if (!existsSync(PHOTO)) throw new Error(`No se encontró ${PHOTO}`);

const photo = await sharp(PHOTO)
  .resize({ width: WIDTH, height: HEIGHT, fit: 'cover', position: 'centre' })
  .modulate({ saturation: 0.82, brightness: 0.82 })
  .toBuffer();

const overlay = Buffer.from(
  `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#04131d" stop-opacity="0.98"/>
        <stop offset="0.52" stop-color="#04131d" stop-opacity="0.78"/>
        <stop offset="1" stop-color="#04131d" stop-opacity="0.18"/>
      </linearGradient>
    </defs>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#shade)"/>
  </svg>`,
);

const SANS = 'Segoe UI, Helvetica, Arial, sans-serif';
const text = Buffer.from(
  `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <text x="72" y="112" font-family="${SANS}" font-size="25" font-weight="700" letter-spacing="3" fill="#91e2da">
      FABIO PALACIOS
    </text>
    <text x="72" y="258" font-family="${SANS}" font-size="66" font-weight="700" fill="#ffffff">
      <tspan x="72" dy="0">La vida se cuida</tspan>
      <tspan x="72" dy="76">estando cerca.</tspan>
    </text>
    <text x="72" y="454" font-family="${SANS}" font-size="27" fill="#d7e4e7">
      <tspan x="72" dy="0">Comunidad, familia y una vida guiada</tspan>
      <tspan x="72" dy="39">por la cercanía y el servicio.</tspan>
    </text>
    <rect x="72" y="548" width="116" height="5" rx="2.5" fill="#46c8bb"/>
  </svg>`,
);

await sharp(photo)
  .composite([
    { input: overlay, left: 0, top: 0 },
    { input: text, left: 0, top: 0 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(OUTPUT);

console.log(`Imagen social ${WIDTH}x${HEIGHT} generada: ${OUTPUT}`);
