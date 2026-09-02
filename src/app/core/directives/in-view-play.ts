import {
  Directive,
  ElementRef,
  OnDestroy,
  afterNextRender,
  effect,
  inject,
  model,
} from '@angular/core';

/**
 * Reproduce un vídeo mientras está a la vista y lo pausa al salir.
 *
 * Usa IntersectionObserver en lugar de escuchar el scroll, por lo mismo que
 * `appReveal`: el cálculo lo hace el navegador fuera del hilo principal.
 *
 * SOBRE EL SONIDO
 *
 * Ningún navegador deja arrancar un vídeo con audio si el usuario todavía no
 * ha tocado la página; `play()` devuelve una promesa rechazada y el vídeo se
 * queda congelado. Aquí se intenta con sonido y, si el navegador lo rechaza,
 * se reintenta en silencio y se avisa por `muted` para que el botón muestre
 * el estado real. En cuanto haya cualquier gesto en la página —el propio
 * botón de volumen, por ejemplo— el sonido ya está permitido.
 *
 * NO ARRANCA SOLO cuando el sistema pide ahorrar datos o reducir el
 * movimiento: un vídeo que se dispara solo consume sin que nadie lo pida.
 *
 * Uso:  <video appInViewPlay [(muted)]="silenciado" playsinline></video>
 */
@Directive({
  selector: 'video[appInViewPlay]',
})
export class InViewPlay implements OnDestroy {
  /** Estado real del audio. Bidireccional: lo escribe el botón y lo corrige
   *  la directiva cuando el navegador rechaza el sonido. */
  readonly muted = model(true);

  private readonly host = inject<ElementRef<HTMLVideoElement>>(ElementRef);
  private observer?: IntersectionObserver;
  private visible = false;

  constructor() {
    effect(() => {
      const wantsMuted = this.muted();
      const video = this.host.nativeElement;
      video.muted = wantsMuted;
      // Quitar el silencio a mano cuenta como gesto: si estaba pausado por
      // haberse rechazado antes, este es el momento de arrancarlo.
      if (!wantsMuted && this.visible && video.paused) {
        video.play().catch(() => undefined);
      }
    });

    afterNextRender(() => this.observe());
  }

  private observe(): void {
    if (typeof IntersectionObserver === 'undefined' || !this.shouldAutoplay()) return;

    const video = this.host.nativeElement;

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          this.visible = entry.isIntersecting;
          if (entry.isIntersecting) {
            void this.start(video);
          } else if (!video.paused) {
            video.pause();
          }
        }
      },
      // La mitad a la vista: evita que arranque de refilón al pasar de largo.
      { threshold: 0.5 },
    );

    this.observer.observe(video);
  }

  /** Intenta con sonido; si el navegador lo rechaza, cae a silencio. */
  private async start(video: HTMLVideoElement): Promise<void> {
    video.muted = false;
    try {
      await video.play();
      this.muted.set(false);
      return;
    } catch {
      // Sin gesto previo del usuario. Se reintenta en silencio.
    }

    video.muted = true;
    this.muted.set(true);
    await video.play().catch(() => undefined);
  }

  private shouldAutoplay(): boolean {
    if (
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return false;
    }

    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;

    if (connection?.saveData) return false;
    if (connection?.effectiveType && /^(slow-)?2g$/.test(connection.effectiveType)) return false;

    return true;
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
