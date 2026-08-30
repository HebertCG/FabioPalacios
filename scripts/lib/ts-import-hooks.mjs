/**
 * Hook de resolución para importar los `.ts` del proyecto desde scripts
 * de Node.
 *
 * Node 24 ya sabe descartar las anotaciones de tipo al cargar un `.ts`,
 * pero su resolvedor sigue exigiendo la extensión en el import. Dentro
 * de `src/` los imports son al estilo TypeScript, sin extensión
 * (`'../data/doctor.data'`), porque los resuelve el compilador de
 * Angular. Este hook cierra esa diferencia: si un import relativo falla,
 * reintenta añadiendo `.ts`.
 *
 * Gracias a esto, los scripts de build leen los datos reales del doctor
 * en lugar de mantener una copia que se desincroniza.
 *
 * OJO CON LOS NOMBRES CON PUNTO: el proyecto tiene archivos como
 * `doctor.data.ts` y `site.config.ts`. Deducir "ya trae extensión"
 * mirando si hay un punto al final daría falsos positivos con `.data` y
 * `.config`, así que se comprueba contra la lista real de extensiones
 * que Node sabe cargar.
 */

/** Extensiones que Node resuelve por sí solo. */
const KNOWN_EXTENSIONS = ['.ts', '.mts', '.js', '.mjs', '.cjs', '.json', '.node'];

/** @type {import('node:module').ResolveHook} */
export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    const isRelative = specifier.startsWith('./') || specifier.startsWith('../');
    const alreadyResolvable = KNOWN_EXTENSIONS.some((ext) => specifier.endsWith(ext));

    if (!isRelative || alreadyResolvable) throw error;

    // Un módulo suelto (`../data/doctor.data` → `doctor.data.ts`), y si
    // no, una carpeta con índice (`../seo` → `seo/index.ts`).
    try {
      return await nextResolve(`${specifier}.ts`, context);
    } catch {
      return await nextResolve(`${specifier}/index.ts`, context);
    }
  }
}
