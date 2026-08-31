import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Reveal } from '../../core/directives/reveal';
import { Icon } from '../../ui/icon/icon';
import { REVIEWS } from '../../core/data/doctor.data';

const MAX_RATING = 5;

/**
 * Reseñas de pacientes.
 *
 * Las entradas ficticias autorizadas se identifican explícitamente como
 * contenido de muestra; las reales deben incluir su `sourceUrl`.
 */
@Component({
  selector: 'app-reviews',
  host: {
    role: 'region',
    'aria-labelledby': 'titulo-resenas',
  },
  imports: [Reveal, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reviews.html',
  styleUrl: './reviews.scss',
})
export class Reviews {
  protected readonly published = REVIEWS.published;
  protected readonly scale = Array.from({ length: MAX_RATING }, (_, i) => i + 1);

  protected initial(author: string): string {
    return author.trim().charAt(0).toUpperCase();
  }
}
