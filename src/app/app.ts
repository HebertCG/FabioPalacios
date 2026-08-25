import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Navbar } from './layout/navbar/navbar';
import { Footer } from './layout/footer/footer';
import { SocialDock } from './ui/social-dock/social-dock';
import { Hero } from './sections/hero/hero';
import { Credentials } from './sections/credentials/credentials';
import { About } from './sections/about/about';
import { Specialties } from './sections/specialties/specialties';
import { Process } from './sections/process/process';
import { Reels } from './sections/reels/reels';
import { Faq } from './sections/faq/faq';
import { Contact } from './sections/contact/contact';

/**
 * Shell de la landing.
 *
 * Solo compone y ordena las secciones. Los `id` de cada bloque son los
 * anclajes que usan el navbar, el pie y el resaltado de sección activa,
 * y viven en `NAV_LINKS` dentro de `core/data/doctor.data.ts`.
 *
 * El orden responde al recorrido del paciente: primero quién es
 * (héroe y formación), después por qué confiar (sobre mí), luego qué
 * resuelve (especialidades), cómo se atiende (proceso), su voz en
 * primera persona (reels), las dudas que frenan (FAQ) y al final el
 * canal de contacto.
 */
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Navbar,
    Footer,
    SocialDock,
    Hero,
    Credentials,
    About,
    Specialties,
    Process,
    Reels,
    Faq,
    Contact,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
