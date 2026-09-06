import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONTACT, DOCTOR } from '../../core/data/doctor.data';
import { ANALYTICS } from '../../core/analytics/analytics.config';
import { PageSeo } from '../page-seo';

/**
 * Política de privacidad.
 *
 * El texto describe lo que la página hace de verdad, comprobado sobre el HTML
 * publicado: no tiene ni un formulario, las tipografías se sirven desde el
 * propio dominio y lo único que sale fuera son los enlaces que el visitante
 * decide pulsar, más el vídeo alojado en Cloudflare R2. Por eso es corta.
 *
 * TODO LEGAL: este borrador lo redactó el equipo de desarrollo a partir del
 * comportamiento técnico del sitio, no un abogado. Antes de publicar conviene
 * que lo revise uno, sobre todo por dos motivos: es una web de salud, y la
 * Ley N.° 29733 trata los datos de salud como categoría sensible con
 * exigencias propias. Si el doctor quiere un correo de contacto para ejercer
 * derechos —hoy solo se ofrece WhatsApp—, es el momento de añadirlo.
 */
@Component({
  selector: 'app-privacidad',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './privacidad.html',
  styleUrl: '../page.scss',
})
export class Privacidad extends PageSeo {
  protected readonly doctor = DOCTOR;
  protected readonly contact = CONTACT;

  /** Se usa para no describir una medición que todavía no está activa. */
  protected readonly analyticsEnabled = ANALYTICS.enabled;

  /** Fecha de la última revisión del texto. */
  protected readonly updated = '6 de septiembre de 2026';

  constructor() {
    super({
      title: 'Política de privacidad | Fabio Palacios',
      description:
        'Qué datos trata esta web y cómo ejercer tus derechos. Sitio del Dr. Fabio Palacios, ' +
        'cirujano oncólogo en Piura.',
      path: 'privacidad',
    });
  }
}
