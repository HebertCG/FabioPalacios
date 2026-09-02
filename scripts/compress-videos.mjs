/**
 * COMPRESIÓN DE VIDEO PARA WEB
 * ----------------------------
 * Reencoda los MP4 declarados abajo a un tamaño que se pueda servir desde
 * el propio sitio.
 *
 *     npm run media:video
 *
 * POR QUÉ EXISTE
 *
 * El máster del coach espiritual salía de edición a 1080x1920 y 15.4 Mbps:
 * 167 MB para 91 segundos. Eso choca con tres límites a la vez.
 *
 *  1) Cloudflare Workers no acepta archivos estáticos de más de 25 MiB.
 *  2) GitHub rechaza archivos de más de 100 MB.
 *  3) Y el peor, porque no da error sino un marco negro: para reproducirse
 *     sin cortes hace falta bajar 15.4 Mbps sostenidos. Una conexión 4G
 *     normal no los da, así que Safari en iPhone se queda esperando datos
 *     y no pinta un solo fotograma. Fue exactamente lo que pasó al
 *     servirlo desde almacenamiento externo: el problema nunca fue dónde
 *     estaba alojado, era el bitrate.
 *
 * DECISIONES DEL PERFIL
 *
 * · 720x1280 y no 1080x1920. El video se muestra en un marco de unos 400 px
 *   de ancho; a 720 ya se está enviando casi el doble de píxeles de los que
 *   la pantalla puede enseñar, incluso contando pantallas de alta densidad.
 * · CRF 27 con `veryslow`. CRF fija calidad y deja variar el tamaño, que es
 *   lo correcto cuando el objetivo es que se vea bien, no acertar un peso
 *   exacto. El preset lento tarda más en codificar una sola vez y ahorra
 *   megas en todas las visitas.
 * · `-movflags +faststart` mueve el índice al principio del archivo para que
 *   el navegador empiece a reproducir sin bajarlo entero.
 * · Audio AAC a 96 kbps mono: es una persona hablando, no música.
 * · `-pix_fmt yuv420p` porque Safari no decodifica otros submuestreos.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import ffmpeg from 'ffmpeg-static';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Máster → destino dentro de /public. Los másteres viven fuera del build. */
const VIDEOS = [
  {
    from: join(ROOT, 'media-fuente', 'couchespiritual.mp4'),
    to: join(ROOT, 'public', 'fabio-coach-espiritual.mp4'),
    note: 'coach espiritual · bloque de acompañamiento',
  },
];

/** Ancho máximo de salida. La altura se calcula manteniendo la proporción. */
const MAX_WIDTH = 720;

/** Calidad constante. Más alto = más pequeño y peor. 23 es visualmente sin
 *  pérdida; 27 es el punto donde el ahorro todavía no se nota en pantalla. */
const CRF = 27;

const mb = (bytes) => (bytes / 1048576).toFixed(1);

console.log('\n  Compresión de video\n');

let procesados = 0;

for (const video of VIDEOS) {
  if (!existsSync(video.from)) {
    console.log(`  · falta el máster, se omite: ${video.from}`);
    continue;
  }

  const antes = statSync(video.from).size;
  console.log(`  ${video.note}`);
  console.log(`    origen  ${mb(antes)} MB — codificando, esto tarda…`);

  execFileSync(
    ffmpeg,
    [
      '-y',
      '-i', video.from,
      // -2 deja que ffmpeg elija la altura par que conserve la proporción.
      '-vf', `scale=${MAX_WIDTH}:-2`,
      '-c:v', 'libx264',
      '-preset', 'veryslow',
      '-crf', String(CRF),
      '-profile:v', 'high',
      '-pix_fmt', 'yuv420p',
      '-c:a', 'aac',
      '-b:a', '96k',
      '-ac', '1',
      '-movflags', '+faststart',
      video.to,
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  );

  const despues = statSync(video.to).size;
  const ahorro = Math.round((1 - despues / antes) * 100);
  console.log(`    salida  ${mb(despues)} MB — ${ahorro}% menos\n`);
  procesados += 1;
}

console.log(`  ${procesados} video(s) listos para servir desde /public\n`);
