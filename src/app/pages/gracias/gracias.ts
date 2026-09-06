import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONTACT } from '../../core/data/doctor.data';
import { PageSeo } from '../page-seo';

/**
 * Página de agradecimiento.
 *
 * A la que se llega tras pulsar un botón de WhatsApp: el chat se abre en una
 * pestaña nueva y esta queda aquí. Sirve para dos cosas.
 *
 * Para el paciente, cierra el circuito. Un botón que abre otra app y deja la
 * página exactamente igual no da ninguna señal de que algo haya ocurrido; aquí
 * se le confirma que el mensaje está listo y se le dice qué esperar.
 *
 * Para la medición, es la única URL que puede contar como conversión. Los
 * clics a WhatsApp salen del sitio y no dejan rastro; una visita a `/gracias`
 * sí, y es lo que permite saber cuántas consultas genera la página.
 *
 * No se indexa: no aporta nada a una búsqueda y aparecería suelta en Google.
 */
@Component({
  selector: 'app-gracias',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './gracias.html',
  styleUrl: '../page.scss',
})
export class Gracias extends PageSeo {
  protected readonly contact = CONTACT;

  constructor() {
    super({
      title: 'Gracias por escribir | Fabio Palacios',
      description:
        'Tu mensaje está listo en WhatsApp. El Dr. Fabio Palacios responde personalmente las ' +
        'consultas oncológicas.',
      path: 'gracias',
      noindex: true,
    });
  }
}
