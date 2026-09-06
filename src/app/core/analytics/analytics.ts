import { DOCUMENT, inject, Injectable } from '@angular/core';
import { ANALYTICS, CONTACT_EVENT } from './analytics.config';

type GtagArgs = [string, ...unknown[]];

interface WindowWithGtag extends Window {
  dataLayer?: unknown[];
  gtag?: (...args: GtagArgs) => void;
}

/**
 * Carga de Google Analytics 4.
 *
 * Solo actúa si `analytics.config.ts` tiene un identificador de verdad.
 * Mientras esté vacío, esta clase no inserta ni una etiqueta ni abre ninguna
 * conexión: la página se queda sin cookies de terceros, y la política de
 * privacidad —que lee la misma bandera— sigue diciendo la verdad.
 *
 * El script se añade con `defer` después del arranque, no en el `index.html`.
 * Ponerlo en la cabecera lo convertiría en un recurso que bloquea el primer
 * pintado, y el LCP de esta página es una fotografía a pantalla completa.
 */
@Injectable({ providedIn: 'root' })
export class Analytics {
  private readonly doc = inject(DOCUMENT);

  /** Idempotente: si el script ya está, no hace nada. */
  load(): void {
    if (!ANALYTICS.enabled) return;

    const win = this.doc.defaultView as WindowWithGtag | null;
    // Durante el prerender no hay ventana, y tampoco un visitante que medir.
    if (!win || win.gtag) return;

    const tag = this.doc.createElement('script');
    tag.async = true;
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS.measurementId}`;
    this.doc.head.appendChild(tag);

    win.dataLayer = win.dataLayer ?? [];
    const gtag = (...args: GtagArgs): void => {
      win.dataLayer?.push(args);
    };
    win.gtag = gtag;

    gtag('js', new Date());
    gtag('config', ANALYTICS.measurementId, {
      // Sin esto, GA4 guarda la IP completa. Anonimizarla es lo mínimo
      // razonable en una web de salud.
      anonymize_ip: true,
    });
  }

  /**
   * Registra que alguien inició una consulta.
   *
   * Los clics a WhatsApp salen del sitio y no dejan rastro, así que este
   * evento —junto con la visita a `/gracias`— es la única forma de saber
   * cuántas consultas genera la página.
   */
  trackContact(reason: string): void {
    const win = this.doc.defaultView as WindowWithGtag | null;
    win?.gtag?.('event', CONTACT_EVENT, { motivo: reason });
  }
}
