/**
 * AUDITORÍA SEO DEL HTML PUBLICADO
 * --------------------------------
 * Revisa `dist/landing/browser/index.html` —el archivo que de verdad
 * ve Google, no el código fuente— y falla si algo esencial se rompió.
 *
 *     npm run build && npm run seo:check
 *
 * POR QUÉ EXISTE
 * El SEO se degrada en silencio. Nadie nota que el prerender dejó de
 * funcionar, que una imagen perdió su `alt` o que aparecieron dos `h1`:
 * la página se sigue viendo igual. El daño aparece semanas después, en
 * el tráfico. Esto lo convierte en un error visible el mismo día.
 *
 * Las comprobaciones se ordenan por lo que costaría no detectarlas: un
 * fallo de prerender deja el sitio entero fuera del índice; un `alt`
 * ausente solo cuesta una imagen.
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { SEO_TITLE, SITE_ORIGIN } from '../src/app/core/seo/site.config.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist', 'landing', 'browser');
const INDEX = join(DIST, 'index.html');

/** Longitudes que Google trunca en resultados de escritorio. */
const TITLE_MAX = 60;
const DESCRIPTION_MAX = 160;
const DESCRIPTION_MIN = 70;

const failures = [];
const warnings = [];
const passes = [];

const fail = (message) => failures.push(message);
const warn = (message) => warnings.push(message);
const pass = (message) => passes.push(message);

/* ============================================================
   CARGA
   ============================================================ */

if (!existsSync(INDEX)) {
  console.error(`\nNo existe ${INDEX}\nEjecute primero: npm run build\n`);
  process.exit(1);
}

const html = readFileSync(INDEX, 'utf8');
const head = html.slice(0, html.indexOf('</head>'));

/** Lee el `content` de una etiqueta meta por su atributo identificador. */
function meta(attr, key) {
  const match = head.match(new RegExp(`<meta[^>]*${attr}="${key}"[^>]*content="([^"]*)"`, 'i'));
  return match?.[1];
}

/* ============================================================
   1. PRERENDER — si esto falla, nada más importa
   ============================================================ */

/**
 * El contenido tiene que estar en el HTML, no detrás de JavaScript.
 * Se busca texto real de tres secciones distintas: si el prerender se
 * rompiera, el archivo volvería a ser un `<app-root>` vacío de 9 KB.
 */
const CONTENT_PROBES = [
  ['Cáncer digestivo', 'especialidades'],
  ['viajar a Lima', 'preguntas frecuentes'],
  ['Cayetano Heredia', 'formación'],
];

for (const [needle, section] of CONTENT_PROBES) {
  if (html.includes(needle)) {
    pass(`Prerender: la sección de ${section} está en el HTML`);
  } else {
    fail(
      `PRERENDER ROTO: no aparece "${needle}" (${section}) en el HTML. ` +
        `El contenido solo existiría tras ejecutar JavaScript.`,
    );
  }
}

/* ============================================================
   2. ETIQUETAS DE RESULTADO EN BUSCADOR
   ============================================================ */

const title = head.match(/<title>([^<]*)<\/title>/)?.[1];

if (!title) {
  fail('Falta la etiqueta <title>');
} else if (title !== SEO_TITLE) {
  fail(`El <title> publicado no coincide con SEO_TITLE: "${title}"`);
} else if (title.length > TITLE_MAX) {
  warn(`<title> de ${title.length} caracteres; Google trunca sobre ${TITLE_MAX}`);
} else {
  pass(`<title> correcto (${title.length} caracteres)`);
}

const description = meta('name', 'description');

if (!description) {
  fail('Falta la meta description');
} else if (description.length > DESCRIPTION_MAX) {
  warn(
    `Meta description de ${description.length} caracteres; ` +
      `Google trunca sobre ${DESCRIPTION_MAX}`,
  );
} else if (description.length < DESCRIPTION_MIN) {
  warn(
    `Meta description de solo ${description.length} caracteres; ` +
      `se desaprovecha espacio en el resultado`,
  );
} else {
  pass(`Meta description correcta (${description.length} caracteres)`);
}

const canonical = head.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/)?.[1];

if (!canonical) {
  fail('Falta el enlace canonical');
} else if (!canonical.startsWith(SITE_ORIGIN)) {
  fail(`El canonical apunta fuera del dominio configurado: ${canonical}`);
} else {
  pass(`Canonical correcto (${canonical})`);
}

