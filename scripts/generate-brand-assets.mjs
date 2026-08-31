/**
 * Genera los iconos de navegador a partir del PNG ya recortado y
 * aprobado por el doctor (`public/logo.png`).
 *
 * POR QUÉ SE RECORTA Y SE RELLENA EL CÍRCULO
 * -------------------------------------------
 * `logo.png` trae un margen ancho alrededor del aro y su propio fondo
 * blanco opaco. Escalado tal cual a 32 o 16 píxeles, el aro de texto
 * ("CIRUGÍA ONCOLÓGICA AVANZADA...") se vuelve una textura ilegible y
 * la marca queda flotando pequeña dentro del cuadro: en la pestaña se
 * leía como una bolita gris, no como un logo.
 *
 * El `trim()` quita ese margen para que la marca ocupe todo el lienzo,
 * y la máscara circular recorta las esquinas, que si no quedaban como
 * cuatro cuñas blancas alrededor de un logo que ya es redondo. El
 * `flatten()` fija el blanco por debajo para que el disco sea opaco en
 * cualquier tema del navegador.
 *
 * La excepción es `apple-touch-icon.png`, que va cuadrado: iOS aplica
 * su propia máscara y pinta de negro cualquier zona transparente que
 * reciba, así que un PNG circular saldría con las esquinas negras en la
 * pantalla de inicio.
 */

import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = join(ROOT, 'public');
const SOURCE = join(PUBLIC_DIR, 'logo.png');

/** Fondo propio del icono: el logo se diseñó para leerse sobre blanco. */
const ICON_BACKGROUND = '#ffffff';

/** Umbral de `trim`: tolera el ruido de los bordes semitransparentes. */
const TRIM_THRESHOLD = 5;

/**
 * Aire entre el aro del logo y el borde del disco. Sin él, la máscara
 * circular corta el aro justo en sus puntos más anchos, porque la marca
 * original es unos píxeles más ancha que alta.
 */
const RING_MARGIN = 0.03;

/** Tamaños que van dentro del `.ico`, el que pide el navegador por defecto. */
const ICO_SIZES = [16, 32, 48];

if (!existsSync(SOURCE)) {
  throw new Error('No se encontró public/logo.png');
}

const trimmed = await sharp(SOURCE)
  .trim({ threshold: TRIM_THRESHOLD })
  .toBuffer({ resolveWithObject: true });

const side = Math.max(trimmed.info.width, trimmed.info.height);
const inner = Math.round(side * (1 - RING_MARGIN));
const pad = Math.round((side - inner) / 2);

/** Marca completa centrada en un cuadrado opaco. Base de todo lo demás. */
const squareMaster = await sharp(trimmed.data)
  .resize({ width: inner, height: inner, fit: 'contain', background: ICON_BACKGROUND })
  .extend({
    top: pad,
    bottom: side - inner - pad,
    left: pad,
    right: side - inner - pad,
    background: ICON_BACKGROUND,
  })
  .flatten({ background: ICON_BACKGROUND })
  .ensureAlpha()
  .png()
  .toBuffer();

/** El mismo cuadrado con las esquinas recortadas: queda solo el disco. */
const circleMask = Buffer.from(
  `<svg width="${side}" height="${side}">` +
    `<circle cx="${side / 2}" cy="${side / 2}" r="${side / 2}" fill="#fff"/>` +
    `</svg>`,
);

const circularMaster = await sharp(squareMaster)
  .composite([{ input: circleMask, blend: 'dest-in' }])
  .png()
  .toBuffer();

const renderPng = (size, { square = false } = {}) =>
  sharp(square ? squareMaster : circularMaster)
    .resize(size, size, { kernel: 'lanczos3' })
    .png({ compressionLevel: 9 })
    .toBuffer();

const writePng = async (size, name, options) => {
  await writeFile(join(PUBLIC_DIR, name), await renderPng(size, options));
};

/**
 * Empaqueta varios PNG en un contenedor `.ico`. El formato admite PNG
 * embebido, así que no hace falta convertir a BMP: basta el índice.
 */
const buildIco = (images) => {
  const HEADER_BYTES = 6;
  const ENTRY_BYTES = 16;

  const header = Buffer.alloc(HEADER_BYTES);
  header.writeUInt16LE(0, 0); // reservado
  header.writeUInt16LE(1, 2); // 1 = icono
  header.writeUInt16LE(images.length, 4);

  let offset = HEADER_BYTES + ENTRY_BYTES * images.length;

  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(ENTRY_BYTES);
    entry.writeUInt8(size === 256 ? 0 : size, 0); // 0 codifica 256
    entry.writeUInt8(size === 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2); // paleta: ninguna
    entry.writeUInt8(0, 3); // reservado
    entry.writeUInt16LE(1, 4); // planos de color
    entry.writeUInt16LE(32, 6); // bits por píxel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images.map(({ data }) => data)]);
};

await writePng(512, 'icon-512.png');
await writePng(192, 'icon-192.png');
await writePng(96, 'favicon-96.png');
await writePng(32, 'favicon-32.png');
await writePng(16, 'favicon-16.png');
await writePng(180, 'apple-touch-icon.png', { square: true });

const icoImages = await Promise.all(
  ICO_SIZES.map(async (size) => ({ size, data: await renderPng(size) })),
);
await writeFile(join(PUBLIC_DIR, 'favicon.ico'), buildIco(icoImages));

console.log('Iconos de marca generados desde public/logo.png');
