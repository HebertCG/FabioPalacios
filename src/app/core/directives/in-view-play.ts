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
 * queda congelado. Por eso el vídeo arranca mudo y solo suena cuando el
 * usuario pulsa el botón de volumen, que sí es un gesto válido.
 *
 * En iOS hay un requisito extra que no se cumple con JavaScript: el atributo
 * `muted` tiene que estar escrito en el marcado. Poner la propiedad después
 * de renderizar no vale, WebKit ya decidió. De ahí que la entrada de esta
 * directiva se llame `silenced` y no `muted`: si se llamara igual, Angular la
 * trataría como entrada de directiva y el atributo nunca llegaría al HTML.
 *
 * NO ARRANCA SOLO cuando el sistema pide ahorrar datos o reducir el
 * movimiento: un vídeo que se dispara solo consume sin que nadie lo pida.
 *
 * Uso:  <video appInViewPlay muted playsinline [(silenced)]="silenciado"></video>
 */
@Directive({
  selector: 'video[appInViewPlay]',
})
export class InViewPlay implements OnDestroy {
  /**
   * Estado del audio. Bidireccional: lo escribe el botón y lo corrige la
   * directiva si el navegador rechaza el sonido.
   *
   * NO se llama `muted` a propósito. Ese nombre lo consumiría Angular como
   * entrada de directiva y nunca escribiría el atributo `muted` en el HTML
   * —fue justo lo que rompía iOS—, así que la plantilla lo pone literal y
   * esta entrada solo gobierna el estado en tiempo de ejecución.
   */
  readonly silenced = model(true);

  private readonly host = inject<ElementRef<HTMLVideoElement>>(ElementRef);
  private observer?: IntersectionObserver;
  private visible = false;

  constructor() {
    effect(() => {
      const wantsMuted = this.silenced();
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

  /**
   * Arranca con el estado de audio que ya tenga, sin forzar nada.
   *
   * La versión anterior ponía `muted = false` para intentar con sonido y caía
   * a silencio si el navegador lo rechazaba. En iOS eso era peor que inútil:
   * quitar el silencio antes de un gesto del usuario hace que WebKit abandone
   * la carga del medio, y el vídeo se quedaba congelado en el póster aunque
   * el reintento silencioso llegara después.
   */
  private async start(video: HTMLVideoElement): Promise<void> {
    try {
      await video.play();
      return;
    } catch {
      // Rechazado. Si sonaba, casi seguro es por falta de gesto previo.
    }

    if (!video.muted) {
      video.muted = true;
      this.silenced.set(true);
      await video.play().catch(() => undefined);
    }
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
