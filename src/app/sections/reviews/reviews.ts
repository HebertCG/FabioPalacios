import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Reveal } from '../../core/directives/reveal';
import { Icon } from '../../ui/icon/icon';
import { REVIEWS } from '../../core/data/doctor.data';
import type { PatientReview } from '../../core/models/content.models';

/** Puntuación máxima de la escala. Fija la cantidad de estrellas dibujadas. */
const MAX_RATING = 5;

/**
 * Reseñas de pacientes.
 *
 * La sección tiene dos estados:
 *
 * - Con opiniones, dibuja una tarjeta por reseña.
 * - Sin opiniones, lo dice en una línea y ofrece el formulario.
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
  protected readonly reviews = REVIEWS;

  /**
   * Opiniones a mostrar. Sigue siendo una entrada para poder probar el
   * estado vacío o sustituir las muestras por reseñas verificadas.
   */
  readonly published = input<readonly PatientReview[]>(REVIEWS.published);

  protected readonly hasReviews = computed(() => this.published().length > 0);

  /** Posiciones de la escala, para pintar llenas las que alcanza la nota. */
  protected readonly scale = Array.from({ length: MAX_RATING }, (_, i) => i + 1);

  /** Inicial del paciente: el avatar se compone, no se guardan fotos suyas. */
  protected initial(author: string): string {
    return author.trim().charAt(0).toUpperCase();
  }
}
