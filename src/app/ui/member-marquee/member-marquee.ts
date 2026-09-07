import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MEMBERSHIPS } from '../../core/data/doctor.data';

/**
 * Pasarela en bucle de las sociedades a las que pertenece el doctor.
 *
 * La lista se pinta dos veces seguidas y la tira se desplaza exactamente la
 * mitad de su ancho antes de reiniciarse. En ese instante el segundo juego
 * ocupa el sitio que tenía el primero, así que el salto no se ve y el bucle
 * parece infinito sin necesidad de medir nada en JavaScript.
 *
 * La copia va marcada `aria-hidden`: para un lector de pantalla la lista
 * aparecería dos veces, y no hay ninguna sociedad repetida.
 */
@Component({
  selector: 'app-member-marquee',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './member-marquee.html',
  styleUrl: './member-marquee.scss',
})
export class MemberMarquee {
  protected readonly memberships = MEMBERSHIPS;
}
