/**
 * REMATE DEL BUILD
 * ----------------
 * Se ejecuta después de `ng build`, cuando el prerender ya escribió todo.
 *
 *     npm run build   (encadenado al final)
 *
 * POR QUÉ EXISTE
 *
 * Angular prerenderiza la ruta `/404` como `404/index.html`, que es la forma
 * correcta de publicar una ruta. Pero Cloudflare, para devolver un estado 404
 * de verdad ante una URL inexistente, busca un archivo llamado `404.html` en
 * la raíz de lo publicado.
 *
 * Sin esa copia, `not_found_handling: "404-page"` no encuentra nada y cae al
 * comportamiento anterior: servir la portada con estado 200. Para Google eso
 * es un «soft 404», y acaba indexando direcciones que no existen.
 *
 * Es una copia, no un movimiento: `/404` sigue siendo una URL navegable.
 */

import { copyFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BROWSER = join(ROOT, 'dist', 'landing', 'browser');

const from = join(BROWSER, '404', 'index.html');
const to = join(BROWSER, '404.html');

if (!existsSync(from)) {
  console.error(
    '\n  No existe 404/index.html.\n' +
      '  La ruta /404 debe estar en prerender-routes.txt y en app.routes.ts.\n',
  );
  process.exit(1);
}

copyFileSync(from, to);

const kb = Math.round(statSync(to).size / 1024);
console.log(`\n  404.html publicado (${kb} KB) — Cloudflare ya puede devolver un 404 real\n`);
