import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '../../ui/icon/icon';
import { Reveal } from '../../core/directives/reveal';
import {
  ABOUT,
  ADVANTAGES,
  DOCTOR,
  whatsappLink,
} from '../../core/data/doctor.data';

/**
 * Sección "Sobre mí".
 *
 * A la izquierda, el retrato en quirófano; a la derecha, la
 * trayectoria y los motivos para elegirlo. El retrato se mantiene
 * limpio, sin tarjetas ni contenido superpuesto.
 */
@Component({
  selector: 'app-about',
  imports: [Icon, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  protected readonly about = ABOUT;
  protected readonly advantages = ADVANTAGES;
  protected readonly doctor = DOCTOR;
  protected readonly waLink = whatsappLink(
    'Hola doctor, leí su página y quisiera una consulta para revisar mi caso.',
  );
}
