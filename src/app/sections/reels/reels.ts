import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { Icon } from '../../ui/icon/icon';
import { Reveal } from '../../core/directives/reveal';
import { REELS } from '../../core/data/doctor.data';

const AUTOPLAY_DELAY = 4200;
// En el ancho máximo previo al layout de dos columnas caben casi cuatro
// tarjetas. Este colchón permite alinear el clon siguiente sin tocar el borde.
const LOOP_CLONE_COUNT = Math.min(4, REELS.length);

interface CarouselItem {
  readonly key: string;
  readonly reel: (typeof REELS)[number];
  readonly reelIndex: number;
  readonly isClone: boolean;
}

const CAROUSEL_ITEMS: readonly CarouselItem[] = [
  ...REELS.slice(-LOOP_CLONE_COUNT).map((reel, index) => ({
    key: `before-${reel.id}`,
    reel,
    reelIndex: REELS.length - LOOP_CLONE_COUNT + index,
    isClone: true,
  })),
  ...REELS.map((reel, reelIndex) => ({
    key: `main-${reel.id}`,
    reel,
    reelIndex,
    isClone: false,
  })),
  ...REELS.slice(0, LOOP_CLONE_COUNT).map((reel, reelIndex) => ({
    key: `after-${reel.id}`,
    reel,
    reelIndex,
    isClone: true,
  })),
];

/**
 * Sección de videos verticales (reels de TikTok).
 *
 * ESTRATEGIA DE CARGA
 * Los seis videos pesan cerca de 58 MB en total, así que ninguno se
 * descarga completo al abrir la página: cada `<video>` usa
 * `preload="metadata"` y un fragmento temporal `#t=0.1` en el `src`,
 * que hace que el navegador pinte ese fotograma como portada sin
 * bajar el archivo entero ni necesitar imágenes de póster aparte.
 *
 * COMPORTAMIENTO
 * · El carrusel avanza automáticamente y se pausa mientras el usuario
 *   mantiene el cursor o el foco dentro de la pista.
 * · En escritorio, al pasar el cursor la tarjeta reproduce en silencio
 *   una previsualización; al salir, se pausa y vuelve al inicio.
 * · Al hacer clic se abre el visor a pantalla completa con sonido.
 *   El clic es el gesto del usuario que los navegadores exigen para
 *   permitir audio, así que ahí sí se puede desactivar el silencio.
 * · Solo se reproduce un video a la vez, en el visor o en la tarjeta.
 */
