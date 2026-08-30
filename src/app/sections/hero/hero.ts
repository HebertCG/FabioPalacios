import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '../../ui/icon/icon';
import { DOCTOR, HERO, whatsappLink } from '../../core/data/doctor.data';
import { HERO_IMAGE, srcsetFor } from '../../core/media/image-variants';

/**
 * Héroe de la página.
 *
 * El contraste es la decisión de diseño central: el retrato viene
 * recortado sobre transparencia y el doctor viste mandil blanco, así
 * que el fondo es un azul quirúrgico profundo. Blanco sobre --brand-950
 * da la máxima separación posible entre figura y fondo, y de paso deja
 * los textos muy por encima del contraste que exige la WCAG.
 */
@Component({
  selector: 'app-hero',
  /**
   * La sección se anuncia como región con nombre propio.
   *
   * `<app-hero>` es un elemento inventado: para un lector de
   * pantalla y para un rastreador no significa nada por sí solo. Con
   * `role="region"` pasa a ser un punto de referencia de la página, y
   * `aria-labelledby` le da como nombre el encabezado que ya está
   * visible, sin duplicar texto.
   */
  host: {
    role: 'region',
    'aria-labelledby': 'titulo-inicio',
  },
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  protected readonly hero = HERO;
  protected readonly doctor = DOCTOR;
  protected readonly waLink = whatsappLink();

  /**
   * Fuentes del retrato, de la que mejor comprime a la de más
   * compatibilidad. El original PNG pesaba 249 KB; el AVIF equivalente,
   * 13 KB. Al ser este el elemento LCP de la página, ese cambio se
   * traduce casi uno a uno en la métrica que mide Google.
   */
  protected readonly portrait = {
    fallback: HERO_IMAGE.file,
    avif: srcsetFor(HERO_IMAGE.file, HERO_IMAGE.widths, 'avif'),
    webp: srcsetFor(HERO_IMAGE.file, HERO_IMAGE.widths, 'webp'),
  };
}
