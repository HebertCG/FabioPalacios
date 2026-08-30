/**
 * OPTIMIZACIÓN DE IMÁGENES
 * ------------------------
 * Convierte los originales de /public a AVIF y WebP y genera las
 * variantes de tamaño que consume `srcset`.
 *
 *     npm run media:images          convierte lo que falte
 *     npm run media:images -- --force   rehace todo
 *
 * POR QUÉ IMPORTA MÁS QUE CASI TODO LO DEMÁS
 * El peso de las imágenes es el factor que más pesa en el LCP, y el LCP
 * es una de las tres métricas que Google mide de verdad. En un
 * consultorio de Piura, además, buena parte de las visitas llegan por
 * WhatsApp desde un celular con datos móviles: cada 100 KB ahorrados
 * son décimas de segundo antes de que el paciente vea el retrato.
 *
 * ESTRATEGIA
 *  · AVIF primero: pesa entre un 30% y un 50% menos que WebP a la misma
 *    calidad percibida. Lo soportan Chrome, Firefox, Safari 16+ y Edge.
 *  · WebP como red de seguridad para navegadores algo más antiguos.
 *  · El original (PNG/JPG) se conserva y es el último recurso de
 *    `<picture>`. No se borra nada.
 *  · Se generan varios anchos para que un móvil de 400 px no descargue
 *    la versión de 1200 px.
 *
 * NO SE TOCAN LOS ORIGINALES. El script solo escribe archivos nuevos
 * junto a ellos, así que se puede ejecutar las veces que haga falta.
 */

import { existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

import {
  IMAGE_VARIANTS,
  MODERN_FORMATS,
  variantPath as buildVariantPath,
} from '../src/app/core/media/image-variants.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = join(ROOT, 'public');
const FORCE = process.argv.includes('--force');

/**
 * Calidades escogidas por formato.
 *
 * AVIF a 55 y WebP a 78 son puntos en los que la diferencia con el
 * original deja de verse a simple vista en fotografía e ilustración,
 * que es todo lo que hay en esta página. Subirlos engorda el archivo
 * sin que nadie note la mejora.
 */
const QUALITY = {
  avif: { quality: 55, effort: 6 },
  webp: { quality: 78, effort: 5 },
};

/* ============================================================
   UTILIDADES
   ============================================================ */

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

/**
 * Ruta absoluta de salida.
 *
 * El nombre lo construye `image-variants.ts`, el mismo módulo que leen
 * las plantillas para escribir el `srcset`: así el archivo que se
 * genera y el que la página pide no pueden divergir.
 */
function variantPath(file, width, format) {
  return join(PUBLIC_DIR, buildVariantPath(file, width, format));
}

/** Evita rehacer trabajo si la variante ya existe y es más nueva. */
function isUpToDate(sourcePath, outputPath) {
  if (FORCE || !existsSync(outputPath)) return false;
  return statSync(outputPath).mtimeMs >= statSync(sourcePath).mtimeMs;
}

/* ============================================================
   CONVERSIÓN
   ============================================================ */

async function processTarget(target) {
  const sourcePath = join(PUBLIC_DIR, target.file);

  if (!existsSync(sourcePath)) {
    console.log(`  ! ${target.file} — no existe, se omite`);
    return { originalBytes: 0, generatedBytes: 0, files: 0, skipped: 0 };
  }

  const originalBytes = statSync(sourcePath).size;
  const metadata = await sharp(sourcePath).metadata();

  console.log(
    `\n  ${target.file}` +
      `\n    ${metadata.width}x${metadata.height}, ${kb(originalBytes)} — ${target.note}`,
  );

  let generatedBytes = 0;
  let files = 0;
  let skipped = 0;

  for (const width of target.widths) {
    // Ampliar una imagen no añade detalle, solo peso.
    if (width > metadata.width) {
      console.log(`    · ${width}w — omitido, supera el ancho original`);
      continue;
    }

    for (const format of MODERN_FORMATS) {
      const outputPath = variantPath(target.file, width, format);
      mkdirSync(dirname(outputPath), { recursive: true });

      if (isUpToDate(sourcePath, outputPath)) {
        generatedBytes += statSync(outputPath).size;
        skipped += 1;
        continue;
      }

      await sharp(sourcePath)
        .resize({ width, withoutEnlargement: true })
        .toFormat(format, QUALITY[format])
        .toFile(outputPath);

      const size = statSync(outputPath).size;
      generatedBytes += size;
      files += 1;

      const saved = ((1 - size / originalBytes) * 100).toFixed(0);
      console.log(
        `    ✓ ${relative(PUBLIC_DIR, outputPath).replace(/\\/g, '/')}` +
          `  ${kb(size)}  (−${saved}%)`,
      );
    }
  }

  return { originalBytes, generatedBytes, files, skipped };
}

/* ============================================================
   EJECUCIÓN
   ============================================================ */

console.log('\nOptimizando imágenes de /public\n' + '─'.repeat(64));

let totalFiles = 0;
let totalSkipped = 0;

for (const target of IMAGE_VARIANTS) {
  const result = await processTarget(target);
  totalFiles += result.files;
  totalSkipped += result.skipped;
}

console.log(`\n${'─'.repeat(64)}`);
console.log(
  `  ${totalFiles} variantes generadas` + (totalSkipped ? `, ${totalSkipped} ya al día` : ''),
);
console.log(
  '\n  Los originales no se han tocado: siguen siendo el último\n' +
    '  recurso de cada <picture>, para cualquier navegador que no\n' +
    '  entienda AVIF ni WebP.\n',
);
