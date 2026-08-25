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

/** Grupo de patologías que el doctor opera. */
export interface Specialty {
  readonly id: string;
  readonly title: string;
  readonly organs: readonly string[];
  readonly icon: IconName;
  /** Fondo anatómico decorativo alojado en /public/specialties */
  readonly image: string;
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

/** Paso del recorrido de atención. */
export interface ProcessStep {
  readonly step: string;
  readonly title: string;
  readonly body: string;
}

/** Video vertical de TikTok alojado en /public. */
export interface Reel {
  readonly id: string;
  readonly src: string;
  readonly title: string;
  readonly topic: string;
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

export type SocialId =
  | 'whatsapp'
  | 'facebook'
  | 'instagram'
  | 'tiktok'
  | 'doctoralia';

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
