import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '../../ui/icon/icon';
import { Reveal } from '../../core/directives/reveal';
import { PROCESS, whatsappLink } from '../../core/data/doctor.data';

/**
 * Recorrido de atención, desde el primer mensaje hasta el seguimiento.
 *
 * Existe para responder la pregunta que frena a un paciente
 * oncológico: "¿y ahora qué hago?". Bajar la incertidumbre del primer
 * contacto suele convertir más que cualquier argumento de autoridad.
 */
@Component({
  selector: 'app-process',
  imports: [Icon, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './process.html',
  styleUrl: './process.scss',
})
export class Process {
  protected readonly steps = PROCESS;
  protected readonly waLink = whatsappLink(
    'Hola doctor, quisiera empezar. Le comento mi caso:',
  );
}
