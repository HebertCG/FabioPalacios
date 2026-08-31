import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '../../ui/icon/icon';
import { Reveal } from '../../core/directives/reveal';
import { PROCESS, whatsappLink } from '../../core/data/doctor.data';
import { PROCESS_IMAGE, srcsetFor } from '../../core/media/image-variants';

/**
 * Recorrido de atención, desde el primer mensaje hasta el seguimiento.
 *
 * Existe para responder la pregunta que frena a un paciente
 * oncológico: "¿y ahora qué hago?". Bajar la incertidumbre del primer
 * contacto suele convertir más que cualquier argumento de autoridad.
 */
@Component({
  selector: 'app-process',
  /**
   * La sección se anuncia como región con nombre propio.
   *
   * `<app-process>` es un elemento inventado: para un lector de
   * pantalla y para un rastreador no significa nada por sí solo. Con
   * `role="region"` pasa a ser un punto de referencia de la página, y
   * `aria-labelledby` le da como nombre el encabezado que ya está
   * visible, sin duplicar texto.
   */
  host: {
    role: 'region',
    'aria-labelledby': 'titulo-atencion',
  },
  imports: [Icon, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './process.html',
  styleUrl: './process.scss',
})
export class Process {
  protected readonly steps = PROCESS;
  protected readonly portrait = {
    fallback: PROCESS_IMAGE.file,
    avif: srcsetFor(PROCESS_IMAGE.file, PROCESS_IMAGE.widths, 'avif'),
    webp: srcsetFor(PROCESS_IMAGE.file, PROCESS_IMAGE.widths, 'webp'),
  };
  protected readonly waLink = whatsappLink('Hola doctor, quisiera empezar. Le comento mi caso:');
}
