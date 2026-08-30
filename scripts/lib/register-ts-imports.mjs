/**
 * Activa el hook de `ts-import-hooks.mjs`.
 *
 * Se carga con `node --import ./scripts/lib/register-ts-imports.mjs`,
 * antes que el script principal: los `import` de un módulo ESM se
 * resuelven al inicio, así que registrarlo dentro del propio script
 * llegaría tarde.
 */
import { register } from 'node:module';

register('./ts-import-hooks.mjs', import.meta.url);
