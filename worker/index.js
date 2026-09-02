/**
 * WORKER — SOLO PARA SERVIR VIDEO POR RANGOS
 * ------------------------------------------
 * Este proyecto no tiene lógica de servidor y no debería tenerla: es una
 * landing que Angular prerenderiza a HTML. Este archivo es la única
 * excepción, y existe por un motivo concreto y medido.
 *
 * EL PROBLEMA
 *
 * Los recursos estáticos de Cloudflare Workers ignoran la cabecera `Range`:
 * ante `Range: bytes=0-1023` responden `200 OK` con el archivo entero, y no
 * envían `Accept-Ranges`. Comprobado contra los dos hosts con la misma
 * petición:
 *
 *     Vercel Blob  ->  206 Partial Content ·      1 024 bytes
 *     Cloudflare   ->  200 OK              · 11 868 777 bytes
 *
 * Safari en iOS exige respuestas parciales para reproducir un <video>. Sin
 * ellas no arranca: se queda en el póster, congelado. No es lentitud ni
 * tamaño —el archivo son 11 MB— es que el navegador no empieza.
 *
 * LO QUE HACE
 *
 * Intercepta únicamente las peticiones de `.mp4` que traen `Range` y arma la
 * respuesta 206 a mano. Todo lo demás —HTML, JS, CSS, imágenes, tipografías y
 * el fallback de la SPA— sigue saliendo del almacén de assets sin tocarse,
 * que es la ruta rápida de la plataforma.
 *
 * `run_worker_first` en wrangler.jsonc limita a `/*.mp4` los caminos que
 * pasan por aquí; el resto ni siquiera despierta al Worker.
 */

/** Traduce `bytes=inicio-fin` a índices. Devuelve null si no se entiende. */
function parseRange(header, total) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match) return null;

  const [, rawStart, rawEnd] = match;

  // `bytes=-500` significa los últimos 500 bytes, no «hasta el 500».
  if (rawStart === '') {
    if (rawEnd === '') return null;
    const length = Math.min(Number(rawEnd), total);
    return { start: total - length, end: total - 1 };
  }

  const start = Number(rawStart);
  if (start >= total) return null;

  const end = rawEnd === '' ? total - 1 : Math.min(Number(rawEnd), total - 1);
  if (end < start) return null;

  return { start, end };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const range = request.headers.get('Range');

    // Cualquier cosa que no sea un vídeo con rango va por la ruta normal.
    if (!range || !url.pathname.endsWith('.mp4')) {
      return env.ASSETS.fetch(request);
    }

    // Se pide el archivo completo al almacén sin la cabecera Range, porque
    // reenviarla devolvería otra vez un 200 con todo el cuerpo.
    const asset = await env.ASSETS.fetch(new Request(url.toString(), { method: 'GET' }));
    if (!asset.ok) return asset;

    const buffer = await asset.arrayBuffer();
    const total = buffer.byteLength;
    const parsed = parseRange(range, total);

    // Rango imposible: la respuesta correcta es 416 con el tamaño real, para
    // que el navegador pueda reintentar sabiendo cuánto mide el archivo.
    if (!parsed) {
      return new Response(null, {
        status: 416,
        headers: {
          'Content-Range': `bytes */${total}`,
          'Accept-Ranges': 'bytes',
        },
      });
    }

    const { start, end } = parsed;
    const headers = new Headers(asset.headers);
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Content-Range', `bytes ${start}-${end}/${total}`);
    headers.set('Content-Length', String(end - start + 1));

    return new Response(buffer.slice(start, end + 1), { status: 206, headers });
  },
};
