import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Navbar } from './layout/navbar/navbar';
import { Story } from './sections/story/story';

/**
 * Shell de la landing.
 *
 * Solo compone y ordena las secciones. Los `id` de cada bloque son los
 * anclajes que usan el navbar, el pie y el resaltado de sección activa,
 * y viven en `NAV_LINKS` dentro de `core/data/doctor.data.ts`.
 *
 * El recorrido presenta primero a Fabio como persona: su propósito,
 * sus charlas y su familia. La medicina aparece después como una parte
 * importante de su historia, sin convertirla en toda su identidad.
 */
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Navbar, Story],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
