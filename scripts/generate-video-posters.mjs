/**
 * MINIATURAS DE LOS VIDEOS
 * ------------------------
 * Extrae un fotograma de cada reel y lo guarda como AVIF y WebP en
 * /public/reels.
 *
 *     npm run media:posters
 *
 * REQUIERE ffmpeg EN EL PATH. Si no está, el script lo dice y sale sin
 * tocar nada. En Windows:  winget install Gyan.FFmpeg
 *
 * PARA QUÉ SIRVEN LAS MINIATURAS
 *
 * 1) RENDIMIENTO. Hoy las seis tarjetas cargan con `preload="metadata"`
 *    para poder mostrar el primer fotograma. Son seis MP4 que suman
 *    58 MB y el navegador tiene que abrir una conexión con cada uno,
 *    normalmente con peticiones por rango, solo para pintar una imagen
 *    fija. Con miniatura, las tarjetas muestran una imagen de unos
 *    15 KB y el video no se toca hasta que alguien pulsa reproducir.
 *
 * 2) SEO DE VIDEO. Google solo genera un resultado enriquecido de video
 *    cuando el `VideoObject` declara `thumbnailUrl`. Sin miniatura no
 *    hay nodo posible, y por eso `structured-data.ts` omite hoy los
 *    seis videos en lugar de publicar datos incompletos.
 *
 * DESPUÉS DE EJECUTARLO hay que completar en `REELS`
 * (`core/data/doctor.data.ts`) los campos `poster` y `uploadDate` de
 * cada reel. El JSON-LD los detecta solo: no hay que tocar el esquema.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, unlinkSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

import { REELS } from '../src/app/core/data/doctor.data.ts';
import { MODERN_FORMATS } from '../src/app/core/media/image-variants.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = join(ROOT, 'public');
const POSTERS_DIR = join(PUBLIC_DIR, 'reels');

/**
 * Segundo del que se toma el fotograma.
 *
 * No el 0: muchos videos abren con un fundido desde negro y la
 * miniatura saldría en negro. Al segundo y medio la imagen ya está
 * estabilizada y suele mostrarse al doctor hablando.
 */
const FRAME_AT = '00:00:01.5';

/** Ancho de la miniatura. Las tarjetas son verticales y estrechas. */
const POSTER_WIDTH = 540;

/* ============================================================
   COMPROBACIÓN PREVIA
   ============================================================ */

try {
  execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
} catch {
  console.error(
    '\n  No se encontró ffmpeg en el PATH.\n\n' +
      '  Windows:  winget install Gyan.FFmpeg\n' +
      '  macOS:    brew install ffmpeg\n' +
      '  Linux:    sudo apt install ffmpeg\n\n' +
      '  Después vuelva a ejecutar: npm run media:posters\n',
  );
  process.exit(1);
}

/* ============================================================
   EXTRACCIÓN
   ============================================================ */

mkdirSync(POSTERS_DIR, { recursive: true });

console.log('\nGenerando miniaturas de los videos\n' + '─'.repeat(64));

let generated = 0;

for (const reel of REELS) {
  const videoPath = join(PUBLIC_DIR, reel.src);

  if (!existsSync(videoPath)) {
    console.log(`  ! ${reel.src} — no existe, se omite`);
    continue;
  }

  // Se extrae a PNG sin pérdida y luego sharp lo comprime, en lugar de
  // dejar que ffmpeg codifique directamente: así la miniatura usa los
  // mismos parámetros de calidad que el resto de imágenes de la página.
  const temporaryFrame = join(POSTERS_DIR, `${reel.id}.tmp.png`);

  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-ss',
      FRAME_AT,
      '-i',
      videoPath,
      '-frames:v',
      '1',
      '-vf',
      `scale=${POSTER_WIDTH}:-2`,
      temporaryFrame,
    ],
    { stdio: 'ignore' },
  );

  for (const format of MODERN_FORMATS) {
    const outputPath = join(POSTERS_DIR, `${reel.id}.${format}`);
    await sharp(temporaryFrame)
      .toFormat(format, format === 'avif' ? { quality: 55 } : { quality: 78 })
      .toFile(outputPath);
  }

  // También un JPG, porque el atributo `poster` de <video> no admite
  // <source> y necesita un formato que entienda cualquier navegador.
  await sharp(temporaryFrame)
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(join(POSTERS_DIR, `${reel.id}.jpg`));

  unlinkSync(temporaryFrame);

  console.log(`  ✓ reels/${reel.id}.{avif,webp,jpg}  ← ${reel.src}`);
  generated += 1;
}

console.log(`\n${'─'.repeat(64)}`);
console.log(`  ${generated} miniaturas generadas en public/reels/\n`);
console.log(
  '  SIGUIENTE PASO — en src/app/core/data/doctor.data.ts, añada a cada\n' +
    '  reel de REELS:\n\n' +
    "      poster: 'reels/reel-1.jpg',\n" +
    "      uploadDate: '2025-03-14',      // fecha real de TikTok\n" +
    "      description: '…',              // de qué habla el video\n\n" +
    '  El JSON-LD publicará el VideoObject en cuanto poster y uploadDate\n' +
    '  estén completos. No hay que tocar structured-data.ts.\n',
);