const robots = meta('name', 'robots');

if (!robots) {
  warn('Sin meta robots; se asume index, follow');
} else if (/noindex/i.test(robots)) {
  fail(`La meta robots contiene "noindex": la página no se indexará (${robots})`);
} else {
  pass('Meta robots permite indexación');
}

/* ============================================================
   3. TARJETA SOCIAL — es como se ve el enlace en WhatsApp
   ============================================================ */

const OG_REQUIRED = ['og:title', 'og:description', 'og:url', 'og:image', 'og:type', 'og:locale'];

const missingOg = OG_REQUIRED.filter((key) => !meta('property', key));

if (missingOg.length) {
  fail(`Faltan etiquetas Open Graph: ${missingOg.join(', ')}`);
} else {
  pass('Open Graph completo');
}

const ogImage = meta('property', 'og:image');

if (ogImage && !ogImage.startsWith('http')) {
  fail(`og:image debe ser una URL absoluta, no "${ogImage}"`);
}

if (!meta('property', 'og:image:alt')) {
  warn('Falta og:image:alt (accesibilidad de la tarjeta compartida)');
}

/* ============================================================
   4. DATOS ESTRUCTURADOS
   ============================================================ */

const jsonLdRaw = html.match(
  /<script id="schema-org-graph" type="application\/ld\+json">([\s\S]*?)<\/script>/,
)?.[1];

if (!jsonLdRaw) {
  fail('No se encontró el bloque JSON-LD de datos estructurados');
} else {
  try {
    const graph = JSON.parse(jsonLdRaw)['@graph'] ?? [];
    const types = new Set(graph.map((node) => node['@type']));
    const REQUIRED_TYPES = ['Person', 'Physician', 'WebSite', 'MedicalWebPage'];
    const missingTypes = REQUIRED_TYPES.filter((type) => !types.has(type));

    if (missingTypes.length) {
      fail(`Faltan nodos en el JSON-LD: ${missingTypes.join(', ')}`);
    } else {
      pass(`JSON-LD válido con ${graph.length} nodos`);
    }

    /**
     * Toda referencia `{"@id": ...}` tiene que apuntar a un nodo que
     * exista en el grafo. Una referencia rota hace que Google descarte
     * la relación en silencio, sin avisar en Search Console.
     */
    const declared = new Set(graph.map((node) => node['@id']).filter(Boolean));
    const referenced = new Set();

    const walk = (value) => {
      if (Array.isArray(value)) return value.forEach(walk);
      if (!value || typeof value !== 'object') return;
      const keys = Object.keys(value);
      if (keys.length === 1 && keys[0] === '@id') referenced.add(value['@id']);
      else Object.values(value).forEach(walk);
    };

    graph.forEach((node) => Object.values(node).forEach(walk));

    const dangling = [...referenced].filter((id) => !declared.has(id));

    if (dangling.length) {
      fail(`Referencias @id sin nodo destino: ${dangling.join(', ')}`);
    } else {
      pass('Las referencias internas del grafo resuelven correctamente');
    }
  } catch (error) {
    fail(`El JSON-LD no es JSON válido: ${error.message}`);
  }
}

/* ============================================================
   5. ESTRUCTURA DEL DOCUMENTO
   ============================================================ */

const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;

if (h1Count === 0) fail('La página no tiene <h1>');
else if (h1Count > 1) fail(`Hay ${h1Count} etiquetas <h1>; debe haber exactamente una`);
else pass('Un solo <h1>, como corresponde');

if (!/<html[^>]*lang="es-PE"/.test(html)) {
  warn('El atributo lang del <html> no es "es-PE"');
} else {
  pass('Idioma declarado como es-PE');
}

/* ============================================================
   6. IMÁGENES
   ============================================================ */

const images = [...html.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);

/**
 * Se acepta tanto `alt="…"` como el `alt` a secas. El serializador de
 * Angular escribe los atributos vacíos sin comillas, y para el HTML
 * `<img alt>` equivale a `<img alt="">`: imagen decorativa declarada
 * como tal. Buscar solo `alt=` daría por ausente lo que sí está.
 */
