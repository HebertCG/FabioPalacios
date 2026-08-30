import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '../../ui/icon/icon';
import { Reveal } from '../../core/directives/reveal';
import { ABOUT, ADVANTAGES, DOCTOR, whatsappLink } from '../../core/data/doctor.data';
import { ABOUT_IMAGE, srcsetFor } from '../../core/media/image-variants';

/**
 * Sección "Sobre mí".
 *
 * A la izquierda, el retrato en quirófano; a la derecha, la
 * trayectoria y los motivos para elegirlo. El retrato se mantiene
 * limpio, sin tarjetas ni contenido superpuesto.
 */
@Component({
  selector: 'app-about',
  /**
   * La sección se anuncia como región con nombre propio.
   *
   * `<app-about>` es un elemento inventado: para un lector de
   * pantalla y para un rastreador no significa nada por sí solo. Con
   * `role="region"` pasa a ser un punto de referencia de la página, y
   * `aria-labelledby` le da como nombre el encabezado que ya está
   * visible, sin duplicar texto.
   */
  host: {
    role: 'region',
    'aria-labelledby': 'titulo-sobre-mi',
  },
  imports: [Icon, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  protected readonly about = ABOUT;
  protected readonly advantages = ADVANTAGES;
  protected readonly doctor = DOCTOR;

  /** Retrato en quirófano: 158 KB en JPG, 62 KB en AVIF. */
  protected readonly portrait = {
    fallback: ABOUT_IMAGE.file,
    avif: srcsetFor(ABOUT_IMAGE.file, ABOUT_IMAGE.widths, 'avif'),
    webp: srcsetFor(ABOUT_IMAGE.file, ABOUT_IMAGE.widths, 'webp'),
  };
  protected readonly waLink = whatsappLink(
    'Hola doctor, leí su página y quisiera una consulta para revisar mi caso.',
  );
}
