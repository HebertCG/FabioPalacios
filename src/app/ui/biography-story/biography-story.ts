import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { imageVariantFor, srcsetFor } from '../../core/media/image-variants';
import { BIOGRAPHY, parseEmphasis } from './biography.data';

const PHOTO = 'fabio/fabio-biografia-ircad.jpg';

/** Desplazamiento mínimo, en píxeles, para que un deslizamiento cuente. */
const SWIPE_THRESHOLD = 44;

/** Radio del anillo de progreso que rodea la foto (viewBox 0-100). */
const RING_RADIUS = 48;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

/**
 * Biografía del doctor contada por capítulos.
 *
 * Todos los capítulos están en el HTML desde el servidor —el relato entero
 * es contenido indexable— y se apilan en la misma celda de la rejilla. Así
 * el bloque mide siempre lo que mide el capítulo más largo y cambiar de
 * uno a otro no mueve nada de la página: solo cambia cuál se ve.
 *
 * Se avanza con las flechas, con el teclado (← →) o deslizando en el móvil.
 * El anillo que rodea la foto se completa a medida que avanza la historia.
 */
@Component({
  selector: 'app-biography-story',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './biography-story.html',
  styleUrl: './biography-story.scss',
})
export class BiographyStory {
  protected readonly chapters = BIOGRAPHY.map((chapter) => ({
    ...chapter,
    blocks: chapter.blocks.map((block) =>
      block.kind === 'p' ? { kind: 'p' as const, parts: parseEmphasis(block.text) } : block,
    ),
  }));

  protected readonly total = this.chapters.length;
  protected readonly current = signal(0);

  protected readonly isFirst = computed(() => this.current() === 0);
  protected readonly isLast = computed(() => this.current() === this.total - 1);

  protected readonly ringLength = RING_LENGTH;
  protected readonly ringOffset = computed(
    () => RING_LENGTH * (1 - (this.current() + 1) / this.total),
  );

  protected readonly photo = (() => {
    const { widths } = imageVariantFor(PHOTO);
    return {
      src: PHOTO,
      avif: srcsetFor(PHOTO, widths, 'avif'),
      webp: srcsetFor(PHOTO, widths, 'webp'),
    };
  })();

  private touchStartX: number | null = null;

  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  protected next(): void {
    if (this.isLast()) {
      this.goTo(0);
      return;
    }
    this.goTo(this.current() + 1);
  }

  protected prev(): void {
    if (!this.isFirst()) this.goTo(this.current() - 1);
  }

  protected goTo(index: number): void {
    if (index === this.current() || index < 0 || index >= this.total) return;
    this.current.set(index);
  }

  protected onKey(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') this.next();
    else if (event.key === 'ArrowLeft') this.prev();
    else return;
    event.preventDefault();
  }

  protected onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0]?.clientX ?? null;
  }

  protected onTouchEnd(event: TouchEvent): void {
    if (this.touchStartX === null) return;
    const delta = (event.changedTouches[0]?.clientX ?? this.touchStartX) - this.touchStartX;
    this.touchStartX = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta < 0) this.next();
    else this.prev();
  }
}
