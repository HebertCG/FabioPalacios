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
 * Retrato del héroe. Es el LCP de la página: la imagen que decide la
 * métrica que Google mide. El original solo tiene 430 px de ancho, así
 * que no hay tamaños intermedios que generar; toda la ganancia viene
 * del cambio de formato (PNG de 249 KB a AVIF de 13 KB).
 */
export const HERO_IMAGE: ImageVariant = {
  file: 'dr-fabio-palacios-cirujano-oncologo-piura.png',
  widths: [430],
  note: 'retrato del héroe (LCP)',
};

/** Fotografías verticales de las vistas dos y tres del héroe. */
export const HERO_CAROUSEL_IMAGES: readonly ImageVariant[] = [
  {
    file: 'Imagenprincipal_1.jpg',
    widths: [480, 800, 1200],
    note: 'héroe: trayectoria y comunidad médica',
  },
  {
    file: 'ImagenPrincipal_2.jpg',
    widths: [480, 800, 1086],
    note: 'héroe: experiencia en cirugía',
  },
];

/** Retrato vertical en quirófano de la sección "Sobre mí". */
export const ABOUT_IMAGE: ImageVariant = {
  file: 'dr-fabio-palacios-cirugia-oncologica-quirofano.jpg',
  widths: [659],
  note: 'retrato en quirófano',
};

/** Fotografías que acompañan el relato de trayectoria en "Sobre mí". */
export const DOCTOR_GALLERY_IMAGES: readonly ImageVariant[] = [
  {
    file: 'imagendoctor_1.jpg',
    widths: [480, 800, 1200],
    note: 'galería: técnica laparoscópica',
  },
  {
    file: 'imagendoctor_2.jpg',
    widths: [480, 800, 1200],
    note: 'galería: equipo quirúrgico',
  },
  {
    file: 'imagendoctor_3.jpg',
    widths: [480],
    note: 'galería: experiencia clínica',
  },
  {
    file: 'imagendoctor_4.jpg',
    widths: [480, 800],
    note: 'galería: cirugía laparoscópica',
  },
  {
    file: 'imagendoctor_5.jpg',
    widths: [480, 800, 1200],
    note: 'galería: comunidad médica',
  },
  {
    file: 'imagendoctor_6.jpg',
    widths: [480, 800, 1200],
    note: 'galería: formación en el INEN',
  },
];

/**
 * Retrato de la sección de atención. El original es de 1772 px y nunca
 * se muestra por encima de unos 700: era la imagen con más peso
 * desperdiciado de toda la página, 786 KB para mostrar 700.
 */
export const PROCESS_IMAGE: ImageVariant = {
  file: 'dr-fabio-palacios-consulta-oncologica-piura.png',
  widths: [700, 1000, 1400],
  note: 'retrato de la sección de atención',
};

/** Fotografías del nuevo relato personal, comunitario y profesional. */
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
    file: 'fabio/fabio-familia.jpg',
    widths: [480, 800],
    note: 'celebración familiar',
  },
  {
    file: 'fabio/fabio-innovacion-quirurgica.jpg',
    widths: [480, 800],
    note: 'formación en innovación quirúrgica',
  },
  {
    file: 'fabio/fabio-equipo-medico.jpg',
    widths: [640, 1200],
    note: 'equipo médico en Piura',
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

/** Anchos de las ilustraciones de especialidad: ocupan media pantalla. */
export const SPECIALTY_WIDTHS = [600, 900, 1200] as const;

/** Los seis archivos de /public/specialties, en el orden de la retícula. */
const SPECIALTY_FILES = [
  'cirugia-cancer-digestivo',
  'cirugia-cancer-cabeza-cuello',
  'cirugia-tumores-retroperitoneales',
  'cirugia-cancer-mama-partes-blandas',
  'cirugia-cancer-urologico',
  'cirugia-cancer-ginecologico',
];

/** Todo lo que el optimizador debe procesar. */
export const IMAGE_VARIANTS: readonly ImageVariant[] = [
  HERO_IMAGE,
  ...HERO_CAROUSEL_IMAGES,
  ABOUT_IMAGE,
  ...DOCTOR_GALLERY_IMAGES,
  PROCESS_IMAGE,
  ...STORY_IMAGES,
  ...SPECIALTY_FILES.map((name) => ({
    file: `specialties/${name}.jpg`,
    widths: SPECIALTY_WIDTHS,
    note: 'ilustración de especialidad',
  })),
];

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
