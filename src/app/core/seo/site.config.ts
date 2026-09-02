/**
 * CONFIGURACIÓN SEO DEL SITIO
 * ---------------------------
 * Fuente única de verdad para todo lo que Google, Bing, WhatsApp y las
 * redes leen de esta página: dominio, títulos, descripciones, imágenes
 * sociales, perfiles oficiales y datos del negocio local.
 *
 * El contenido clínico y de identidad NO se repite aquí: vive en
 * `core/data/doctor.data.ts` y este archivo lo importa. Así una
 * corrección del doctor se propaga a la vez a la página visible, a las
 * etiquetas meta, al JSON-LD y al sitemap.
 *
 * Lo consumen tres piezas:
 *  · `core/seo/seo.ts`              → etiquetas meta, título, canonical
 *  · `core/seo/structured-data.ts`  → JSON-LD (Schema.org)
 *  · `scripts/generate-sitemap.mjs` → sitemap.xml y robots.txt
 *
 * PENDIENTE DE CONFIRMAR  →  buscar el marcador `TODO:`
 */

import { CONTACT, DOCTOR } from '../data/doctor.data';

/* ============================================================
   DOMINIO
   ============================================================ */

/**
 * Origen canónico, sin barra final.
 *
 * Cambiarlo aquí reescribe canonical, Open Graph, JSON-LD y sitemap.
 * TODO: confirmar el dominio definitivo antes de publicar. Si termina
 * siendo otro, este es el único punto a tocar.
 */
export const SITE_ORIGIN = 'https://drfabiopalacios.pe';

/** Une el origen con una ruta relativa y devuelve una URL absoluta. */
export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return SITE_ORIGIN + '/' + path.replace(/^\/+/, '');
}

/* ============================================================
   TEXTOS DE BÚSQUEDA
   ============================================================ */

/**
 * TÍTULO — se muestra en la pestaña y como titular azul en Google.
 *
 * Abre con el nombre y resume las tres dimensiones de la nueva página.
 * Mantiene la especialidad médica al final sin convertirla en el único
 * eje de la identidad. Google trunca cerca de los 60 caracteres.
 */
export const SEO_TITLE = `${DOCTOR.displayName} | Persona, conferencista y cirujano oncólogo`;

/**
 * DESCRIPCIÓN — el párrafo gris bajo el título en Google.
 *
 * Máximo útil: unos 155 caracteres. No es factor de posicionamiento
 * directo, pero decide el clic. Resume comunidad, familia, valores y
 * trabajo médico sin reducir la identidad de Fabio a su profesión.
 */
export const SEO_DESCRIPTION =
  `Conoce el lado humano de ${DOCTOR.displayName}: sus valores, su familia, las charlas que ` +
  `comparte con la comunidad y su trabajo como cirujano oncólogo en ${DOCTOR.city}.`;

/**
 * Descripción corta para tarjetas de redes, donde hay menos espacio y
 * el texto compite con la imagen.
 */
export const SEO_SOCIAL_DESCRIPTION =
  `Médico, conferencista y ciudadano de ${DOCTOR.city}. Una historia de comunidad, ` +
  `familia, servicio y vocación.`;

/**
 * Palabras clave. Google las ignora desde 2009; se conservan porque
 * varios directorios médicos peruanos y buscadores menores sí las leen,
 * y cuestan cero. No añadir términos que la página no cubra de verdad.
 */
export const SEO_KEYWORDS = [
  'Fabio Palacios',
  `conferencista ${DOCTOR.city}`,
  `charlas de salud ${DOCTOR.city}`,
  `cirujano oncólogo ${DOCTOR.city}`,
  `oncólogo ${DOCTOR.city}`,
  `cirugía oncológica ${DOCTOR.city}`,
  `cáncer de colon ${DOCTOR.city}`,
  `cáncer de mama ${DOCTOR.city}`,
  `cáncer de estómago ${DOCTOR.city}`,
  `cáncer de tiroides ${DOCTOR.city}`,
  `segunda opinión oncológica ${DOCTOR.city}`,
  `cirujano oncólogo ${DOCTOR.district}`,
  'oncólogo Sullana',
  'oncólogo Talara',
  'oncólogo Tumbes',
].join(', ');

/** Idioma y región. `es-PE` le dice a Google que el público es peruano. */
export const SITE_LOCALE = 'es-PE';
export const SITE_LOCALE_OG = 'es_PE';

/**
 * ÚLTIMA REVISIÓN CLÍNICA DEL CONTENIDO (formato AAAA-MM-DD).
 *
 * Va al JSON-LD como `lastReviewed` y `dateModified`. En contenido de
 * salud —lo que Google llama YMYL, "your money or your life"— saber que
 * un médico revisó el texto y cuándo es una señal de calidad explícita
 * en sus directrices para evaluadores.
 *
 * Es una constante y no `new Date()` a propósito: debe ser la fecha en
 * que el doctor revisó el contenido, no la del último build. Un valor
 * calculado además cambiaría entre el prerender y el navegador, y
 * rompería la hidratación.
 *
 * TODO: actualizar esta fecha cada vez que el doctor revise y apruebe
 * los textos clínicos (especialidades, preguntas frecuentes, sobre mí).
 */
