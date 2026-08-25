import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { IconName } from '../../core/models/content.models';

interface IconDef {
  readonly paths: readonly string[];
  /** Los iconos de marca se dibujan rellenos; los demás con trazo */
  readonly filled?: boolean;
}

/**
 * Sistema de iconos propio, en trazo de 1.7px sobre lienzo de 24.
 *
 * Los glifos médicos son geométricos a propósito: una silueta abstracta
 * legible a 20px comunica mejor que una ilustración anatómica, y evita
 * el aire de banco de imágenes que delata a las plantillas.
 */
const ICONS: Record<IconName, IconDef> = {
  /* ---------- Áreas quirúrgicas ---------- */
  digestive: {
    paths: [
      'M7 4v4.2A3.8 3.8 0 0 0 10.8 12h2.4A3.8 3.8 0 0 1 17 15.8V20',
      'M13.2 4H17',
      'M7 20h3.8',
    ],
  },
  'head-neck': {
    paths: [
      'M12 3.2a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8z',
      'M12 12v2.6',
      'M6.8 21a5.2 5.2 0 0 1 10.4 0',
    ],
  },
  breast: {
    paths: [
      'M12 3.6a8.4 8.4 0 1 0 0 16.8 8.4 8.4 0 0 0 0-16.8z',
      'M12 10.4a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z',
    ],
  },
  retroperitoneal: {
    paths: ['M3.6 8.4 12 4l8.4 4.4', 'M3.6 12.4 12 8l8.4 4.4', 'M3.6 16.4 12 12l8.4 4.4'],
  },
  urologic: {
    paths: ['M12 3.2s6.2 5.4 6.2 9.8A6.2 6.2 0 0 1 5.8 13c0-4.4 6.2-9.8 6.2-9.8z'],
  },
  gynecologic: {
    paths: [
      'M12 13.6a4.6 4.6 0 1 0 0-9.2 4.6 4.6 0 0 0 0 9.2z',
      'M12 13.6V21',
      'M8.6 17.6h6.8',
    ],
  },

  /* ---------- Ventajas y utilidades ---------- */
  scalpel: { paths: ['m4 20 6.4-6.4', 'M10.4 13.6 19.6 4.4a1.2 1.2 0 0 1 1.7 1.7L12 15.4z'] },
  shield: { paths: ['M12 3.2 5 6.2v5.4c0 4.5 2.9 7.9 7 9.4 4.1-1.5 7-4.9 7-9.4V6.2z'] },
  route: {
    paths: [
      'M6 2.6a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4z',
      'M6 7v7.2A4.2 4.2 0 0 0 10.2 18.4H17',
      'm14.4 15.6 3 2.8-3 2.8',
    ],
  },
  'hand-heart': {
    paths: [
      'M12 20.6s-6.6-4.3-6.6-8.6a3.7 3.7 0 0 1 6.6-2.2 3.7 3.7 0 0 1 6.6 2.2c0 4.3-6.6 8.6-6.6 8.6z',
    ],
  },
  eye: {
    paths: [
      'M2.6 12S6.2 5.6 12 5.6 21.4 12 21.4 12 17.8 18.4 12 18.4 2.6 12 2.6 12z',
      'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
    ],
  },
  hospital: {
    paths: ['M4.2 21V8.4L12 3.2l7.8 5.2V21', 'M9.4 21v-5.2h5.2V21', 'M12 7.6v4', 'M10 9.6h4'],
  },
  hourglass: { paths: ['M7 3h10', 'M7 21h10', 'M8 3v4l4 4 4-4V3', 'M8 21v-4l4-4 4 4v4'] },

  /* ---------- Interfaz ---------- */
  'arrow-right': { paths: ['M4 12h14.6', 'm13 6.4 6 5.6-6 5.6'] },
  phone: {
    paths: [
      'M6.4 3h3.1l1.5 3.9-2 1.5a11.2 11.2 0 0 0 6.6 6.6l1.5-2 3.9 1.5v3.1a2 2 0 0 1-2.2 2A17.2 17.2 0 0 1 4.4 5.2 2 2 0 0 1 6.4 3z',
    ],
  },
  pin: {
    paths: [
      'M12 21s7-6.3 7-11.2a7 7 0 1 0-14 0C5 14.7 12 21 12 21z',
      'M12 7.4a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8z',
    ],
  },
  clock: { paths: ['M12 3.2a8.8 8.8 0 1 0 0 17.6 8.8 8.8 0 0 0 0-17.6z', 'M12 7.4V12l3.4 2'] },
  play: { paths: ['M8 5.4v13.2L19 12z'], filled: true },
  plus: { paths: ['M12 5.4v13.2', 'M5.4 12h13.2'] },
  chevron: { paths: ['m6.4 9.4 5.6 5.6 5.6-5.6'] },
  'sound-on': {
    paths: ['M4 9.4h3L12 5v14l-5-4.4H4z', 'M15.8 9.6a3.8 3.8 0 0 1 0 4.8', 'M18.4 7a7.4 7.4 0 0 1 0 10'],
  },
  'sound-off': { paths: ['M4 9.4h3L12 5v14l-5-4.4H4z', 'm16.2 9.6 4.8 4.8', 'm21 9.6-4.8 4.8'] },
  close: { paths: ['m6 6 12 12', 'M18 6 6 18'] },

  /* ---------- Marcas (rellenas, trazadas desde su geometría oficial) ---------- */
  whatsapp: {
    filled: true,
    paths: [
      'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.174-.297-.019-.458.13-.606.134-.133.347-.347.52-.52.174-.174.232-.298.347-.497.115-.198.057-.371-.03-.52-.086-.148-.66-1.59-.905-2.178-.238-.571-.48-.492-.66-.501-.171-.008-.367-.01-.563-.01-.196 0-.514.073-.783.37-.27.298-1.03 1.006-1.03 2.454 0 1.448 1.055 2.847 1.202 3.045.148.198 2.076 3.17 5.03 4.442.703.303 1.252.484 1.68.62.708.225 1.352.193 1.862.117.567-.084 1.75-.716 1.998-1.407.248-.692.248-1.284.173-1.408-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z',
    ],
  },
  facebook: {
    filled: true,
    paths: [
      'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647z',
    ],
  },
  tiktok: {
    filled: true,
    paths: [
      'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
    ],
  },
  instagram: {
    paths: [
      'M7.2 2.4h9.6a4.8 4.8 0 0 1 4.8 4.8v9.6a4.8 4.8 0 0 1-4.8 4.8H7.2a4.8 4.8 0 0 1-4.8-4.8V7.2a4.8 4.8 0 0 1 4.8-4.8z',
      'M12 8.15a3.85 3.85 0 1 0 0 7.7 3.85 3.85 0 0 0 0-7.7z',
      'M17.3 6.75h.012',
    ],
  },
  doctoralia: {
    paths: [
      'M12 2.6 4.4 5.8v6c0 4.9 3.2 8.5 7.6 9.6 4.4-1.1 7.6-4.7 7.6-9.6v-6z',
      'm8.8 11.9 2.4 2.4 4.2-4.8',
    ],
  },
};

/**
 * Icono SVG en línea.
 *
 * Se resuelve por nombre para que las plantillas queden legibles y para
 * no arrastrar una librería de iconos completa a un sitio de una página.
 */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'icon-host' },
  styles: `
    .icon-host {
      display: inline-flex;
      flex: none;
      line-height: 0;
    }
    svg {
      width: var(--icon-size, 1.25em);
      height: var(--icon-size, 1.25em);
      overflow: visible;
    }
  `,
  template: `
    <svg
      viewBox="0 0 24 24"
      [attr.fill]="def().filled ? 'currentColor' : 'none'"
      [attr.stroke]="def().filled ? 'none' : 'currentColor'"
      [attr.stroke-width]="def().filled ? null : strokeWidth()"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      @for (d of def().paths; track d) {
        <path [attr.d]="d" />
      }
    </svg>
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly strokeWidth = input(1.7);

  protected readonly def = computed<IconDef>(() => ICONS[this.name()]);
}
