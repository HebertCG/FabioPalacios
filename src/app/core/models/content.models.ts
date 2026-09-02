/**
 * Contratos de contenido de la landing.
 *
 * Toda sección consume estas formas desde `core/data/doctor.data.ts`.
 * Ningún componente escribe texto de negocio en su plantilla: así el
 * doctor (o quien administre la web) cambia un dato en un solo lugar.
 */

/** Institución donde se formó o a la que pertenece. Alimenta la marquesina. */
export interface Credential {
  readonly id: string;
  readonly institution: string;
  readonly role: string;
  readonly detail: string;
  /** Ruta al logo dentro de /public/logos */
  readonly logo: string;
  /** `true` cuando el logo es oficial y hay autorización de uso */
  readonly logoIsOfficial: boolean;
}

/** Mensaje e imagen de una de las vistas principales del héroe. */
export interface HeroSlide {
  readonly id: string;
  readonly titleStart: string;
  readonly titleAccent: string;
  readonly titleEnd: string;
  readonly mobileTitle?: string;
  readonly mobileAccent?: string;
  readonly lead: string;
  readonly primaryCta: string;
  readonly secondaryCta: string;
  readonly secondaryHref: string;
  /** Ruta dentro de /public. */
  readonly image: string;
  readonly imageAlt: string;
  readonly imageKind: 'cutout' | 'photo';
  readonly objectPosition?: string;
}

/** Fotografía y contexto breve para la galería de trayectoria. */
export interface DoctorPhoto {
  readonly id: string;
  /** Ruta dentro de /public. */
  readonly image: string;
  readonly alt: string;
  readonly label: string;
  readonly caption: string;
  readonly objectPosition?: string;
}

/** Grupo de patologías que el doctor opera. */
export interface Specialty {
  readonly id: string;
  readonly title: string;
  readonly organs: readonly string[];
  readonly icon: IconName;
  /** Ilustración anatómica alojada en /public/specialties */
  readonly image: string;
  /**
   * Texto alternativo de la ilustración.
   *
   * No es un adorno: son las únicas palabras que Google tiene para
   * entender qué muestra la imagen, y estas ilustraciones pueden
   * posicionar en Google Imágenes por búsquedas anatómicas. Debe
   * describir lo que se ve, no repetir el título de la tarjeta: quien
   * usa lector de pantalla ya oye el título justo después.
   */
  readonly imageAlt: string;
  /** Las marcadas se muestran destacadas en la retícula */
  readonly featured?: boolean;
}

/** Motivo por el que un paciente elegiría al doctor. */
export interface Advantage {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly icon: IconName;
}

/**
 * Opinión mostrada en la sección de reseñas.
 *
 * Las entradas de demostración se identifican con `isSample` y no
 * enlazan a una fuente. Cuando una opinión real se publique, se cambia
 * ese indicador y se añade `sourceUrl` para poder comprobar su origen.
 */
export interface PatientReview {
  readonly id: string;
  /** Cita de muestra o cita literal cuando sea una opinión verificada. */
  readonly quote: string;
  /** Nombre tal como el paciente lo publicó. */
  readonly author: string;
  /** Contexto breve: procedencia o tipo de consulta. */
  readonly context: string;
  /** Estrellas otorgadas por el paciente, 1 a 5. */
  readonly rating: 1 | 2 | 3 | 4 | 5;
  /** Permite distinguir visualmente el contenido ficticio autorizado. */
  readonly isSample?: boolean;
  /** Enlace a la opinión original cuando exista públicamente. */
  readonly sourceUrl?: string;
}

/** Paso del recorrido de atención. */
export interface ProcessStep {
  readonly step: string;
  readonly title: string;
  readonly body: string;
}

/**
 * Video vertical de TikTok alojado en /public.
 *
 * Los cuatro últimos campos son opcionales y existen para SEO de video.
 * Google solo emite un resultado enriquecido de video cuando el
 * `VideoObject` trae nombre, descripción, miniatura y fecha de subida;
 * si falta cualquiera, descarta el elemento entero. Por eso
 * `structured-data.ts` solo declara los reels que tengan `poster` y
 * `uploadDate`, en lugar de publicar nodos incompletos.
 *
 * `poster` cumple además una función de rendimiento: sin miniatura, la
 * tarjeta tiene que descargar metadatos del propio MP4 para mostrar el
 * primer fotograma, y son seis videos en la misma pantalla.
 */
export interface Reel {
  readonly id: string;
  readonly src: string;
  readonly title: string;
  readonly topic: string;
  /** Miniatura en /public/reels. La genera `npm run media:posters` */
  readonly poster?: string;
  /** Fecha de publicación original en TikTok, formato AAAA-MM-DD */
  readonly uploadDate?: string;
  /** Resumen del video. Sin él se usa el título */
  readonly description?: string;
  /** Duración en formato ISO 8601, por ejemplo 'PT58S' */
  readonly duration?: string;
  /** Duración en segundos, leída de la cabecera del MP4. Se pinta en la tarjeta. */
  readonly durationSeconds?: number;
}

/** Pregunta frecuente. */
export interface Faq {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

/** Enlace de red social del dock flotante. */
export interface SocialLink {
  readonly id: SocialId;
  readonly label: string;
  readonly url: string;
  /** Se oculta del dock mientras sea `false` (perfil sin confirmar) */
  readonly enabled: boolean;
  /** WhatsApp permanece visible en móvil; las demás se ocultan */
  readonly keepOnMobile: boolean;
}

export type SocialId = 'whatsapp' | 'facebook' | 'instagram' | 'tiktok' | 'doctoralia';

/** Enlace del menú de navegación. */
export interface NavLink {
  readonly id: string;
  readonly label: string;
  readonly href: string;
}

/** Nombres de icono admitidos por el componente `app-icon`. */
export type IconName =
  | 'digestive'
  | 'head-neck'
  | 'breast'
  | 'retroperitoneal'
  | 'urologic'
  | 'gynecologic'
  | 'scalpel'
  | 'star'
  | 'shield'
  | 'route'
  | 'hand-heart'
  | 'eye'
  | 'hospital'
  | 'arrow-right'
  | 'whatsapp'
  | 'facebook'
  | 'instagram'
  | 'tiktok'
  | 'doctoralia'
  | 'phone'
  | 'pin'
  | 'clock'
  | 'hourglass'
  | 'play'
  | 'plus'
  | 'chevron'
  | 'sound-on'
  | 'sound-off'
  | 'close';
