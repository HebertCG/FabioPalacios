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
 *    gráfico oficial del doctor (public/dr-fabio-palacios-cirujano-oncologo-piura-perfil.jpg).
 *  · Formación (UPCH, INEN, IRCAD), Sociedad Peruana de Cancerología,
 *    el consultorio de Castilla y su labor en EsSalud provienen de
 *    fuentes públicas: Doctoralia, su Facebook oficial, la cuenta del
 *    consultorio y una nota de prensa de EsSalud.
 *
 * PENDIENTE DE CONFIRMAR CON EL DOCTOR  →  buscar el marcador `TODO:`
 * Son datos que la página necesita y que aún no están verificados.
 */

import type {
  Advantage,
  Credential,
  Faq,
  NavLink,
  ProcessStep,
  Reel,
  SocialLink,
  Specialty,
} from '../models/content.models';

/* ============================================================
   IDENTIDAD
   ============================================================ */

export const DOCTOR = {
  firstName: 'Fabio',
  lastName: 'Palacios',
  /** Nombre de presentación en navbar, footer y metadatos */
  displayName: 'Dr. Fabio Palacios',
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
   HÉROE
   ============================================================ */

export const HERO = {
  /** El título se arma en tres partes para resaltar la del medio */
  titleStart: 'Cirugía oncológica',
  titleAccent: 'de alta complejidad',
  titleEnd: 'para el norte del Perú',
  lead:
    'Cirugía especializada en cáncer digestivo, de mama, cabeza y cuello, ' +
    'urológico y ginecológico, con atención cercana en Piura.',
  primaryCta: 'Agendar consulta',
  secondaryCta: 'Ver especialidades',
} as const;

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
   SOBRE MÍ
   ============================================================ */

export const ABOUT = {
  eyebrow: 'Sobre mí',
  titleStart: 'Un solo cirujano',
  titleAccent: 'de principio a fin',
  paragraphs: [
    'Soy cirujano oncólogo general con subespecialidad en cavidad abdominal. ' +
      'Me formé como médico en la Universidad Peruana Cayetano Heredia e hice ' +
      'mi residencia en el Instituto Nacional de Enfermedades Neoplásicas, el ' +
      'centro de referencia oncológica del Perú.',
    'Completé mi entrenamiento en cirugía mínimamente invasiva en IRCAD ' +
      'América Latina y soy miembro de la Sociedad Peruana de Cancerología. ' +
      'Hoy atiendo en consulta privada en Castilla y opero también en la Red ' +
      'Asistencial de EsSalud en Piura, donde he resuelto casos de alta ' +
      'complejidad como resecciones hepáticas mayores.',
    'Trabajo con una convicción simple: un diagnóstico de cáncer ya es ' +
      'bastante difícil como para además tener que viajar a Lima, repetir ' +
      'estudios y explicarle su caso a un médico distinto cada vez.',
  ],
} as const;

export const ADVANTAGES: readonly Advantage[] = [
  {
    id: 'inen',
    title: 'Formación en el INEN',
    body:
      'Residencia completa en el instituto oncológico de referencia del país, ' +
      'con el volumen de casos que eso implica.',
    icon: 'hospital',
  },
  {
    id: 'minimally-invasive',
    title: 'Cirugía mínimamente invasiva',
    body:
      'Entrenamiento en IRCAD América Latina. Menos agresión quirúrgica ' +
      'cuando el caso lo permite.',
    icon: 'scalpel',
  },
  {
    id: 'local',
    title: 'Alta complejidad en Piura',
    body:
      'Cirugías que antes obligaban a viajar a Lima se resuelven aquí, ' +
      'cerca de su casa y de su familia.',
    icon: 'pin',
  },
  {
    id: 'continuity',
    title: 'El mismo médico siempre',
    body:
      'De la primera consulta al alta lo atiende el mismo cirujano. ' +
      'No repite su historia en cada cita.',
    icon: 'route',
  },
  {
    id: 'second-opinion',
    title: 'Segunda opinión con lectura de estudios',
    body:
      'Reviso sus informes, biopsias y tomografías antes de opinar. ' +
      'Sin diagnósticos apresurados.',
    icon: 'eye',
  },
  {
    id: 'clarity',
    title: 'Explicaciones en claro',
    body:
      'Usted y su familia van a entender el plan quirúrgico antes de ' + 'decidir cualquier cosa.',
    icon: 'hand-heart',
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
    imageAlt:
      'Ilustración del espacio retroperitoneal, detrás de la cavidad abdominal',
  },
  {
    id: 'breast',
    title: 'Cáncer de mama, piel y partes blandas',
    organs: ['Mama', 'Piel', 'Partes blandas'],
    icon: 'breast',
    image: 'specialties/cirugia-cancer-mama-partes-blandas.jpg',
    imageAlt:
      'Ilustración anatómica de la glándula mamaria y los tejidos blandos que la rodean',
    featured: true,
  },
  {
    id: 'urologic',
    title: 'Cáncer urológico',
    organs: ['Próstata', 'Vejiga', 'Riñón', 'Testículo', 'Pene'],
    icon: 'urologic',
    image: 'specialties/cirugia-cancer-urologico.jpg',
    imageAlt:
      'Ilustración del aparato urinario y genital masculino: riñones, vejiga y próstata',
  },
  {
    id: 'gynecologic',
    title: 'Cáncer ginecológico',
    organs: ['Cérvix', 'Útero', 'Ovario', 'Vulva', 'Vagina'],
    icon: 'gynecologic',
    image: 'specialties/cirugia-cancer-ginecologico.jpg',
    imageAlt:
      'Ilustración del aparato reproductor femenino: útero, cérvix y ovarios',
  },
];

/* ============================================================
   CÓMO ES LA ATENCIÓN
   ============================================================ */

export const PROCESS: readonly ProcessStep[] = [
  {
    step: '01',
    title: 'Escríbame por WhatsApp',
    body:
      'Envíeme un mensaje y, si los tiene, fotos claras de sus informes, ' +
      'biopsias o tomografías. No necesita ordenar todo antes de escribir.',
  },
  {
    step: '02',
    title: 'Revisamos su caso',
    body:
      'En consulta reviso sus estudios, resuelvo sus dudas y le explico con ' +
      'claridad qué muestran los resultados y qué falta por definir.',
  },
  {
    step: '03',
    title: 'Definimos el plan',
    body:
      'Le explico las opciones, sus riesgos y sus tiempos para que usted y ' +
      'su familia puedan decidir con información clara.',
  },
  {
    step: '04',
    title: 'Cirugía y seguimiento',
    body:
      'Yo realizo la cirugía y yo hago sus controles posteriores. ' +
      'El seguimiento no se delega.',
  },
];

/* ============================================================
   REELS — videos de TikTok en /public
   ============================================================ */

/**
 * TODO: los títulos y temas de abajo son provisionales. Reemplazar por
 * el tema real de cada video (se leen en la tarjeta y son el texto
 * alternativo para accesibilidad y SEO).
 */
export const REELS: readonly Reel[] = [
  {
    id: 'reel-1',
    src: 'video-1.mp4',
    title: 'Señales de alerta que no debe ignorar',
    topic: 'Prevención',
  },
  {
    id: 'reel-2',
    src: 'video-2.mp4',
    title: '¿Qué es una cirugía oncológica?',
    topic: 'Cirugía',
  },
  {
    id: 'reel-3',
    src: 'video-3.mp4',
    title: 'Cáncer de colon: lo que debe saber',
    topic: 'Digestivo',
  },
  {
    id: 'reel-4',
    src: 'video-4.mp4',
    title: 'Preguntas frecuentes en consulta',
    topic: 'Consulta',
  },
  {
    id: 'reel-5',
    src: 'video-5.mp4',
    title: 'Mitos sobre el cáncer',
    topic: 'Educación',
  },
  {
    id: 'reel-6',
    src: 'video-6.mp4',
    title: 'Después de la operación',
    topic: 'Recuperación',
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
export const FAQS: readonly Faq[] = [
  {
    id: 'faq-1',
    question: '¿Tengo que viajar a Lima para operarme?',
    answer:
      'En la mayoría de los casos, no. Buena parte de la cirugía oncológica ' +
      'de alta complejidad se puede realizar en Piura. En la consulta le digo ' +
      'con franqueza si su caso puntual requiere un centro de mayor ' +
      'complejidad, y de ser así lo orientamos.',
  },
  {
    id: 'faq-2',
    question: '¿Qué debo llevar a la primera consulta?',
    answer:
      'Todo lo que tenga: informes médicos, resultados de biopsia, ' +
      'tomografías, ecografías, análisis de sangre y la lista de ' +
      'medicamentos que toma. Mientras más completo, mejor la evaluación.',
  },
  {
    id: 'faq-3',
    question: '¿Atiende segunda opinión si ya tengo un diagnóstico?',
    answer:
      'Sí. Reviso sus estudios y le doy mi lectura del caso. Una segunda ' +
      'opinión no es desconfiar de su médico: es tomar una decisión ' +
      'importante con más información.',
  },
  {
    id: 'faq-4',
    question: '¿Acepta seguros o EPS?',
    answer:
      'Las modalidades de atención y cobertura pueden cambiar. Escríbame por ' +
      'WhatsApp antes de agendar para confirmar las opciones vigentes para su caso.',
  },
  {
    id: 'faq-5',
    question: '¿Vienen pacientes de fuera de Piura?',
    answer:
      'Sí, atiendo pacientes de Sullana, Talara, Tumbes y de la sierra ' +
      'piurana. Si viene de lejos, escríbame antes por WhatsApp para ' +
      'organizar la consulta y los estudios en el mismo viaje.',
  },
  {
    id: 'faq-6',
    question: '¿Cuánto demora en responder un mensaje?',
    answer:
      'Los mensajes se atienden por orden dentro del horario de consulta. Si ' +
      'se trata de una emergencia, acuda al servicio de urgencias más cercano.',
  },
];

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
  { id: 'sobre-mi', label: 'Sobre mí', href: '#sobre-mi' },
  { id: 'especialidades', label: 'Especialidades', href: '#especialidades' },
  { id: 'atencion', label: 'Atención', href: '#atencion' },
  { id: 'reels', label: 'Videos', href: '#reels' },
  { id: 'contacto', label: 'Contacto', href: '#contacto' },
];

/* ============================================================
   PIE DE PÁGINA
   ============================================================ */

export const FOOTER = {
  tagline:
    'Cirugía oncológica de alta complejidad en Piura. Diagnóstico claro, ' +
    'plan explicado y un solo cirujano a cargo de su caso.',
  disclaimer:
    'La información de este sitio tiene fines informativos y no reemplaza ' +
    'una consulta médica presencial, un diagnóstico ni un tratamiento. ' +
    'Ningún contenido de esta página garantiza resultados.',
  /** TODO: completar razón social y RUC si el consultorio los tiene */
  legalEntity: '',
  ruc: '',
} as const;
