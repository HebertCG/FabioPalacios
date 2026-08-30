import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Icon } from '../../ui/icon/icon';
import { Reveal } from '../../core/directives/reveal';
import { FAQS, whatsappLink } from '../../core/data/doctor.data';

/**
 * Preguntas frecuentes en acordeón.
 *
 * Se mantiene un solo panel abierto a la vez para que la sección no
 * crezca sin control. El marcado usa `<details>`/`<summary>` nativos:
 * traen accesibilidad de teclado, semántica de divulgación y búsqueda
 * dentro de la página sin una línea de JavaScript.
 */
@Component({
  selector: 'app-faq',
  /**
   * La sección se anuncia como región con nombre propio.
   *
   * `<app-faq>` es un elemento inventado: para un lector de
   * pantalla y para un rastreador no significa nada por sí solo. Con
   * `role="region"` pasa a ser un punto de referencia de la página, y
   * `aria-labelledby` le da como nombre el encabezado que ya está
   * visible, sin duplicar texto.
   */
  host: {
    role: 'region',
    'aria-labelledby': 'titulo-preguntas',
  },
  imports: [Icon, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq {
  protected readonly faqs = FAQS;
  protected readonly openId = signal<string | null>(FAQS[0]?.id ?? null);
  protected readonly waLink = whatsappLink(
    'Hola doctor, tengo una duda que no está en su página web:',
  );

  protected toggle(id: string, event: Event): void {
    // Se controla la apertura desde el componente para poder cerrar
    // el panel anterior; por eso se evita el comportamiento nativo.
    event.preventDefault();
    this.openId.update((current) => (current === id ? null : id));
  }
}