@Component({
  selector: 'app-reels',
  imports: [Icon, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reels.html',
  styleUrl: './reels.scss',
})
export class Reels {
  protected readonly reels = REELS;
  protected readonly carouselItems = CAROUSEL_ITEMS;

  /** Índice del video abierto en el visor, o `null` si está cerrado */
  protected readonly openIndex = signal<number | null>(null);
  protected readonly isMuted = signal(false);

  protected readonly openReel = computed(() => {
    const i = this.openIndex();
    return i === null ? null : this.reels[i];
  });

  private readonly rail =
    viewChild.required<ElementRef<HTMLDivElement>>('rail');
  private readonly previews =
    viewChildren<ElementRef<HTMLVideoElement>>('preview');
  private readonly player = viewChild<ElementRef<HTMLVideoElement>>('player');
  private readonly viewer = viewChild<ElementRef<HTMLElement>>('viewer');
  private readonly closeButton =
    viewChild<ElementRef<HTMLButtonElement>>('closeButton');

  private readonly destroyRef = inject(DestroyRef);
  private autoplayTimer: ReturnType<typeof setInterval> | undefined;
  private railResetTimer: ReturnType<typeof setTimeout> | undefined;
  private initialRailFrame: number | undefined;
  private autoplayPaused = false;
  private previousBodyOverflow: string | null = null;
  private restoreFocusTo: HTMLElement | null = null;
  private focusTimer: ReturnType<typeof setTimeout> | undefined;
  private readonly prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor() {
    afterNextRender(() => {
      this.initializeRail();
      this.watchKeyboard();
      this.startAutoplay();
    });

    this.destroyRef.onDestroy(() => {
      this.stopAutoplay();
      if (this.railResetTimer) clearTimeout(this.railResetTimer);
      if (this.initialRailFrame) cancelAnimationFrame(this.initialRailFrame);
      this.unlockBodyScroll();
      if (this.focusTimer) clearTimeout(this.focusTimer);
    });
  }

  /* ---------------- previsualización en la tarjeta ---------------- */

  protected previewPlay(index: number): void {
    if (this.openIndex() !== null) return;
    const video = this.previews()[index]?.nativeElement;
    if (!video) return;
    video.muted = true;
    // play() devuelve una promesa que se rechaza si el usuario mueve
    // el cursor antes de que el video esté listo. No es un error real.
    void video.play().catch(() => undefined);
  }

  protected previewStop(index: number): void {
    const video = this.previews()[index]?.nativeElement;
    if (!video) return;
    video.pause();
    video.currentTime = 0.1;
  }

  /* ---------------- visor ---------------- */

  protected open(index: number, event?: Event): void {
    this.stopAllPreviews();
    this.stopAutoplay();
    this.restoreFocusTo =
      this.rail().nativeElement.querySelectorAll<HTMLButtonElement>(
        '.card__btn',
      )[LOOP_CLONE_COUNT + index] ??
      (event?.currentTarget as HTMLElement | null);
    this.openIndex.set(index);
    this.isMuted.set(false);
    this.lockBodyScroll();
    this.focusTimer = setTimeout(() => this.closeButton()?.nativeElement.focus());
  }

  protected close(): void {
    const restoreFocusTo = this.restoreFocusTo;
    this.restoreFocusTo = null;
    this.openIndex.set(null);
    this.unlockBodyScroll();
    this.startAutoplay();
    this.focusTimer = setTimeout(() => restoreFocusTo?.focus());
  }

  protected step(delta: number): void {
    const current = this.openIndex();
    if (current === null) return;
    const next = (current + delta + this.reels.length) % this.reels.length;
    this.openIndex.set(next);
  }

  protected toggleMute(): void {
    const video = this.player()?.nativeElement;
    if (!video) return;
    video.muted = !video.muted;
    this.isMuted.set(video.muted);
  }

  protected syncMuteState(): void {
    const video = this.player()?.nativeElement;
    if (video) this.isMuted.set(video.muted);
  }

  protected trapFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;

    const viewer = this.viewer()?.nativeElement;
    if (!viewer) return;

    const focusable = Array.from(
      viewer.querySelectorAll<HTMLElement>(
        'button:not([disabled]):not([tabindex="-1"]), a[href], video[controls], [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || !viewer.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /** Al terminar un video, pasa al siguiente: se comporta como TikTok. */
  protected onEnded(): void {
    this.step(1);
  }

  /* ---------------- rail horizontal ---------------- */

  protected scrollRail(direction: -1 | 1): void {
    this.moveRail(direction);
    this.restartAutoplay();
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

  private moveRail(direction: -1 | 1): void {
    const current = this.closestCarouselIndex();
    const target = Math.max(
      0,
      Math.min(this.carouselItems.length - 1, current + direction),
    );

    this.scrollToCarouselIndex(
      target,
      this.prefersReducedMotion ? 'auto' : 'smooth',
    );

    if (this.prefersReducedMotion) {
      this.normalizeRailPosition();
      return;
    }

  }

  private initializeRail(): void {
    const el = this.rail().nativeElement;
    const onScrollEnd = (): void => this.normalizeRailPosition();
    const onScroll = (): void => {
      if (this.railResetTimer) clearTimeout(this.railResetTimer);
      this.railResetTimer = setTimeout(
        () => this.normalizeRailPosition(),
        180,
      );
    };

    this.initialRailFrame = requestAnimationFrame(() => {
      this.initialRailFrame = undefined;
      this.scrollToCarouselIndex(LOOP_CLONE_COUNT, 'auto');
    });
    el.addEventListener('scrollend', onScrollEnd);
    el.addEventListener('scroll', onScroll, { passive: true });
    this.destroyRef.onDestroy(() => {
      el.removeEventListener('scrollend', onScrollEnd);
      el.removeEventListener('scroll', onScroll);
    });
  }

  private closestCarouselIndex(): number {
    const el = this.rail().nativeElement;
    const cards = Array.from(el.querySelectorAll<HTMLElement>('.card'));
    const railLeft = el.getBoundingClientRect().left;
    const paddingLeft = Number.parseFloat(getComputedStyle(el).paddingLeft) || 0;

    return cards.reduce(
      (closest, card, index) => {
        const distance = Math.abs(
          card.getBoundingClientRect().left - railLeft - paddingLeft,
        );
        return distance < closest.distance ? { index, distance } : closest;
      },
      { index: LOOP_CLONE_COUNT, distance: Number.POSITIVE_INFINITY },
    ).index;
  }

  private scrollToCarouselIndex(
    index: number,
    behavior: ScrollBehavior,
  ): void {
    const el = this.rail().nativeElement;
    const card = el.querySelectorAll<HTMLElement>('.card')[index];
    if (!card) return;

    const paddingLeft = Number.parseFloat(getComputedStyle(el).paddingLeft) || 0;
    el.scrollTo({ left: card.offsetLeft - paddingLeft, behavior });
  }

  private normalizeRailPosition(): void {
    if (this.railResetTimer) {
      clearTimeout(this.railResetTimer);
      this.railResetTimer = undefined;
    }

    if (!this.carouselItems.length) return;

    const current = this.closestCarouselIndex();
    const firstReal = LOOP_CLONE_COUNT;
    const afterLastReal = firstReal + this.reels.length;
    if (current >= firstReal && current < afterLastReal) return;

    const equivalentReal = firstReal + this.carouselItems[current].reelIndex;
    this.scrollToCarouselIndex(equivalentReal, 'auto');
  }

  private stopAllPreviews(): void {
    for (const preview of this.previews()) {
      const video = preview.nativeElement;
      video.pause();
      video.currentTime = 0.1;
    }
  }

  private startAutoplay(): void {
    if (
      this.prefersReducedMotion ||
      this.autoplayPaused ||
      this.openIndex() !== null ||
      this.autoplayTimer
    ) {
      return;
    }

    this.autoplayTimer = setInterval(() => {
      if (!document.hidden) this.moveRail(1);
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

  private lockBodyScroll(): void {
    if (this.previousBodyOverflow !== null) return;
    this.previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }

  private unlockBodyScroll(): void {
    if (this.previousBodyOverflow === null) return;
    document.body.style.overflow = this.previousBodyOverflow;
    this.previousBodyOverflow = null;
  }

  private watchKeyboard(): void {
    const onKey = (event: KeyboardEvent): void => {
      if (this.openIndex() === null) return;
      if (event.key === 'Escape') this.close();
      if (
        event.target instanceof HTMLMediaElement ||
        document.activeElement instanceof HTMLMediaElement
      ) {
        return;
      }
      if (event.key === 'ArrowRight') this.step(1);
      if (event.key === 'ArrowLeft') this.step(-1);
    };

    window.addEventListener('keydown', onKey);
    this.destroyRef.onDestroy(() =>
      window.removeEventListener('keydown', onKey),
    );
  }
}
