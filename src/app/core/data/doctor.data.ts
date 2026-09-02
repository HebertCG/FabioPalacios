/**
 * ÚNICA FUENTE DE VERDAD DEL CONTENIDO
 * ------------------------------------
 * Todo lo que dice la página sale de este archivo. Para cambiar un
 * texto, un teléfono o una especialidad, se edita aquí y se propaga
 * a todas las secciones.
 *
 * PROCEDENCIA DE LOS DATOS
 *  · Nombre, especialidad, CMP 066389, RNE 046335, las seis áreas
 *    quirúrgicas y el WhatsApp 906 418 375 provienen del material
 *    gráfico oficial del doctor, conservado en
 *    media-fuente/dr-fabio-palacios-cirujano-oncologo-piura-perfil.jpg.
 *  · Formación (UPCH, INEN, IRCAD), Sociedad Peruana de Cancerología,
 *    el consultorio de Castilla y su labor en EsSalud provienen de
 *    fuentes públicas: Doctoralia, su Facebook oficial, la cuenta del
 *    consultorio y una nota de prensa de EsSalud.
 *
 * PENDIENTE DE CONFIRMAR CON EL DOCTOR  →  buscar el marcador `TODO:`
 * Son datos que la página necesita y que aún no están verificados.
 */

import type { Credential, NavLink, Reel, SocialLink, Specialty } from '../models/content.models';

/* ============================================================
   IDENTIDAD
   ============================================================ */

export const DOCTOR = {
  firstName: 'Fabio',
  lastName: 'Palacios',
  /** Nombre de presentación en navbar, footer y metadatos */
  displayName: 'Fabio Palacios',
  navDescriptor: 'Médico y conferencista',
  specialty: 'Cirujano Oncólogo General',
  subSpecialty: 'Cavidad Abdominal',
  cmp: '066389',
  rne: '046335',
  city: 'Piura',
  district: 'Castilla',
  /** TODO: confirmar el apellido materno para el pie legal */
  legalName: 'Fabio Palacios',
} as const;

/* ============================================================
   CONTACTO
   ============================================================ */

export const CONTACT = {
  /** Del material oficial del doctor */
  whatsapp: '+51906418375',
  whatsappDisplay: '906 418 375',
  /**
   * TODO: existe un segundo número publicado por el consultorio
   * (982 430 073). Confirmar cuál es el de citas y descartar el otro.
   */
  altPhone: '+51982430073',
  altPhoneDisplay: '982 430 073',

  address: 'Av. Camino Solar Mz. AU Lt. 11',
  addressLine2: 'Urb. Miraflores Country Club, Castilla — Piura',
  /** TODO: reemplazar por el enlace real de Google Maps del consultorio */
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Av.+Camino+Solar+Mz.+AU+Lt.+11+Urb.+Miraflores+Country+Club+Castilla+Piura',
  mapsEmbedUrl:
    'https://www.google.com/maps?q=Av.%20Camino%20Solar%20Mz.%20AU%20Lt.%2011%2C%20Urb.%20Miraflores%20Country%20Club%2C%20Castilla%2C%20Piura&output=embed',

  /** TODO: confirmar horarios reales de consulta privada */
  hours: [{ days: 'Consultas', time: 'Previa cita' }],

  /** Mensaje con el que se abre WhatsApp desde cualquier botón */
  whatsappMessage: 'Hola doctor, escribo desde su página web. Quisiera agendar una consulta.',
} as const;

