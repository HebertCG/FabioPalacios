/**
 * GENERADOR DE ARCHIVOS SEO ESTÁTICOS
 * -----------------------------------
 * Escribe en /public los tres archivos que un buscador pide por su
 * cuenta, sin que nadie los enlace:
 *
 *   robots.txt        reglas de rastreo y dónde está el sitemap
 *   sitemap.xml       la URL del sitio y sus imágenes indexables
 *   site.webmanifest  identidad de la página al guardarla en el móvil
 *
 * POR QUÉ UN GENERADOR Y NO TRES ARCHIVOS A MANO
 * El sitemap tiene que listar cada imagen que queremos en Google
 * Imágenes. Esa lista sale de las especialidades y de las credenciales,
 * que viven en `doctor.data.ts` y cambian. Escrito a mano, el día que
 * se añada una séptima especialidad su imagen quedaría fuera del
 * sitemap y nadie lo notaría.
 *
 * Se ejecuta solo en cada `npm run build`. También a mano:
 *     npm run seo:files
 *
 * Lee los `.ts` directamente: Node 24 descarta las anotaciones de tipo
 * al importar, así que no hace falta compilar ni duplicar los datos.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { DOCTOR } from '../src/app/core/data/doctor.data.ts';
import { CREDENTIALS, SPECIALTIES } from '../src/app/core/data/doctor.data.ts';
import {
  CONTENT_LAST_REVIEWED,
  SEO_DESCRIPTION,
  SEO_PRIMARY_IMAGE,
  SEO_SOCIAL_IMAGE,
  SITE_ORIGIN,
} from '../src/app/core/seo/site.config.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = join(ROOT, 'public');

/** Escapa los cinco caracteres que romperían el XML. */
function xmlEscape(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Convierte una ruta relativa de /public en URL absoluta. */
function absolute(path) {
  return `${SITE_ORIGIN}/${String(path).replace(/^\/+/, '')}`;
}

/* ============================================================
   robots.txt
   ============================================================ */

/**
 * Se permite todo el rastreo. No hay zona privada que proteger y
 * cualquier `Disallow` de más solo puede quitar páginas del índice.
 *
 * Los rastreadores de IA (GPTBot, ClaudeBot, PerplexityBot) también
 * entran a propósito: para un especialista que empieza, que un
 * asistente lo cite al responder "cirujano oncólogo en Piura" es
 * exactamente el tipo de visibilidad que busca. Si el doctor prefiere
 * lo contrario, aquí es donde se les bloquea.
 *
 * `Disallow: /*?` evita que las URLs con parámetros de campaña
 * (`?fbclid=`, `?utm_source=`) se rastreen como páginas distintas. La
 * etiqueta canonical ya lo cubre, pero esto ahorra rastreo.
 */
function buildRobots() {
  return [
    '# robots.txt — generado por scripts/generate-seo-files.mjs',
    '# No editar a mano: se sobrescribe en cada build.',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    '# URLs con parámetros de campaña: mismo contenido, otra dirección.',
    'Disallow: /*?',
    '',
    '# Los videos pesan; que el rastreador no los descargue completos.',
    'Disallow: /*.mp4$',
    '',
    `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
    '',
  ].join('\n');
}

/* ============================================================
   sitemap.xml
   ============================================================ */

/**
 * Reúne las imágenes que vale la pena tener en Google Imágenes.
 *
 * Se omiten los logos de instituciones a propósito: son marcas
 * provisionales dibujadas para esta página (ver la nota en
 * `CREDENTIALS`), no material del doctor, y no aportan búsquedas.
 */
function collectImages() {
  return [
    absolute(SEO_PRIMARY_IMAGE.path),
    absolute(SEO_SOCIAL_IMAGE.path),
    absolute('retrato-quirofano.jpg'),
    ...SPECIALTIES.map((specialty) => absolute(specialty.image)),
  ];
}

/**
 * Sitemap con la extensión de imágenes de Google.
 *
 * Solo se emite `<image:loc>`. Google marcó como obsoletos
 * `image:title`, `image:caption`, `image:license` y `image:geo_location`
 * en mayo de 2022 y ya no los lee: el texto descriptivo lo toma del
 * `alt` y del contenido alrededor de la imagen, que es donde de verdad
 * hay que trabajarlo.
 */
function buildSitemap() {
  const images = collectImages()
    .map(
      (url) =>
        `    <image:image>\n      <image:loc>${xmlEscape(url)}</image:loc>\n    </image:image>`,
    )
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!-- Generado por scripts/generate-seo-files.mjs. No editar a mano. -->',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    '  <url>',
    `    <loc>${xmlEscape(SITE_ORIGIN)}/</loc>`,
    `    <lastmod>${CONTENT_LAST_REVIEWED}</lastmod>`,
    '    <changefreq>monthly</changefreq>',
    '    <priority>1.0</priority>',
    images,
    '  </url>',
    '</urlset>',
    '',
  ].join('\n');
}

/* ============================================================
   site.webmanifest
   ============================================================ */

/**
 * Manifiesto mínimo. No convierte el sitio en una aplicación instalable
 * —no hay service worker ni falta— pero define cómo se ve el icono y el
 * nombre cuando un paciente guarda la página en la pantalla de inicio
 * de su móvil, que es un gesto frecuente con el contacto de un médico.
 */
function buildManifest() {
  return `${JSON.stringify(
    {
      name: `${DOCTOR.displayName} — ${DOCTOR.specialty} en ${DOCTOR.city}`,
      short_name: DOCTOR.displayName,
      description: SEO_DESCRIPTION,
      lang: 'es-PE',
      dir: 'ltr',
      start_url: '/',
      scope: '/',
      display: 'browser',
      background_color: '#ffffff',
      theme_color: '#072634',
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
      ],
    },
    null,
    2,
  )}\n`;
}

/* ============================================================
   EJECUCIÓN
   ============================================================ */

mkdirSync(PUBLIC_DIR, { recursive: true });

const outputs = [
  ['robots.txt', buildRobots()],
  ['sitemap.xml', buildSitemap()],
  ['site.webmanifest', buildManifest()],
];

for (const [name, contents] of outputs) {
  writeFileSync(join(PUBLIC_DIR, name), contents, 'utf8');
  console.log(`  public/${name}`);
}

console.log(`\nSEO: ${outputs.length} archivos generados para ${SITE_ORIGIN}`);
