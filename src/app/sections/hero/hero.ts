import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { Icon } from '../../ui/icon/icon';
import { HERO_SLIDES, whatsappLink } from '../../core/data/doctor.data';
import { imageVariantFor, srcsetFor } from '../../core/media/image-variants';

const AUTOPLAY_DELAY = 6500;
const SWIPE_THRESHOLD = 48;

/**
 * Carrusel principal de tres relatos: cercanía, trayectoria y precisión.
 * Mantiene la composición aprobada y cambia contenido e imagen como una
 * sola vista para que cada avance se sienta como un banner completo.
 */
@Component({
  selector: 'app-hero',
  host: {
    role: 'region',
    'aria-labelledby': 'titulo-inicio',
  },
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  protected readonly activeIndex = signal(0);
  protected readonly waLink = whatsappLink();
  protected readonly slides = HERO_SLIDES.map((slide) => {
    const image = imageVariantFor(slide.image);
    return {
      ...slide,
      sources: {
        fallback: image.file,
        avif: srcsetFor(image.file, image.widths, 'avif'),
        webp: srcsetFor(image.file, image.widths, 'webp'),
      },
    };
  });
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

  protected select(index: number): void {
    this.activeIndex.set(index);
    this.restartAutoplay();
  }

  protected step(direction: -1 | 1, userInitiated = true): void {
    const next = (this.activeIndex() + direction + this.slides.length) % this.slides.length;
    this.activeIndex.set(next);
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
      this.step(-1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.step(1);
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

    if (Math.abs(distance) >= SWIPE_THRESHOLD) this.step(distance < 0 ? 1 : -1, false);
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
      if (!document.hidden) this.step(1, false);
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
