import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Icon } from '../../ui/icon/icon';
import {
  CONTACT,
  DOCTOR,
  NAV_LINKS,
  whatsappLink,
} from '../../core/data/doctor.data';

/** Píxeles de scroll a partir de los cuales la barra se contrae. */
const MORPH_THRESHOLD = 48;

/**
 * Barra de navegación con metamorfosis al hacer scroll.
 *
 * En el tope se comporta como una barra clásica: ancho completo,
 * transparente sobre el héroe. Al bajar se contrae por los lados,
 * se redondea, se vuelve vidrio translúcido y se despega del borde.
 * Al volver arriba recorre la transición en sentido inverso.
 *
 * La transición vive en CSS sobre una sola clase (`is-morphed`), de
 * modo que el componente solo decide *cuándo*, nunca *cómo*.
 *
 * El listener de scroll es pasivo y se coalesce con
 * requestAnimationFrame: como máximo una lectura de `scrollY` por
 * frame, sin trabajo de layout dentro del handler.
 */
@Component({
  selector: 'app-navbar',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  protected readonly links = NAV_LINKS;
  protected readonly doctor = DOCTOR;
  protected readonly waLink = whatsappLink(
    `Hola doctor, vengo de su página web. Quisiera agendar una consulta.`,
  );
  protected readonly phoneDisplay = CONTACT.whatsappDisplay;

  /** `true` cuando la barra ya adoptó su forma contraída */
  protected readonly morphed = signal(false);
  /** Estado del menú desplegable en móvil */
  protected readonly menuOpen = signal(false);
  /** Id de la sección visible, para marcar el enlace activo */
  protected readonly activeSection = signal<string>('inicio');

  private readonly destroyRef = inject(DestroyRef);
  private readonly sheet = viewChild.required<ElementRef<HTMLElement>>('sheet');
  private ticking = false;
  private menuFocusTimer: ReturnType<typeof setTimeout> | undefined;
  private restoreFocusTo: HTMLElement | null = null;
  private previousBodyOverflow: string | null = null;

  constructor() {
    afterNextRender(() => {
      this.watchScroll();
      this.watchSections();
    });

    this.destroyRef.onDestroy(() => {
      if (this.menuFocusTimer) clearTimeout(this.menuFocusTimer);
      this.unlockBodyScroll();
    });
  }

  protected toggleMenu(event: Event): void {
    if (this.menuOpen()) {
      this.closeMenu();
      return;
    }

    this.restoreFocusTo = event.currentTarget as HTMLElement;
    this.menuOpen.set(true);
    this.lockBodyScroll();
    this.menuFocusTimer = setTimeout(() =>
      this.sheet().nativeElement.querySelector<HTMLElement>('a[href]')?.focus(),
      50,
    );
  }

  protected closeMenu(): void {
    if (!this.menuOpen()) return;
    const restoreFocusTo = this.restoreFocusTo;
    this.restoreFocusTo = null;
    this.menuOpen.set(false);
    this.unlockBodyScroll();
    this.menuFocusTimer = setTimeout(() => restoreFocusTo?.focus());
  }

  protected trapMenuFocus(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeMenu();
      return;
    }
    if (event.key !== 'Tab') return;

    const focusable = Array.from(
      this.sheet().nativeElement.querySelectorAll<HTMLElement>('a[href]'),
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /* ---------------- scroll ---------------- */

  private watchScroll(): void {
    const onScroll = (): void => {
      if (this.ticking) return;
      this.ticking = true;
      requestAnimationFrame(() => {
        this.morphed.set(window.scrollY > MORPH_THRESHOLD);
        this.ticking = false;
      });
    };

    onScroll(); // estado correcto si la página carga ya desplazada
    window.addEventListener('scroll', onScroll, { passive: true });
    this.destroyRef.onDestroy(() =>
      window.removeEventListener('scroll', onScroll),
    );
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

  /* ---------------- sección activa ---------------- */

  private watchSections(): void {
    const sections = this.links
      .map((link) => document.querySelector<HTMLElement>(link.href))
      .filter((el): el is HTMLElement => el !== null);

    if (!sections.length || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        // La sección que ocupa más pantalla gana.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) this.activeSection.set(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    this.destroyRef.onDestroy(() => observer.disconnect());
  }
}
