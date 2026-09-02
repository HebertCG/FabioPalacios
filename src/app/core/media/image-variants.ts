/**
 * VARIANTES DE IMAGEN
 * -------------------
 * Declara qué imágenes se optimizan y a qué anchos. Es la fuente única
 * que consumen las dos mitades del sistema:
 *
 *  · `scripts/optimize-images.mjs` — lee esto para saber qué generar
 *  · las plantillas de Angular    — leen esto para escribir el `srcset`
 *
 * Tenerlo en un solo sitio evita el fallo silencioso más típico de las
 * imágenes responsivas: que el `srcset` prometa un `-900w.avif` que el
 * script nunca generó. El navegador lo pide, recibe un 404 y cae al
 * original, así que la página se ve bien y nadie se entera de que la
 * optimización dejó de aplicarse.
 *
 * LOS ANCHOS NO SON UNA ESCALA GENÉRICA. Salen de cómo se muestra cada
 * imagen en la maquetación real, contando el doble para pantallas de
 * alta densidad. Generar tamaños que ninguna pantalla pide solo llena
 * la carpeta y alarga el build.
 */

/** Formatos modernos, del que mejor comprime al de más compatibilidad. */
export const MODERN_FORMATS = ['avif', 'webp'] as const;

export type ModernFormat = (typeof MODERN_FORMATS)[number];

/** Una imagen que pasa por el optimizador. */
export interface ImageVariant {
  /** Ruta del original dentro de /public */
  readonly file: string;
  /** Anchos a generar, de menor a mayor */
  readonly widths: readonly number[];
  /** Para qué sirve la imagen; se imprime al ejecutar el script */
  readonly note: string;
}

/**
 * Retrato del bloque médico. Es el único superviviente de las imágenes de
 * la versión anterior: hoy lo usa la pieza en arco de «Mi lado de doctor».
 */
export const MEDICINE_PORTRAIT: ImageVariant = {
  file: 'ImagenPrincipal_2.jpg',
  widths: [480, 800, 1086],
  note: 'retrato en quirófano del bloque médico',
};

/** Fotografías del relato personal, comunitario y profesional. */
export const STORY_IMAGES: readonly ImageVariant[] = [
  {
    file: 'fabio/fabio-comunidad-portada.jpg',
    widths: [640, 1024, 1600, 2048],
    note: 'portada editorial con la comunidad',
  },
  {
    file: 'fabio/fabio-escuchando-comunidad.jpg',
    widths: [480, 800, 1200],
    note: 'Fabio junto a una asistente de su charla',
  },
  {
    file: 'fabio/fabio-cercano-comunidad.jpg',
    widths: [480, 800, 1200],
    note: 'encuentro cercano después de la charla',
  },
  {
    file: 'fabio/fabio-conferencia-oncologia.jpg',
    widths: [480, 800],
    note: 'Fabio en un congreso de oncología',
  },
  {
    file: 'fabio/fabio-charla-podcast.jpg',
    widths: [640, 1200, 1600],
    note: 'conversación educativa ante micrófonos',
  },
  {
    file: 'fabio/fabio-esposa-recuerdo.jpg',
    widths: [480, 720],
    note: 'recuerdo de Fabio junto a su esposa',
  },
  {
    file: 'fabio/fabio-esposa.jpg',
    widths: [640, 1200],
    note: 'Fabio junto a su esposa',
  },
  {
    file: 'fabio/fabio-familia-estudio.jpg',
    widths: [420, 720],
    note: 'retrato familiar de estudio',
  },
  {
    file: 'fabio/fabio-innovacion-quirurgica.jpg',
    widths: [480, 800],
    note: 'formación en innovación quirúrgica',
  },
  {
    file: 'fabio/fabio-familia-ceremonia.jpg',
    widths: [420, 720],
    note: 'familia: Fabio con un niño en brazos',
  },
  {
    file: 'fabio/fabio-cirugia-laparoscopica.jpg',
    widths: [480, 960],
    note: 'técnica laparoscópica en quirófano',
  },
  {
    file: 'fabio/fabio-explicando-estudio.jpg',
    widths: [480, 960],
    note: 'revisión de un estudio de imágenes con un colega',
  },
];

/** Todo lo que el optimizador debe procesar. */
export const IMAGE_VARIANTS: readonly ImageVariant[] = [...STORY_IMAGES, MEDICINE_PORTRAIT];

/* ============================================================
   CONSTRUCTORES DE RUTAS
   ============================================================ */

/**
 * Ruta de una variante concreta.
 *
 * `foto.png` + 640 + avif  →  `foto-640w.avif`
 *
 * El script escribe con esta misma convención, así que cambiarla aquí
 * la cambia en los dos lados a la vez.
 */
export function variantPath(file: string, width: number, format: ModernFormat): string {
  const dot = file.lastIndexOf('.');
  return `${file.slice(0, dot)}-${width}w.${format}`;
}

/**
 * Cadena `srcset` lista para un `<source>`.
 *
 * Con varios anchos devuelve `imagen-600w.avif 600w, imagen-900w.avif
 * 900w, …`. El descriptor `w` le dice al navegador el ancho real de
 * cada archivo, que junto con `sizes` es como elige cuál descargar. Sin
 * el descriptor no puede decidir y se lleva el mayor.
 *
 * Con un solo ancho devuelve la ruta a secas. Un descriptor `w`
 * solitario obligaría a declarar también `sizes` para que el navegador
 * lo interprete bien, y no hay nada que elegir: solo existe un archivo.
 */
export function srcsetFor(file: string, widths: readonly number[], format: ModernFormat): string {
  if (widths.length === 1) return variantPath(file, widths[0], format);

  return widths.map((width) => `${variantPath(file, width, format)} ${width}w`).join(', ');
}

/** Encuentra la configuración responsiva de una imagen declarada. */
export function imageVariantFor(file: string): ImageVariant {
  const target = IMAGE_VARIANTS.find((item) => item.file === file);
  if (!target) throw new Error(`No existe una variante de imagen declarada para: ${file}`);
  return target;
}