/** Construye el enlace de WhatsApp con el mensaje ya redactado. */
export function whatsappLink(message: string = CONTACT.whatsappMessage): string {
  const phone = CONTACT.whatsapp.replace(/\D/g, '');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/* ============================================================
   FORMACIÓN — alimenta la marquesina vertical
   ============================================================ */

/**
 * NOTA IMPORTANTE SOBRE LOS LOGOS
 * Los archivos en /public/logos son marcas provisionales diseñadas
 * para esta página. Usar el logo oficial de una institución requiere
 * su autorización expresa. Cuando el doctor confirme que la tiene,
 * se reemplaza el SVG y se marca `logoIsOfficial: true`.
 */
export const CREDENTIALS: readonly Credential[] = [
  {
    id: 'inen',
    institution: 'INEN',
    role: 'Residencia en Cirugía Oncológica',
    detail: 'Instituto Nacional de Enfermedades Neoplásicas — Lima',
    logo: 'logos/inen.svg',
    logoIsOfficial: false,
  },
  {
    id: 'ircad',
    institution: 'IRCAD América Latina',
    role: 'Cirugía mínimamente invasiva',
    detail: 'Entrenamiento en técnica laparoscópica avanzada',
    logo: 'logos/ircad.svg',
    logoIsOfficial: false,
  },
  {
    id: 'upch',
    institution: 'Cayetano Heredia',
    role: 'Médico Cirujano',
    detail: 'Universidad Peruana Cayetano Heredia',
    logo: 'logos/upch.svg',
    logoIsOfficial: false,
  },
  {
    id: 'spc',
    institution: 'Sociedad Peruana de Cancerología',
    role: 'Miembro',
    detail: 'Comunidad científica oncológica del Perú',
    logo: 'logos/spc.svg',
    logoIsOfficial: false,
  },
  {
    id: 'essalud',
    institution: 'EsSalud — Red Piura',
    role: 'Cirujano oncólogo',
    detail: 'Hospital III José Cayetano Heredia',
    logo: 'logos/essalud.svg',
    logoIsOfficial: false,
  },
  {
    id: 'cmp',
    institution: 'Colegio Médico del Perú',
    role: `CMP ${DOCTOR.cmp} · RNE ${DOCTOR.rne}`,
    detail: 'Especialista con registro nacional vigente',
    logo: 'logos/cmp.svg',
    logoIsOfficial: false,
  },
];

/* ============================================================
   ESPECIALIDADES — las seis áreas del material oficial
   ============================================================ */

/**
 * ORDEN IMPORTANTE: la retícula de esta sección tiene 4 columnas y las
 * áreas marcadas `featured` ocupan 2. El orden 2+1+1 / 2+1+1 rellena
 * las dos filas exactamente; cualquier otro orden deja huecos. Si se
 * añade o quita un área, hay que recalcular la secuencia.
 */
export const SPECIALTIES: readonly Specialty[] = [
  {
    id: 'digestive',
    title: 'Cáncer digestivo',
    organs: ['Esófago', 'Estómago', 'Hígado', 'Páncreas', 'Colon', 'Recto'],
    icon: 'digestive',
    image: 'specialties/cirugia-cancer-digestivo.jpg',
    imageAlt:
      'Ilustración del aparato digestivo humano: esófago, estómago, hígado, páncreas, colon y recto',
    featured: true,
  },
  {
    id: 'head-neck',
    title: 'Cáncer de cabeza y cuello',
    organs: ['Tiroides', 'Lengua', 'Mucosas', 'Piel'],
    icon: 'head-neck',
    image: 'specialties/cirugia-cancer-cabeza-cuello.jpg',
    imageAlt:
      'Ilustración anatómica de la región de cabeza y cuello, con la glándula tiroides y las vías aerodigestivas',
  },
  {
    id: 'retroperitoneal',
    title: 'Tumores retroperitoneales',
    organs: ['Retroperitoneo'],
    icon: 'retroperitoneal',
    image: 'specialties/cirugia-tumores-retroperitoneales.jpg',
    imageAlt: 'Ilustración del espacio retroperitoneal, detrás de la cavidad abdominal',
  },
  {
    id: 'breast',
    title: 'Cáncer de mama, piel y partes blandas',
    organs: ['Mama', 'Piel', 'Partes blandas'],
    icon: 'breast',
    image: 'specialties/cirugia-cancer-mama-partes-blandas.jpg',
    imageAlt: 'Ilustración anatómica de la glándula mamaria y los tejidos blandos que la rodean',
    featured: true,
  },
  {
    id: 'urologic',
    title: 'Cáncer urológico',
    organs: ['Próstata', 'Vejiga', 'Riñón', 'Testículo', 'Pene'],
    icon: 'urologic',
    image: 'specialties/cirugia-cancer-urologico.jpg',
    imageAlt: 'Ilustración del aparato urinario y genital masculino: riñones, vejiga y próstata',
  },
  {
    id: 'gynecologic',
    title: 'Cáncer ginecológico',
    organs: ['Cérvix', 'Útero', 'Ovario', 'Vulva', 'Vagina'],
    icon: 'gynecologic',
    image: 'specialties/cirugia-cancer-ginecologico.jpg',
    imageAlt: 'Ilustración del aparato reproductor femenino: útero, cérvix y ovarios',
  },
];

/* ============================================================
   ACOMPAÑAMIENTO — coach espiritual
   ============================================================ */

/**
 * ORIGEN DEL VIDEO — y por qué no sale de /public
 *
 * `npm run media:video` reencoda el máster a 720x1280 y 1 Mbps: de 167 MB a
 * 11.3 MB. Eso resolvió el bitrate, pero no la reproducción en Safari.
 *
 * Safari en iOS exige respuestas parciales (HTTP 206) para arrancar un
 * <video>, y los recursos estáticos de Cloudflare Workers ignoran la cabecera
 * `Range`: ante `bytes=0-1023` devuelven 200 con el archivo entero. Se probó
 * un Worker que armaba el 206 a mano; funcionaba, pero relee el archivo del
 * almacén en cada rango y añadía ~200 ms por petición, así que Safari seguía
 * trabándose y Chrome se volvió más lento. Está revertido.
 *
 * R2 sí devuelve rangos de forma nativa, y además más rápido que aquel
 * Worker. Medido contra este objeto:
 *
 *     bytes=0-1023        ->  206 · 0-1023/11868777
 *     bytes=5000000-…     ->  206 · salto correcto
 *     bytes=-500          ->  206 · cola correcta
 *     latencia            ->  ~0.46 s  (Worker: ~0.67 s)
 *
 * No hacen falta cabeceras CORS: el <video> no lleva `crossorigin`, así que
 * el navegador carga medios de otro origen sin pedirlas.
 *
 * El comprimido y el máster viven en media-fuente/, fuera del build.
 * `npm run media:video` regenera el comprimido si hay que volver a subirlo.
 *
 * TODO: cuando drfabiopalacios.pe esté activo, mover el bucket a un dominio
 * propio (media.drfabiopalacios.pe). La URL de desarrollo r2.dev va con
 * límite de peticiones y sin caché de CDN. Es cambiar solo esta línea.
 */
export const COACH_VIDEO = {
  src: 'https://pub-962d9bf96eef4a9a81745128a933f639.r2.dev/fabiovideos/fabio-coach-espiritual.mp4',
  /**
   * Primer fotograma con el rótulo del doctor. Se sirve desde el propio sitio
   * para que aparezca al instante, sin esperar al primer byte del video.
   */
  poster: 'fabio-coach-espiritual-poster.jpg',
  title: 'Un amigo en tu lucha',
  /** Leído de la cabecera del MP4 */
  durationSeconds: 91,
} as const;

/* ============================================================
   PREVENCIÓN
   ============================================================ */

/**
 * TODO: los temas de abajo son los que el doctor enumeró, pero SIN detalle
 * clínico. Él enviará el contenido y las ilustraciones de cada uno. No añadir
 * afirmaciones médicas que no vengan firmadas por él.
 */
export const PREVENTION = [
  {
    id: 'alimentacion',
    label: 'Alimentos saludables',
    body: 'Qué comer, cómo prepararlo y por qué la alimentación pesa en la prevención.',
  },
  {
    id: 'actividad',
    label: 'Actividad física',
    body: 'El papel del movimiento diario dentro de un plan de prevención.',
  },
  {
    id: 'riesgo',
    label: 'Factores de riesgo',
    body: 'Los hábitos y productos que conviene revisar, empezando por los alimentos procesados.',
  },
] as const;

/* ============================================================
   PROGRAMA DE SOBREVIVIENTES
   ============================================================ */

/** Las cuatro actividades que el doctor enumeró para el programa. */
export const SURVIVOR_PROGRAM = [
  { id: 'educacion', label: 'Charlas de educación' },
  { id: 'sobrevida', label: 'Charlas de sobrevida' },
  { id: 'manejo', label: 'Cómo manejar el cáncer' },
  { id: 'alimentacion', label: 'Cómo alimentarse' },
] as const;

/* ============================================================
   REELS — videos de TikTok en /public
   ============================================================ */

/**
 * TODO: los títulos y temas de abajo son PROVISIONALES — nadie ha visto
 * aún el contenido de los MP4. Reemplazar por el tema real de cada video
 * antes de publicar: se pintan en la tarjeta y son el texto alternativo
 * para accesibilidad y SEO. Las duraciones sí son reales: salen de la
 * cabecera de cada archivo.
 */
export const REELS: readonly Reel[] = [
  {
    id: 'reel-1',
    src: 'video-1.mp4',
    title: 'Señales de alerta que no debe ignorar',
    topic: 'Prevención',
    durationSeconds: 47,
  },
  {
    id: 'reel-2',
    src: 'video-2.mp4',
    title: '¿Qué es una cirugía oncológica?',
    topic: 'Cirugía',
    durationSeconds: 112,
  },
  {
    id: 'reel-3',
    src: 'video-3.mp4',
    title: 'Cáncer de colon: lo que debe saber',
    topic: 'Digestivo',
    durationSeconds: 91,
  },
  {
    id: 'reel-4',
    src: 'video-4.mp4',
    title: 'Preguntas frecuentes en consulta',
    topic: 'Consulta',
    durationSeconds: 90,
  },
  {
    id: 'reel-5',
    src: 'video-5.mp4',
    title: 'Mitos sobre el cáncer',
    topic: 'Educación',
    durationSeconds: 82,
  },
  {
    id: 'reel-6',
    src: 'video-6.mp4',
    title: 'Después de la operación',
    topic: 'Recuperación',
    durationSeconds: 74,
  },
  {
    id: 'reel-7',
    src: 'video-7.mp4',
    title: 'Conversación sobre prevención',
    topic: 'Comunidad',
    durationSeconds: 79,
  },
];

/* ============================================================
   PREGUNTAS FRECUENTES
   ============================================================ */

/**
 * TODO: estas respuestas están redactadas a partir de la información
 * pública disponible. El doctor debe revisarlas y corregirlas antes
 * de publicar: son afirmaciones clínicas hechas en su nombre.
 */

/* ============================================================
   REDES SOCIALES — dock flotante y pie de página
   ============================================================ */

export const SOCIALS: readonly SocialLink[] = [
  {
    id: 'whatsapp',
    label: 'Escribir por WhatsApp',
    url: whatsappLink(),
    enabled: true,
    keepOnMobile: true,
  },
  {
    id: 'facebook',
    label: 'Facebook del Dr. Fabio Palacios',
    url: 'https://www.facebook.com/DrFabioPalacios/',
    enabled: true,
    keepOnMobile: false,
  },
  {
    id: 'tiktok',
    label: 'TikTok del Dr. Fabio Palacios',
    url: 'https://www.tiktok.com/@dr..fabio.palacio',
    enabled: true,
    keepOnMobile: false,
  },
  {
    id: 'instagram',
    label: 'Instagram del Dr. Fabio Palacios',
    url: 'https://www.instagram.com/fabio_oncologo/',
    enabled: true,
    keepOnMobile: false,
  },
  {
    id: 'doctoralia',
    label: 'Perfil en Doctoralia',
    url: 'https://www.doctoralia.pe/fabio-palacios/oncologo-medico-general/piura',
    enabled: false,
    keepOnMobile: false,
  },
];

/* ============================================================
   NAVEGACIÓN
   ============================================================ */

export const NAV_LINKS: readonly NavLink[] = [
  { id: 'inicio', label: 'Inicio', href: '#inicio' },
  { id: 'proposito', label: 'Propósito', href: '#proposito' },
  { id: 'charlas', label: 'Charlas', href: '#charlas' },
  { id: 'medicina', label: 'Medicina', href: '#medicina' },
  { id: 'acompanamiento', label: 'Coach', href: '#acompanamiento' },
  { id: 'sobrevivientes', label: 'Programa', href: '#sobrevivientes' },
  { id: 'familia', label: 'Familia', href: '#familia' },
  { id: 'videos', label: 'Videos', href: '#videos' },
  { id: 'contacto', label: 'Contacto', href: '#contacto' },
];

/** Reseñas y accesos al perfil público del doctor. */
