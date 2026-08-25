import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '../../ui/icon/icon';
import { Reveal } from '../../core/directives/reveal';
import { SPECIALTIES, whatsappLink } from '../../core/data/doctor.data';

/**
 * Las seis áreas quirúrgicas que atiende el doctor.
 *
 * Es la sección con mayor valor para búsquedas: cada patología que
 * aparece aquí en texto es una consulta que Google puede asociar a
 * "cáncer de … en Piura". Por eso los órganos van como texto real y
 * no dentro de una imagen.
 *
 * La retícula es intencionalmente irregular: dos áreas ocupan el
 * doble de ancho para crear jerarquía en lugar de una parrilla plana.
 */
@Component({
  selector: 'app-specialties',
  imports: [Icon, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './specialties.html',
  styleUrl: './specialties.scss',
})
export class Specialties {
  protected readonly specialties = SPECIALTIES;

  /** Pide una cita mencionando el área concreta que interesa. */
  protected waFor(title: string): string {
    return whatsappLink(
      `Hola doctor, escribo desde su página web. Quisiera consultar por ${title.toLowerCase()}.`,
    );
  }
}