const withoutAlt = images.filter((tag) => !/\balt(?:=|[\s/>])/.test(tag));
const withoutSize = images.filter((tag) => !/\bwidth=/.test(tag) || !/\bheight=/.test(tag));

if (withoutAlt.length) {
  fail(
    `${withoutAlt.length} de ${images.length} imágenes sin atributo alt. ` +
      `Una imagen decorativa debe llevar alt="" explícito.`,
  );
} else {
  pass(`Las ${images.length} imágenes declaran alt`);
}

if (withoutSize.length) {
  warn(
    `${withoutSize.length} imágenes sin width/height. ` +
      `Provoca saltos de maquetación (CLS) al cargar.`,
  );
} else {
  pass('Todas las imágenes reservan su espacio con width y height');
}

/**
 * Cada archivo prometido en un `srcset` tiene que existir de verdad.
 *
 * Es el fallo silencioso clásico de las imágenes responsivas: se añade
 * un ancho al `srcset` que el optimizador nunca generó, el navegador lo
 * pide, recibe un 404 y cae al original. La página se ve exactamente
 * igual, así que nadie se entera de que la optimización dejó de
 * aplicarse y las imágenes volvieron a pesar cinco veces más.
 */
const srcsetFiles = new Set();

for (const match of html.matchAll(/srcset="([^"]+)"/g)) {
  for (const candidate of match[1].split(',')) {
    const url = candidate.trim().split(/\s+/)[0];
    if (url && !url.startsWith('http') && !url.startsWith('data:')) {
      srcsetFiles.add(url);
    }
  }
}

const missingVariants = [...srcsetFiles].filter((file) => !existsSync(join(DIST, file)));

if (missingVariants.length) {
  fail(
    `${missingVariants.length} archivos declarados en srcset no existen ` +
      `en el build (ejecute "npm run media:images"): ` +
      missingVariants.slice(0, 3).join(', ') +
      (missingVariants.length > 3 ? '…' : ''),
  );
} else if (srcsetFiles.size) {
  pass(`Las ${srcsetFiles.size} variantes de srcset existen en el build`);
}

/**
 * La precarga del LCP debe apuntar al archivo que el `<picture>`
 * elegirá. Si apunta a otro, el navegador descarga dos imágenes: la
 * precargada, que descarta, y la que de verdad usa.
 */
const preload = head.match(/<link[^>]*rel="preload"[^>]*as="image"[^>]*>/)?.[0];

if (!preload) {
  warn('Sin precarga de imagen: el LCP empezará a descargarse más tarde');
} else {
  const preloadHref = preload.match(/href="([^"]*)"/)?.[1];

  if (preloadHref && !existsSync(join(DIST, preloadHref))) {
    fail(`La imagen precargada no existe en el build: ${preloadHref}`);
  } else if (preloadHref && !srcsetFiles.has(preloadHref)) {
    warn(
      `La imagen precargada (${preloadHref}) no aparece en ningún srcset. ` +
        `Puede provocar una descarga doble.`,
    );
  } else {
    pass('La precarga del LCP coincide con la fuente que usará el navegador');
  }
}

/* ============================================================
   7. ARCHIVOS QUE EL RASTREADOR PIDE POR SU CUENTA
   ============================================================ */

for (const file of ['robots.txt', 'sitemap.xml', 'site.webmanifest']) {
  if (existsSync(join(DIST, file))) pass(`${file} publicado`);
  else fail(`Falta ${file} en la salida del build`);
}

/* ============================================================
   INFORME
   ============================================================ */

const line = '─'.repeat(64);

console.log(`\n${line}`);
console.log('  AUDITORÍA SEO — dist/landing/browser/index.html');
console.log(line);

console.log(`\n  Correcto (${passes.length})`);
for (const item of passes) console.log(`    ✓ ${item}`);

if (warnings.length) {
  console.log(`\n  Avisos (${warnings.length})`);
  for (const item of warnings) console.log(`    ! ${item}`);
}

if (failures.length) {
  console.log(`\n  Errores (${failures.length})`);
  for (const item of failures) console.log(`    ✗ ${item}`);
}

console.log(`\n${line}`);

if (failures.length) {
  console.log(`  RESULTADO: ${failures.length} error(es) que corregir\n`);
  process.exit(1);
}

console.log(`  RESULTADO: sin errores${warnings.length ? `, ${warnings.length} aviso(s)` : ''}\n`);
