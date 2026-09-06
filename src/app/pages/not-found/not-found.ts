import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { whatsappLink } from '../../core/data/doctor.data';
import { PageSeo } from '../page-seo';

/**
 * Página 404.
 *
 * Se prerenderiza a `404.html` para que Cloudflare la sirva con estado 404
 * real. Antes, cualquier URL inexistente devolvía la portada con un 200: eso
 * es un «soft 404», y Google acaba indexando direcciones que no existen.
 *
 * No es un callejón sin salida: lleva el sello del doctor y cuatro enlaces a
 * las secciones que más se buscan, para que quien llegue por un enlace roto
 * encuentre lo que venía a buscar en lugar de cerrar la pestaña.
 */
@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './not-found.html',
  styleUrl: '../page.scss',
})
export class NotFound extends PageSeo {
  protected readonly medicalLink = whatsappLink(
    'Hola doctor, vengo de su página web. Quisiera agendar una consulta oncológica.',
  );

  constructor() {
    super({
      title: 'Página no encontrada | Fabio Palacios',
      description:
        'La dirección que buscas no existe en el sitio del Dr. Fabio Palacios, cirujano ' +
        'oncólogo en Piura. Aquí tienes los accesos principales.',
      path: '404',
      noindex: true,
    });
  }
}
