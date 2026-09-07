import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ContactCta } from '../../core/directives/contact-cta';
import { SOCIALS, whatsappLink } from '../../core/data/doctor.data';
import { Icon } from '../icon/icon';

/**
 * Botones flotantes de contacto y redes.
 *
 * Se anclan abajo a la derecha, con WhatsApp en la posición más baja: es la
 * más cercana al pulgar y la que menos recorrido exige desde cualquier punto
 * de la página. Los perfiles quedan encima, en una cápsula aparte, porque solo
 * llevan a mirar y no deben competir con la acción.
 *
 * NO APARECEN SOBRE EL HÉROE. Ahí el propio héroe ya ofrece dos botones, y un
 * tercero flotando encima solo tapa la fotografía en el momento en que más
 * importa. Entran cuando el héroe sale de pantalla.
 *
 * En móvil solo se muestra WhatsApp: no hay margen libre a los lados y cuatro
 * círculos apilados taparían contenido.
 */
@Component({
  selector: 'app-social-rail',
  imports: [ContactCta, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './social-rail.html',
  styleUrl: './social-rail.scss',
})
export class SocialRail {
  protected readonly waLink = whatsappLink(
    'Hola doctor, vengo de su página web. Quisiera hacerle una consulta.',
  );

  /**
   * Los perfiles que solo llevan a mirar. `doctoralia` sigue en `SOCIALS` con
   * `enabled: false` porque está sin confirmar, y el filtro lo respeta.
   */
  protected readonly profiles = SOCIALS.filter(
    (social) => social.enabled && social.id !== 'whatsapp',
  );

  protected readonly visible = signal(false);

  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private observer?: IntersectionObserver;

  constructor() {
    afterNextRender(() => this.watchHero());

    // Al cambiar de ruta, el héroe deja de existir —o vuelve a existir— y el
    // observador anterior queda apuntando a un elemento fuera del documento.
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => queueMicrotask(() => this.watchHero()));

    this.destroyRef.onDestroy(() => this.observer?.disconnect());
  }

  private watchHero(): void {
    // El observador de rutas también se dispara durante el prerender, donde no
    // hay DOM. Ahí no hay nada que observar: el HTML se publica con los botones
    // ocultos, que es justo su estado inicial sobre el héroe.
    if (typeof document === 'undefined') return;

    this.observer?.disconnect();
    this.observer = undefined;

    const hero = document.getElementById('inicio');

    // Fuera de la portada no hay héroe que respetar: los botones son útiles
    // desde el primer momento.
    if (!hero || typeof IntersectionObserver === 'undefined') {
      this.visible.set(true);
      return;
    }

    this.observer = new IntersectionObserver(([entry]) => this.visible.set(!entry.isIntersecting), {
      threshold: 0,
    });
    this.observer.observe(hero);
  }
}
