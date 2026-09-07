import { ChangeDetectionStrategy, Component, HostListener, computed, signal } from '@angular/core';
import { ContactCta } from '../../core/directives/contact-cta';
import { InViewPlay } from '../../core/directives/in-view-play';
import { RouterLink } from '@angular/router';
import { MemberMarquee } from '../../ui/member-marquee/member-marquee';
import { PhotoRotator, type RotatorSlide } from '../../ui/photo-rotator/photo-rotator';
import { Reveal } from '../../core/directives/reveal';
import {
  COACH_VIDEO,
  CONTACT,
  DOCTOR,
  REELS,
  NAV_LINKS,
  SOCIALS,
  SPECIALTIES,
  SURVIVOR_PROGRAM,
  whatsappLink,
} from '../../core/data/doctor.data';
import { imageVariantFor, srcsetFor, type ModernFormat } from '../../core/media/image-variants';

/** Motivo de consulta: cada uno redacta su propio mensaje de WhatsApp. */
interface ContactReason {
  readonly id: string;
  readonly label: string;
  readonly message: string;
}

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
  imports: [ContactCta, InViewPlay, MemberMarquee, PhotoRotator, Reveal, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './story.html',
  styleUrl: './story.scss',
})
export class Story {
  protected readonly photos = {
    hero: media('fabio/fabio-comunidad-portada.jpg'),
    listening: media('fabio/fabio-escuchando-comunidad.jpg'),
    community: media('fabio/fabio-cercano-comunidad.jpg'),
    conference: media('fabio/fabio-conferencia-oncologia.jpg'),
    podcast: media('fabio/fabio-charla-podcast.jpg'),
    coupleMemory: media('fabio/fabio-esposa-recuerdo.jpg'),
    couple: media('fabio/fabio-esposa.jpg'),
    family: media('fabio/fabio-familia-estudio.jpg'),
    familyCeremony: media('fabio/fabio-familia-ceremonia.jpg'),
    innovation: media('fabio/fabio-innovacion-quirurgica.jpg'),
    surgeryPortrait: media('ImagenPrincipal_2.jpg'),
    laparoscopy: media('fabio/fabio-cirugia-laparoscopica.jpg'),
    reviewingStudy: media('fabio/fabio-explicando-estudio.jpg'),
  } as const;

  /* El bloque médico se sirve de doctor.data.ts, que documenta de dónde
     sale cada credencial. Aquí no se redacta ningún dato clínico nuevo. */
  protected readonly doctor = DOCTOR;
  protected readonly surgicalAreas = SPECIALTIES;

  /** Los tres hitos de formación, en orden cronológico. */
  protected readonly training = [
    { place: 'Cayetano Heredia', what: 'Médico Cirujano' },
    { place: 'INEN', what: 'Residencia en Cirugía Oncológica' },
    { place: 'IRCAD América Latina', what: 'Cirugía mínimamente invasiva' },
  ] as const;

  /* ---------- Carruseles del bloque médico ----------
     Tres series, agrupadas por lo que cuentan y no por dónde caben: el
     quirófano, el trabajo en equipo y la decisión previa a operar. Cada foto
     lleva su propia frase, así que el pie cambia con la imagen en lugar de
     poner un rótulo genérico sobre fotos distintas. */

  protected readonly surgeryShots: readonly RotatorSlide[] = [
    {
      file: 'ImagenPrincipal_2.jpg',
      width: 1086,
      height: 1600,
      alt: 'Fabio Palacios operando con instrumental laparoscópico',
      caption: 'Cada movimiento es un acto de vida',
      position: '50% 18%',
    },
    {
      file: 'fabio/fabio-quirofano-espera.jpg',
      width: 561,
      height: 1024,
      alt: 'Fabio Palacios preparado en sala de operaciones antes de intervenir',
      caption: 'La calma antes del primer corte',
      position: '50% 22%',
    },
    {
      file: 'fabio/fabio-quirofano-lampara.jpg',
      width: 960,
      height: 1280,
      alt: 'Fabio Palacios en sala de operaciones bajo la lámpara quirúrgica',
      caption: 'Quince años en sala de operaciones',
      position: '50% 14%',
    },
  ];

  protected readonly techniqueShots: readonly RotatorSlide[] = [
    {
      file: 'fabio/fabio-cirugia-laparoscopica.jpg',
      width: 960,
      height: 1280,
      alt: 'Fabio Palacios sosteniendo instrumental laparoscópico durante una intervención',
      caption: 'Técnica mínimamente invasiva',
      position: '50% 16%',
    },
    {
      file: 'fabio/fabio-equipo-quirofano.jpg',
      width: 1280,
      height: 960,
      alt: 'Fabio Palacios con su equipo quirúrgico al terminar una intervención',
      caption: 'Ninguna cirugía se hace solo',
      position: '50% 30%',
    },
    {
      file: 'fabio/fabio-equipo-mesa.jpg',
      width: 1280,
      height: 960,
      alt: 'El equipo quirúrgico de Fabio Palacios en la mesa de operaciones',
      caption: 'Un equipo entrenado para lo complejo',
      position: '50% 26%',
    },
  ];

