import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { Reveal } from '../../core/directives/reveal';
import { CREDENTIALS } from '../../core/data/doctor.data';
import type { Credential } from '../../core/models/content.models';

/**
 * Franja de formación con marquesina vertical.
 *
 * Dos columnas de tarjetas que se desplazan en sentidos opuestos.
 * El bucle se logra duplicando la lista y animando un `translateY`
 * de -50%: al llegar a la mitad, el contenido visible es idéntico
 * al del inicio, así que el salto es imperceptible.
 *
 * Se anima `transform` y nada más, para que el trabajo quede en el
 * compositor y no provoque relayouts durante el scroll.
 */
@Component({
  selector: 'app-credentials',
  /**
   * La sección se anuncia como región con nombre propio.
   *
   * `<app-credentials>` es un elemento inventado: para un lector de
   * pantalla y para un rastreador no significa nada por sí solo. Con
   * `role="region"` pasa a ser un punto de referencia de la página, y
   * `aria-labelledby` le da como nombre el encabezado que ya está
   * visible, sin duplicar texto.
   */
  host: {
    role: 'region',
    'aria-labelledby': 'titulo-formacion',
  },
  imports: [Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './credentials.html',
  styleUrl: './credentials.scss',
})
export class Credentials {
  /** Primera columna: sube */
  protected readonly columnA = computed(() => this.loop(CREDENTIALS.filter((_, i) => i % 2 === 0)));

  /** Segunda columna: baja */
  protected readonly columnB = computed(() => this.loop(CREDENTIALS.filter((_, i) => i % 2 === 1)));

  /** Lista completa para el fallback horizontal en móvil */
  protected readonly all = CREDENTIALS;

  /** Duplica la lista para que el bucle no muestre un corte. */
  private loop(items: readonly Credential[]): readonly Credential[] {
    return [...items, ...items];
  }
}
