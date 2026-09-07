import { DestroyRef, Injectable, inject } from '@angular/core';
import Lenis from 'lenis';

/**
 * DESPLAZAMIENTO SUAVE
 * --------------------
 * El scroll del navegador salta tantos píxeles como diga la rueda y para en
 * seco. Lenis interpola entre la posición actual y la de destino en cada
 * fotograma, así que la página sigue al gesto con inercia en lugar de
 * teletransportarse.
 *
 * POR QUÉ UNA LIBRERÍA Y NO SESENTA LÍNEAS PROPIAS
 *
 * Porque Lenis escribe la posición REAL del documento en cada fotograma, en
 * vez de mover un contenedor con `transform` como hacen otros. Eso importa
 * aquí más que en la mayoría de sitios: esta página apoya casi todo su
 * movimiento en la posición nativa de scroll —el `IntersectionObserver` de
 * `appReveal`, el que vigila qué sección está activa en el navbar, el que
 * arranca los carruseles y los videos, y las animaciones con
 * `animation-timeline: view()`—. Un scroll falso por `transform` los dejaría
 * a todos congelados, porque para el navegador la página nunca se movería.
 *
 * TRES COSAS QUE NO SON PREFERENCIAS
 *
 * · No arranca durante el prerender. No hay ventana que desplazar.
 * · No arranca con `prefers-reduced-motion`. La inercia es justo el tipo de
 *   movimiento que marea a quien pide menos movimiento, y además el sistema
 *   ya deja el scroll nativo, que es instantáneo y predecible.
 * · No toca el gesto táctil. En un móvil, el impulso del scroll lo calcula
 *   el sistema operativo y la gente lo tiene en el dedo; interceptarlo
 *   añade retardo y en iOS pelea con el rebote de Safari. En pantalla táctil
 *   lo que se nota es el movimiento ligado al scroll —las entradas y la
 *   deriva de las fotos—, y eso funciona igual con el scroll nativo.
 */

/** Cuánto tarda en alcanzar el destino, en segundos. Por encima de ~1,2 s
 *  deja de sentirse suave y empieza a sentirse pesado. */
const DURATION = 1.05;

/** Margen extra sobre la altura del navbar al saltar a un ancla. */
const ANCHOR_GAP = 24;

@Injectable({ providedIn: 'root' })
export class SmoothScroll {
  private lenis: Lenis | null = null;
  private frame = 0;

  private readonly destroyRef = inject(DestroyRef);

  /** Arranca el bucle. Idempotente: llamarlo dos veces no crea dos Lenis. */
  boot(): void {
    if (this.lenis || typeof window === 'undefined') return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.lenis = new Lenis({
      duration: DURATION,
      /* Exponencial que frena muy al final: llega rápido y se posa. */
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      /* Ver la nota de arriba: el táctil se queda como lo hace el sistema. */
      syncTouch: false,
    });

    const tick = (time: number) => {
      this.lenis?.raf(time);
      this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);

    document.addEventListener('click', this.onAnchorClick, true);
    this.destroyRef.onDestroy(() => this.dispose());
  }

  /**
   * Congela el desplazamiento. Lo usa el visor de videos: sin esto, el fondo
   * sigue corriendo detrás del video a pantalla completa.
   */
  stop(): void {
    this.lenis?.stop();
  }

  start(): void {
    this.lenis?.start();
  }

  /**
   * Los enlaces de ancla del navbar los resolvía `scroll-behavior: smooth`,
   * pero Lenis obliga a apagarlo —los dos escribirían el mismo scroll en el
   * mismo fotograma— y sin esto los saltos volverían a ser secos. Así que
   * los atiende él, que además puede parar bajo el navbar fijo.
   *
   * Solo intercepta lo que es de verdad un ancla de esta misma página. Un
   * enlace a otra ruta, a otro dominio, a otra pestaña o con una tecla
   * modificadora encima sigue su camino normal.
   */
  private readonly onAnchorClick = (event: MouseEvent): void => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

    const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href]');
    if (!link || (link.target && link.target !== '_self')) return;

    let url: URL;
    try {
      url = new URL(link.href, location.href);
    } catch {
      return;
    }

    if (url.origin !== location.origin || url.pathname !== location.pathname) return;
    if (url.hash.length < 2) return;

    const target = this.find(url.hash);
    if (!target) return;

    event.preventDefault();
    this.lenis?.scrollTo(target, { offset: -this.navOffset() });
    history.pushState(null, '', url.hash);
  };

  /** `querySelector` lanza si el fragmento no es un selector válido. */
  private find(hash: string): HTMLElement | null {
    try {
      return document.querySelector<HTMLElement>(hash);
    } catch {
      return null;
    }
  }

  /** Alto del navbar ya encogido, que es como está cuando se ha scrolleado. */
  private navOffset(): number {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--nav-h-scrolled');
    return (parseFloat(raw) || 66) + ANCHOR_GAP;
  }

  private dispose(): void {
    cancelAnimationFrame(this.frame);
    document.removeEventListener('click', this.onAnchorClick, true);
    this.lenis?.destroy();
    this.lenis = null;
  }
}
