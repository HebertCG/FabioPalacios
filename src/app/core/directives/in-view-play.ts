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
 * Reproduce un video mientras esta a la vista y lo pausa al salir. En
 * celulares deja el inicio y el audio en manos de los controles nativos.
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
  private static readonly PHONE_QUERY = '(max-width: 767.98px)';

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
  private phoneQuery?: MediaQueryList;
  private manualPlayback = false;
  private visible = false;

  private readonly onPhoneQueryChange = (event: MediaQueryListEvent): void => {
    this.configurePlayback(event.matches);
  };

  private readonly syncMutedState = (): void => {
    const muted = this.host.nativeElement.muted;
    if (this.silenced() !== muted) this.silenced.set(muted);
  };

  constructor() {
    effect(() => {
      const wantsMuted = this.silenced();
      const video = this.host.nativeElement;
      video.muted = wantsMuted;
      // Quitar el silencio a mano cuenta como gesto: si estaba pausado por
      // haberse rechazado antes, este es el momento de arrancarlo.
      if (!this.manualPlayback && !wantsMuted && this.visible && video.paused) {
        video.play().catch(() => undefined);
      }
    });

    afterNextRender(() => this.initializeResponsivePlayback());
  }

  /**
   * En celulares el usuario controla la reproduccion. Safari recibe asi el
   * gesto directo que exige para iniciar medios y no queda atrapado entre un
   * play() automatico rechazado y el poster.
   */
  private initializeResponsivePlayback(): void {
    const video = this.host.nativeElement;
    video.addEventListener('volumechange', this.syncMutedState);

    if (typeof matchMedia !== 'function') {
      this.configurePlayback(false);
      return;
    }

    this.phoneQuery = matchMedia(InViewPlay.PHONE_QUERY);
    this.addPhoneQueryListener(this.phoneQuery);
    this.configurePlayback(this.phoneQuery.matches);
  }

  /** `addListener` mantiene compatibilidad con versiones antiguas de iOS. */
  private addPhoneQueryListener(query: MediaQueryList): void {
    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', this.onPhoneQueryChange);
    } else {
      query.addListener(this.onPhoneQueryChange);
    }
  }

  private removePhoneQueryListener(query: MediaQueryList): void {
    if (typeof query.removeEventListener === 'function') {
      query.removeEventListener('change', this.onPhoneQueryChange);
    } else {
      query.removeListener(this.onPhoneQueryChange);
    }
  }

  private configurePlayback(isPhone: boolean): void {
    const video = this.host.nativeElement;
    this.observer?.disconnect();
    this.observer = undefined;
    this.visible = false;

    this.manualPlayback = isPhone || !this.shouldAutoplay();
    video.controls = this.manualPlayback;

    if (this.manualPlayback) {
      if (!video.paused) video.pause();
      return;
    }

    this.observe();
  }

  private observe(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.manualPlayback = true;
      this.host.nativeElement.controls = true;
      return;
    }

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
    if (this.phoneQuery) this.removePhoneQueryListener(this.phoneQuery);
    this.host.nativeElement.removeEventListener('volumechange', this.syncMutedState);
  }
}
