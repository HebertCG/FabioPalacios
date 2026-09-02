import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Reveal } from '../../core/directives/reveal';
import { whatsappLink } from '../../core/data/doctor.data';
import {
  imageVariantFor,
  srcsetFor,
  type ModernFormat,
} from '../../core/media/image-variants';

interface StoryMedia {
  readonly src: string;
  readonly avif: string;
  readonly webp: string;
}

function media(src: string): StoryMedia {
  const variant = imageVariantFor(src);
  const srcset = (format: ModernFormat) => srcsetFor(src, variant.widths, format);
  return { src, avif: srcset('avif'), webp: srcset('webp') };
}

@Component({
  selector: 'app-story',
  imports: [Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './story.html',
  styleUrl: './story.scss',
})
export class Story {
  protected readonly carouselPaused = signal(false);

  protected readonly photos = {
    hero: media('fabio/fabio-comunidad-portada.jpg'),
    listening: media('fabio/fabio-escuchando-comunidad.jpg'),
    community: media('fabio/fabio-cercano-comunidad.jpg'),
    conference: media('fabio/fabio-conferencia-oncologia.jpg'),
    podcast: media('fabio/fabio-charla-podcast.jpg'),
    coupleMemory: media('fabio/fabio-esposa-recuerdo.jpg'),
    couple: media('fabio/fabio-esposa.jpg'),
    family: media('fabio/fabio-familia.jpg'),
    innovation: media('fabio/fabio-innovacion-quirurgica.jpg'),
    medicalTeam: media('fabio/fabio-equipo-medico.jpg'),
    doctorPortrait: media('dr-fabio-palacios-cirugia-oncologica-quirofano.jpg'),
  } as const;

  protected readonly conversationLink = whatsappLink(
    'Hola Fabio, conocí tu historia en la página web. Quisiera conversar contigo sobre una charla.',
  );

  protected readonly medicalLink = whatsappLink(
    'Hola doctor, vengo de su página web. Quisiera recibir orientación para agendar una consulta oncológica.',
  );

  protected toggleCarousel(): void {
    this.carouselPaused.update((paused) => !paused);
  }
}
