import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { Navbar } from './layout/navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { SmoothScroll } from './core/scroll/smooth-scroll';
import { SocialRail } from './ui/social-rail/social-rail';

/**
 * Shell de la landing.
 *
 * Solo compone y ordena las secciones. Los `id` de cada bloque son los
 * anclajes que usan el navbar, el pie y el resaltado de sección activa,
 * y viven en `NAV_LINKS` dentro de `core/data/doctor.data.ts`.
 *
 * El recorrido presenta primero a Fabio como persona: su propósito y
 * sus charlas. La medicina entra después, como una parte importante de
 * su historia y no como toda su identidad, y la familia cierra el arco
 * devolviendo el relato a lo personal.
 */
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Navbar, RouterOutlet, SocialRail],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly smoothScroll = inject(SmoothScroll);

  constructor() {
    /* Después del primer pintado y solo en el navegador: durante el
       prerender no hay ventana que desplazar. */
    afterNextRender(() => this.smoothScroll.boot());
  }
}