export const CONTENT_LAST_REVIEWED = '2026-08-25';

/* ============================================================
   IMÁGENES
   ============================================================ */

/**
 * IMAGEN SOCIAL (Open Graph) — la miniatura que aparece cuando alguien
 * comparte el enlace por WhatsApp, Facebook o LinkedIn.
 *
 * WhatsApp es el canal principal de este consultorio, así que esta
 * imagen se ve más veces que cualquier resultado de Google.
 *
 * La genera `npm run media:og` a 1200x630, la proporción 1.91:1 que
 * recortan todas esas plataformas. Antes se usaba el retrato cuadrado
 * de 1772x1772, que llegaba recortado por arriba y por abajo y perdía
 * el nombre y la especialidad justo en el formato donde más se comparte.
 */
export const SEO_SOCIAL_IMAGE = {
  path: 'og-fabio-palacios-historia-valores.jpg',
  width: 1200,
  height: 630,
  type: 'image/jpeg',
  alt: `${DOCTOR.displayName} junto a la comunidad, compartiendo una historia de cercanía y servicio`,
} as const;

/** Fotografía del héroe: es el LCP y la imagen principal de la página. */
export const SEO_PRIMARY_IMAGE = {
  path: 'fabio/fabio-comunidad-portada.jpg',
  width: 2048,
  height: 1536,
  alt: `${DOCTOR.displayName} junto a personas de la comunidad después de una charla`,
} as const;

/* ============================================================
   NEGOCIO LOCAL
   ============================================================ */

/**
 * COORDENADAS DEL CONSULTORIO.
 *
 * Deliberadamente `null`. Una coordenada equivocada en el JSON-LD es
 * peor que ninguna: contradice la dirección postal y Google puede
 * ubicar el consultorio en el punto equivocado del mapa. Sin `geo`,
 * Google geocodifica la dirección postal, que sí está verificada.
 *
 * TODO: abrir el consultorio en Google Maps, clic derecho sobre el
 * punto exacto, copiar las coordenadas y reemplazar por
 * `{ latitude: -5.xxxx, longitude: -80.xxxx }`. El JSON-LD las incluye
 * automáticamente en cuanto dejen de ser `null`.
 */
export const SITE_GEO: { latitude: number; longitude: number } | null = null;

/** Un tramo de horario tal como lo expresa Schema.org. */
export interface OpeningHours {
  /** Días en inglés: 'Monday', 'Tuesday'… lo exige Schema.org */
  readonly days: readonly string[];
  /** Hora de apertura en formato 24h, 'HH:MM' */
  readonly opens: string;
  /** Hora de cierre en formato 24h, 'HH:MM' */
  readonly closes: string;
}

/**
 * HORARIOS EN FORMATO SCHEMA.ORG.
 *
 * También `null` a propósito. `CONTACT.hours` dice hoy "previa cita",
 * que no es un horario que Schema.org pueda expresar. Publicar un
 * horario inventado hace que Google muestre "abierto ahora" cuando el
 * consultorio está cerrado, y eso produce pacientes molestos.
 *
 * TODO: cuando el doctor confirme sus días y horas de consulta,
 * reemplazar por un arreglo como:
 *   [{ days: ['Monday', 'Wednesday', 'Friday'], opens: '16:00', closes: '20:00' }]
 */
export const SITE_OPENING_HOURS: readonly OpeningHours[] | null = null;

/**
 * Perfiles oficiales del doctor.
 *
 * Alimentan `sameAs` en el JSON-LD, que es como Google confirma que el
 * consultorio, el Facebook, el TikTok y el perfil de Doctoralia son la
 * misma persona. Es la señal que más pesa para que llegue a aparecer un
 * panel de conocimiento con su nombre.
 *
 * Solo URLs verificadas: un `sameAs` erróneo diluye la entidad.
 */
export const SITE_SAME_AS: readonly string[] = [
  'https://www.facebook.com/DrFabioPalacios/',
  'https://www.tiktok.com/@dr..fabio.palacio',
  'https://www.instagram.com/fabio_oncologo/',
  // TODO: añadir el perfil de Doctoralia cuando el doctor confirme que
  // la ficha le pertenece y está actualizada.
];

/** Zonas de captación. Se declaran en `areaServed` del JSON-LD. */
export const SITE_AREA_SERVED: readonly {
  readonly type: 'City' | 'State';
  readonly name: string;
}[] = [
  { type: 'City', name: 'Piura' },
  { type: 'City', name: 'Castilla' },
  { type: 'City', name: 'Sullana' },
  { type: 'City', name: 'Talara' },
  { type: 'City', name: 'Paita' },
  { type: 'State', name: 'Tumbes' },
];

/** Dirección postal ya partida en los campos que pide Schema.org. */
export const SITE_ADDRESS = {
  streetAddress: `${CONTACT.address}, ${CONTACT.addressLine2.split(',')[0]}`,
  addressLocality: DOCTOR.district,
  addressRegion: DOCTOR.city,
  postalCode: '20001',
  addressCountry: 'PE',
} as const;