  protected readonly reviewShots: readonly RotatorSlide[] = [
    {
      file: 'fabio/fabio-explicando-estudio.jpg',
      width: 960,
      height: 1280,
      alt: 'Fabio Palacios señalando una tomografía junto a un colega',
      caption: 'Revisar el caso antes de decidir',
      position: '50% 30%',
    },
    {
      file: 'fabio/fabio-junta-imagenes.jpg',
      width: 1280,
      height: 960,
      alt: 'Fabio Palacios revisando estudios de imágenes con otros médicos',
      caption: 'Cada imagen ayuda a decidir mejor',
      position: '50% 34%',
    },
    {
      file: 'fabio/fabio-junta-medica.jpg',
      width: 1280,
      height: 960,
      alt: 'Fabio Palacios en una junta médica con colegas',
      caption: 'Años de experiencia respaldan cada decisión',
      position: '50% 36%',
    },
  ];

  /* ---------- Acompañamiento y programas ---------- */

  protected readonly coachVideo = COACH_VIDEO;

  /** Lo escribe el boton y lo corrige la directiva si el navegador rechaza
   *  el sonido, asi que el icono siempre muestra el estado real. */
  protected readonly coachMuted = signal(true);
  /**
   * Los cuatro programas, cada uno con su chat ya redactado. El enlace se
   * resuelve aquí y no en la plantilla: llamar a `whatsappLink()` dentro del
   * `@for` lo recalcularía en cada detección de cambios y devolvería una
   * cadena nueva cada vez, que es justo lo que hace que Angular vuelva a
   * escribir el `href` sin motivo.
   */
  protected readonly programmes = SURVIVOR_PROGRAM.map((programme) => ({
    ...programme,
    link: whatsappLink(programme.message),
  }));

  /** Para quien no sabe cuál le toca. Es la mitad de los casos. */
  protected readonly survivorLink = whatsappLink(
    'Hola doctor, vengo de su página web. Quisiera saber cuál de sus programas de ' +
      'acompañamiento me conviene.',
  );

  /* ---------- Videos ---------- */

  protected readonly clips = REELS;
  protected readonly tiktokLink =
    SOCIALS.find((s) => s.id === 'tiktok')?.url ?? 'https://www.tiktok.com/@dr..fabio.palacio';

  /**
   * Solo se monta el <video> de la tarjeta abierta. Así los siete MP4
   * —67 MB en total— no se tocan hasta que alguien pulsa reproducir, y
   * nunca suenan dos a la vez.
   */
  /**
   * Dos estados distintos: el video puede sonar dentro de su tarjeta o
   * haberse llevado al visor. Nunca los dos a la vez — expandir apaga el
   * de la tarjeta, o se oirían dos pistas encima.
   */
  private readonly inlineClipId = signal<string | null>(null);
  private readonly viewerClipId = signal<string | null>(null);

  protected isInline(id: string): boolean {
    return this.inlineClipId() === id;
  }

  /** El clip del visor, o null. El overlay solo existe cuando hay uno. */
  protected readonly viewerClip = computed(
    () => this.clips.find((clip) => clip.id === this.viewerClipId()) ?? null,
  );

  protected playInline(id: string): void {
    this.inlineClipId.set(id);
  }

  protected stopInline(): void {
    this.inlineClipId.set(null);
  }

  protected expandClip(id: string): void {
    this.inlineClipId.set(null);
    this.viewerClipId.set(id);
    this.lockScroll(true);
  }

  protected closeViewer(): void {
    this.viewerClipId.set(null);
    this.lockScroll(false);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.viewerClipId()) this.closeViewer();
  }

  /** El fondo no debe desplazarse detrás del visor. Guardado por SSR. */
  private lockScroll(lock: boolean): void {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = lock ? 'hidden' : '';
  }

  /** 112 → «1:52» */
  protected clipTime(seconds: number | undefined): string {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
  }

  /* ---------- Pie ---------- */

  protected readonly navLinks = NAV_LINKS;

  /* ---------- Contacto ---------- */

  protected readonly contact = CONTACT;

  /**
   * El mayor freno de un CTA de WhatsApp no es pulsarlo: es no saber qué
   * escribir después. Cada motivo abre el chat con el mensaje ya redactado,
   * y el paciente solo tiene que enviarlo o editarlo.
   */
  protected readonly reasons: readonly ContactReason[] = [
    {
      id: 'diagnostico',
      label: 'Tengo un diagnóstico reciente',
      message:
        'Hola doctor, vengo de su página web. Tengo un diagnóstico oncológico reciente y ' +
        'quisiera agendar una consulta.',
    },
    {
      id: 'segunda-opinion',
      label: 'Quiero una segunda opinión',
      message:
        'Hola doctor, vengo de su página web. Quisiera una segunda opinión sobre mi caso ' +
        'oncológico.',
    },
    {
      id: 'cirugia',
      label: 'Tengo dudas sobre una cirugía',
      message:
        'Hola doctor, vengo de su página web. Tengo dudas sobre una cirugía oncológica y ' +
        'quisiera orientación.',
    },
    {
      id: 'familiar',
      label: 'Acompaño a un familiar',
      message:
        'Hola doctor, vengo de su página web. Acompaño a un familiar con un diagnóstico ' +
        'oncológico y quisiera agendar una consulta.',
    },
  ];

  protected readonly chosenReason = signal(this.reasons[0].id);

  protected readonly contactLink = computed(() => {
    const reason = this.reasons.find((item) => item.id === this.chosenReason());
    return whatsappLink(reason?.message);
  });

  protected chooseReason(id: string): void {
    this.chosenReason.set(id);
  }

  protected readonly conversationLink = whatsappLink(
    'Hola Fabio, conocí tu historia en la página web. Quisiera conversar contigo sobre una charla.',
  );

  protected readonly medicalLink = whatsappLink(
    'Hola doctor, vengo de su página web. Quisiera recibir orientación para agendar una consulta oncológica.',
  );
}
