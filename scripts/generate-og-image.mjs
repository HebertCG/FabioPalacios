/**
 * Compone la imagen social (Open Graph) de 1200x630.
 *
 * POR QUÉ ESTA IMAGEN IMPORTA MÁS QUE UN RESULTADO DE GOOGLE
 * ---------------------------------------------------------
 * El canal principal de este consultorio es WhatsApp: los pacientes se
 * pasan el enlace entre familiares. Esa miniatura se ve muchas más
 * veces que cualquier posición en un buscador, y es lo único que
 * acompaña al enlace cuando alguien lo reenvía.
 *
 * Antes se usaba el retrato cuadrado de 1772x1772. WhatsApp, Facebook y
 * LinkedIn recortan a 1.91:1, así que le cortaban la cabeza y los pies y
 * no quedaba ni el nombre ni la especialidad. Esta versión ya nace con
 * la proporción correcta: retrato a la derecha, identidad a la
 * izquierda, sobre el azul de marca.
 *
 * El retrato es la silueta recortada del héroe, no la fotografía
 * cuadrada: esa última es un flyer con el nombre y el teléfono ya
 * incrustados, y al recortarla a 1.91:1 partía su propio texto por la
 * mitad. La silueta, en cambio, se compone limpia sobre el fondo.
 *
 * El texto se dibuja como SVG con la familia de sistema, no con
 * Poppins: librsvg usa las tipografías instaladas en la máquina y el
 * resultado variaría según dónde corra el build. La imagen se genera
 * una vez y se versiona, así que se compone en local y se publica el
 * JPG resultante.
 *
 * Uso: npm run media:og
 */

import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = join(ROOT, 'public');

/** Proporción que recortan WhatsApp, Facebook, LinkedIn y X. */
const WIDTH = 1200;
const HEIGHT = 630;

const PORTRAIT = join(PUBLIC_DIR, 'dr-fabio-palacios-cirujano-oncologo-piura.png');
const LOGO = join(PUBLIC_DIR, 'logo.png');
const OUTPUT = join(PUBLIC_DIR, 'og-dr-fabio-palacios-cirujano-oncologo-piura.jpg');

/** Franja del retrato, medida desde el borde derecho. */
const PORTRAIT_WIDTH = 420;

for (const file of [PORTRAIT, LOGO]) {
  if (!existsSync(file)) throw new Error(`No se encontró ${file}`);
}

/** Azul profundo de la marca (--brand-950 y --brand-800 en los tokens). */
const background = Buffer.from(
  `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
     <defs>
       <linearGradient id="fondo" x1="0" y1="0" x2="1" y2="1">
         <stop offset="0" stop-color="#072634"/>
         <stop offset="0.55" stop-color="#0c3f56"/>
         <stop offset="1" stop-color="#11536e"/>
       </linearGradient>
     </defs>
     <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#fondo)"/>
   </svg>`,
);

/**
 * La silueta se ancla al borde inferior, como si el doctor se apoyara
 * en el filo de la tarjeta. `contain` conserva su proporción: un
 * `cover` le habría recortado la cabeza.
 */
const PORTRAIT_HEIGHT = 596;

const portrait = await sharp(PORTRAIT)
  .resize({
    width: PORTRAIT_WIDTH,
    height: PORTRAIT_HEIGHT,
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

/**
 * El logo trae su propio fondo blanco opaco. Sobre el azul de marca eso
 * sería un recuadro blanco, así que se recorta en disco igual que los
 * iconos de navegador.
 */
const LOGO_SIZE = 92;

const logoMask = Buffer.from(
  `<svg width="${LOGO_SIZE}" height="${LOGO_SIZE}" xmlns="http://www.w3.org/2000/svg">
     <circle cx="${LOGO_SIZE / 2}" cy="${LOGO_SIZE / 2}" r="${LOGO_SIZE / 2}" fill="#fff"/>
   </svg>`,
);

const logo = await sharp(LOGO)
  .trim({ threshold: 5 })
  .resize({ width: LOGO_SIZE, height: LOGO_SIZE, fit: 'contain', background: '#ffffff' })
  .ensureAlpha()
  .composite([{ input: logoMask, blend: 'dest-in' }])
  .png()
  .toBuffer();

const SANS = 'Segoe UI, Helvetica, Arial, sans-serif';

const text = Buffer.from(
  `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
     <text x="72" y="286" font-family="${SANS}" font-size="60" font-weight="700" fill="#ffffff">
       Dr. Fabio Palacios
     </text>
     <text x="72" y="348" font-family="${SANS}" font-size="34" font-weight="600" fill="#76d1ec">
       Cirujano Oncólogo General
     </text>
     <text x="72" y="414" font-family="${SANS}" font-size="26" fill="#c3d3db">
       Cirugía oncológica de alta complejidad en Piura
     </text>
     <text x="72" y="454" font-family="${SANS}" font-size="26" fill="#c3d3db">
       Formación en el INEN de Lima · CMP 066389
     </text>
     <rect x="72" y="510" width="132" height="4" rx="2" fill="#3fd9c0"/>
   </svg>`,
);

await sharp(background)
  .composite([
    { input: portrait, left: WIDTH - PORTRAIT_WIDTH - 40, top: HEIGHT - PORTRAIT_HEIGHT },
    { input: logo, left: 72, top: 82 },
    { input: text, left: 0, top: 0 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(OUTPUT);

console.log(`Imagen social ${WIDTH}x${HEIGHT} generada: ${OUTPUT}`);
