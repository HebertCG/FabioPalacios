import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Icon } from '../../ui/icon/icon';
import { Reveal } from '../../core/directives/reveal';
import { CONTACT, DOCTOR, whatsappLink } from '../../core/data/doctor.data';

/**
 * Bloque de contacto y cierre.
 *
 * Deliberadamente no hay formulario. Un formulario en un sitio médico
 * peruano obliga a política de privacidad y consentimiento bajo la Ley
 * N° 29733 —los datos de salud son categoría sensible— y además añade
 * un paso donde el paciente abandona. WhatsApp es el canal que la gente
 * ya usa y no recoge datos en servidor propio.
 *
 * Cuando el doctor decida que quiere formulario, se añade aquí junto
 * con la página de política de privacidad.
 */
@Component({
  selector: 'app-contact',
  /**
   * La sección se anuncia como región con nombre propio.
   *
   * `<app-contact>` es un elemento inventado: para un lector de
   * pantalla y para un rastreador no significa nada por sí solo. Con
   * `role="region"` pasa a ser un punto de referencia de la página, y
   * `aria-labelledby` le da como nombre el encabezado que ya está
   * visible, sin duplicar texto.
   */
  host: {
    role: 'region',
    'aria-labelledby': 'titulo-contacto',
  },
  imports: [Icon, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly contact = CONTACT;
  protected readonly doctor = DOCTOR;
  protected readonly waLink = whatsappLink();
  protected readonly telLink = `tel:${CONTACT.whatsapp}`;
  protected readonly mapEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    CONTACT.mapsEmbedUrl,
  );
}
