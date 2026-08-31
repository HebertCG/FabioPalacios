import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { Icon } from '../../ui/icon/icon';
import { Reveal } from '../../core/directives/reveal';
import {
  ABOUT,
  ADVANTAGES,
  DOCTOR_GALLERY,
  whatsappLink,
} from '../../core/data/doctor.data';
import { imageVariantFor, srcsetFor } from '../../core/media/image-variants';

const AUTOPLAY_DELAY = 5200;
const SWIPE_THRESHOLD = 44;

/** Sección personal con una galería que mezcla cercanía, formación y práctica clínica. */
@Component({
  selector: 'app-about',
  host: {
    role: 'region',
    'aria-labelledby': 'titulo-sobre-mi',
  },
  imports: [Icon, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  protected readonly about = ABOUT;
  protected readonly advantages = ADVANTAGES;
  protected readonly activePhotoIndex = signal(0);
  protected readonly photos = DOCTOR_GALLERY.map((photo) => {
    const image = imageVariantFor(photo.image);
    return {
      ...photo,
      sources: {
        fallback: image.file,
        avif: srcsetFor(image.file, image.widths, 'avif'),
        webp: srcsetFor(image.file, image.widths, 'webp'),
      },
    };
  });
  protected readonly waLink = whatsappLink(
    'Hola doctor, leí su página y quisiera una consulta para revisar mi caso.',
  );

  private readonly destroyRef = inject(DestroyRef);
  private autoplayTimer: ReturnType<typeof setInterval> | undefined;
  private autoplayPaused = false;
  private pointerStartX: number | null = null;
  private readonly prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

  constructor() {
    afterNextRender(() => this.startAutoplay());
    this.destroyRef.onDestroy(() => this.stopAutoplay());
  }

  protected selectPhoto(index: number): void {
    this.activePhotoIndex.set(index);
    this.restartAutoplay();
  }

  protected stepPhoto(direction: -1 | 1, userInitiated = true): void {
    const next =
      (this.activePhotoIndex() + direction + this.photos.length) % this.photos.length;
    this.activePhotoIndex.set(next);
    if (userInitiated) this.restartAutoplay();
  }

  protected pauseAutoplay(): void {
    this.autoplayPaused = true;
    this.stopAutoplay();
  }

  protected resumeAutoplay(event?: FocusEvent): void {
    const container = event?.currentTarget as HTMLElement | null;
    const nextTarget = event?.relatedTarget as Node | null;
    if (container && nextTarget && container.contains(nextTarget)) return;

    this.autoplayPaused = false;
    this.startAutoplay();
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.stepPhoto(-1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.stepPhoto(1);
    }
  }

  protected pointerDown(event: PointerEvent): void {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
    this.pointerStartX = event.clientX;
    this.pauseAutoplay();
  }

  protected pointerUp(event: PointerEvent): void {
    if (this.pointerStartX === null) return;
    const distance = event.clientX - this.pointerStartX;
    this.pointerStartX = null;

    if (Math.abs(distance) >= SWIPE_THRESHOLD) this.stepPhoto(distance < 0 ? 1 : -1, false);
    this.autoplayPaused = false;
    this.startAutoplay();
  }

  protected pointerCancel(): void {
    this.pointerStartX = null;
    this.autoplayPaused = false;
    this.startAutoplay();
  }

  private startAutoplay(): void {
    if (this.prefersReducedMotion || this.autoplayPaused || this.autoplayTimer) return;
    this.autoplayTimer = setInterval(() => {
      if (!document.hidden) this.stepPhoto(1, false);
    }, AUTOPLAY_DELAY);
  }

  private stopAutoplay(): void {
    if (!this.autoplayTimer) return;
    clearInterval(this.autoplayTimer);
    this.autoplayTimer = undefined;
  }

  private restartAutoplay(): void {
    this.stopAutoplay();
    this.startAutoplay();
  }
}
