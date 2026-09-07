import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { imageVariantFor, srcsetFor, type ModernFormat } from '../../core/media/image-variants';

/** Una foto del carrusel con la frase que la acompaña. */
export interface RotatorSlide {
  /** Ruta del original dentro de /public, tal como está en el registro */
  readonly file: string;
  readonly alt: string;
  /** Frase que se lee sobre la foto */
  readonly caption: string;
  /** Dimensiones reales del archivo. Aunque la foto va posicionada en
   *  absoluto y no puede desplazar nada, declararlas deja que el navegador
   *  reserve la proporción antes de descargarla. */
  readonly width: number;
  readonly height: number;
  /** Encuadre, para que el recorte no corte una cara */
  readonly position?: string;
}

/** Milisegundos que se muestra cada foto antes de pasar a la siguiente. */
const DWELL = 5200;

/**
 * Carrusel de fotografías con pie de foto.
 *
 * Sustituye a las imágenes fijas de los mosaicos: el doctor tiene muchas más
 * fotos de las que caben en la maquetación, y rotarlas deja verlas todas sin
 * añadir un solo bloque a la página.
 *
 * TRES DECISIONES QUE NO SON DE ESTILO
 *
 * · Solo gira cuando está a la vista. Un carrusel que avanza fuera de pantalla
 *   gasta trabajo de composición y descarga fotos que nadie va a ver.
 * · Se detiene al pasar el ratón y al recibir el foco por teclado, para poder
 *   leer un pie de foto sin que se escape.
 * · Con `prefers-reduced-motion` no gira: se queda en la primera. Un cambio de
 *   imagen cada cinco segundos es exactamente lo que hace ilegible una página
 *   a quien pide menos movimiento.
 *
 * La primera foto va con `loading="eager"` y las demás en diferido: en el HTML
 * publicado solo se ve la primera, así que es la única que compite por el LCP.
 */
@Component({
  selector: 'app-photo-rotator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './photo-rotator.html',
  styleUrl: './photo-rotator.scss',
  host: {
    '(mouseenter)': 'pause()',
    '(mouseleave)': 'resume()',
    '(focusin)': 'pause()',
    '(focusout)': 'resume()',
  },
})
export class PhotoRotator {
  readonly slides = input.required<readonly RotatorSlide[]>();

  /** Índice de la foto visible. */
  protected readonly current = signal(0);

  /** Cada foto con su `srcset` ya resuelto desde el registro de variantes. */
  protected readonly resolved = computed(() =>
    this.slides().map((slide) => {
      const variant = imageVariantFor(slide.file);
      const set = (format: ModernFormat) => srcsetFor(slide.file, variant.widths, format);
      return { ...slide, avif: set('avif'), webp: set('webp') };
    }),
  );

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private timer?: ReturnType<typeof setInterval>;
  private visible = false;
  private hovered = false;

  constructor() {
    afterNextRender(() => this.watchVisibility());
    this.destroyRef.onDestroy(() => this.stop());
  }

  protected pause(): void {
    this.hovered = true;
    this.stop();
  }

  protected resume(): void {
    this.hovered = false;
    this.sync();
  }

  private watchVisibility(): void {
    if (this.slides().length < 2 || !this.shouldRotate()) return;

    if (typeof IntersectionObserver === 'undefined') {
      this.visible = true;
      this.sync();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        this.visible = entry.isIntersecting;
        this.sync();
      },
      { threshold: 0.25 },
    );
    observer.observe(this.host.nativeElement);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  private sync(): void {
    if (this.visible && !this.hovered) this.start();
    else this.stop();
  }

  private start(): void {
    if (this.timer) return;
    this.timer = setInterval(() => {
      this.current.update((i) => (i + 1) % this.slides().length);
    }, DWELL);
  }

  private stop(): void {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = undefined;
  }

  private shouldRotate(): boolean {
    return !(
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }
}
