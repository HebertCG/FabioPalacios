import { ChangeDetectionStrategy, Component, HostListener, computed, signal } from '@angular/core';
import { Reveal } from '../../core/directives/reveal';
import {
  COACH_VIDEO,
  CONTACT,
  CREDENTIALS,
  DOCTOR,
  PREVENTION,
  REELS,
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
  imports: [Reveal],
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
    family: media('fabio/fabio-familia.jpg'),
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
  protected readonly accreditations = CREDENTIALS;

  /** Los tres hitos de formación, en orden cronológico. */
  protected readonly training = [
    { place: 'Cayetano Heredia', what: 'Médico Cirujano' },
    { place: 'INEN', what: 'Residencia en Cirugía Oncológica' },
    { place: 'IRCAD América Latina', what: 'Cirugía mínimamente invasiva' },
  ] as const;

  /* ---------- Acompañamiento, prevención y sobrevivientes ---------- */

  protected readonly coachVideo = COACH_VIDEO;
  protected readonly prevention = PREVENTION;
  protected readonly survivorProgram = SURVIVOR_PROGRAM;

  /** El video del coach vive fuera del raíl, así que lleva su propio estado. */
  protected readonly coachPlaying = signal(false);

  protected playCoach(): void {
    this.coachPlaying.set(true);
  }

  protected readonly survivorLink = whatsappLink(
    'Hola doctor, vengo de su página web. Quisiera participar en el programa de sobrevivientes.',
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
