import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '../../ui/icon/icon';
import { DOCTOR, HERO, whatsappLink } from '../../core/data/doctor.data';

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
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  protected readonly hero = HERO;
  protected readonly doctor = DOCTOR;
  protected readonly waLink = whatsappLink();
}
