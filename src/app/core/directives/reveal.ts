import {
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  afterNextRender,
} from '@angular/core';

/**
 * Revela un elemento cuando entra en el viewport.
 *
 * Usa IntersectionObserver en lugar de escuchar el scroll: el navegador
 * hace el cálculo fuera del hilo principal y no hay handlers disparándose
 * en cada píxel. Se desconecta sola tras revelar, porque la animación
 * de entrada solo tiene sentido una vez.
 *
 * Uso:  <div appReveal [revealDelay]="120">…</div>
 */
@Directive({
  selector: '[appReveal]',
  host: { class: 'reveal' },
})
export class Reveal implements OnDestroy {
  /** Retardo en milisegundos, para escalonar elementos de una misma fila */
  readonly revealDelay = input(0);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  constructor() {
    afterNextRender(() => this.observe());
  }

  private observe(): void {
    const el = this.host.nativeElement;
    el.style.setProperty('--reveal-delay', `${this.revealDelay()}ms`);

    // Sin soporte o con movimiento reducido: mostrar de inmediato.
    const prefersReduced =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          this.observer?.disconnect();
        }
      },
      // Se dispara un poco antes de que el borde entre: la animación
      // termina justo cuando el elemento queda a la vista.
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
