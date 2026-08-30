import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '../../ui/icon/icon';
import { Reveal } from '../../core/directives/reveal';
import { SPECIALTIES, whatsappLink } from '../../core/data/doctor.data';
import { SPECIALTY_WIDTHS, srcsetFor, type ModernFormat } from '../../core/media/image-variants';

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
  /**
   * La sección se anuncia como región con nombre propio.
   *
   * `<app-specialties>` es un elemento inventado: para un lector de
   * pantalla y para un rastreador no significa nada por sí solo. Con
   * `role="region"` pasa a ser un punto de referencia de la página, y
   * `aria-labelledby` le da como nombre el encabezado que ya está
   * visible, sin duplicar texto.
   */
  host: {
    role: 'region',
    'aria-labelledby': 'titulo-especialidades',
  },
  imports: [Icon, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './specialties.html',
  styleUrl: './specialties.scss',
})
export class Specialties {
  protected readonly specialties = SPECIALTIES;

  /**
   * `srcset` de una ilustración en el formato pedido.
   *
   * Los anchos vienen de `image-variants.ts`, el mismo módulo que lee
   * el script de optimización. Si alguien añadiera un ancho aquí a mano
   * sin generarlo, el navegador pediría un archivo inexistente y caería
   * al original sin avisar: la página se vería bien y la optimización
   * habría dejado de aplicarse en silencio.
   */
  protected srcset(image: string, format: ModernFormat): string {
    return srcsetFor(image, SPECIALTY_WIDTHS, format);
  }

  /** Pide una cita mencionando el área concreta que interesa. */
  protected waFor(title: string): string {
    return whatsappLink(
      `Hola doctor, escribo desde su página web. Quisiera consultar por ${title.toLowerCase()}.`,
    );
  }
}
