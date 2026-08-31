/**
 * Descarga las tipografías de Google Fonts a `public/fonts` y escribe la
 * hoja `src/styles/_fonts.scss` que las declara localmente.
 *
 * POR QUÉ SE ALOJAN EN EL PROPIO DOMINIO
 * --------------------------------------
 * Servidas desde Google, las fuentes cuestan dos conexiones a un tercero
 * (`fonts.googleapis.com` para el CSS y `fonts.gstatic.com` para los
 * archivos) en el camino crítico del render, y la segunda ni siquiera
 * empieza hasta que la primera responde. Alojadas aquí viajan por la
 * conexión ya abierta del sitio, así que el texto pinta antes: es la
 * mejora de LCP más directa que le queda a esta página.
 *
 * Solo se baja el subconjunto `latin`. El castellano cabe entero ahí
 * (á é í ó ú ñ ü ¿ ¡); cyrillic, griego y vietnamita eran peso muerto.
 *
 * Uso: npm run media:fonts
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FONTS_DIR = join(ROOT, 'public', 'fonts');
/**
 * Las declaraciones van al pipeline de estilos, no a /public: así viajan
 * dentro de `styles.css`, que el navegador ya tiene que descargar, en
 * lugar de costar una petición extra que bloquea el render.
 */
const FACES_FILE = join(ROOT, 'src', 'styles', '_fonts.scss');

/** Sin User-Agent moderno, Google devuelve TTF en vez de WOFF2. */
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const SOURCE_URL =
  'https://fonts.googleapis.com/css2' +
  '?family=Open+Sans:wght@400;500;600;700' +
  '&family=Poppins:wght@500;600;700;800' +
  '&display=swap';

/** Único subconjunto que necesita el castellano. */
const SUBSET = 'latin';

const slug = (family) => family.toLowerCase().replace(/\s+/g, '-');

/** Parte la hoja de Google en bloques `@font-face` con su subconjunto. */
const parseFaces = (css) => {
  const faces = [];
  const blocks = css.split('/*').slice(1);

  for (const block of blocks) {
    const subset = block.slice(0, block.indexOf('*/')).trim();
    if (subset !== SUBSET) continue;

    const family = block.match(/font-family:\s*'([^']+)'/)?.[1];
    const weight = block.match(/font-weight:\s*(\d+)/)?.[1];
    const url = block.match(/src:\s*url\(([^)]+)\)/)?.[1];
    const range = block.match(/unicode-range:\s*([^;]+);/)?.[1];
    if (!family || !weight || !url) continue;

    faces.push({ family, weight, url, range: range?.trim() });
  }

  return faces;
};

const response = await fetch(SOURCE_URL, { headers: { 'User-Agent': UA } });
if (!response.ok) {
  throw new Error(`Google Fonts respondió ${response.status}`);
}

const faces = parseFaces(await response.text());
if (faces.length === 0) {
  throw new Error(`No se encontró ningún bloque del subconjunto "${SUBSET}"`);
}

await mkdir(FONTS_DIR, { recursive: true });

/**
 * Varias familias son variables: distintos pesos comparten un mismo
 * archivo. Se descarga una vez por URL y se reutiliza en cada `@font-face`.
 */
const downloaded = new Map();
const declarations = [];

for (const face of faces) {
  let file = downloaded.get(face.url);

  if (!file) {
    const asset = await fetch(face.url, { headers: { 'User-Agent': UA } });
    if (!asset.ok) throw new Error(`No se pudo bajar ${face.url}`);

    file = `${slug(face.family)}-${SUBSET}-${downloaded.size + 1}.woff2`;
    await writeFile(join(FONTS_DIR, file), Buffer.from(await asset.arrayBuffer()));
    downloaded.set(face.url, file);
  }

  declarations.push(
    [
      '@font-face {',
      `  font-family: '${face.family}';`,
      '  font-style: normal;',
      `  font-weight: ${face.weight};`,
      '  font-display: swap;',
      `  src: url('/fonts/${file}') format('woff2');`,
      face.range ? `  unicode-range: ${face.range};` : null,
      '}',
    ]
      .filter(Boolean)
      .join('\n'),
  );
}

const header = [
  '/* ============================================================',
  '   Generado por scripts/download-fonts.mjs. No editar a mano.',
  `   Fuente: ${SOURCE_URL}`,
  `   Subconjunto: ${SUBSET}`,
  '   ============================================================ */',
  '',
].join('\n');

await writeFile(FACES_FILE, header + declarations.join('\n\n') + '\n');

console.log(
  `Tipografías locales: ${downloaded.size} archivos WOFF2 en public/fonts, ` +
    `${declarations.length} declaraciones en src/styles/_fonts.scss`,
);
