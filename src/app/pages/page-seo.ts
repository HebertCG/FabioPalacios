import { DOCUMENT, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { absoluteUrl } from '../core/seo/site.config';

/** Lo que cada página de apoyo declara sobre sí misma. */
export interface PageSeoConfig {
  /** Título completo, tal como se verá en la pestaña y en Google */
  readonly title: string;
  /** Resumen para el fragmento gris del resultado de búsqueda */
  readonly description: string;
  /** Ruta sin barra inicial, para construir el canonical */
  readonly path: string;
  /** `true` en páginas que no aportan nada al índice de Google */
  readonly noindex?: boolean;
}

/**
 * Metadatos por página.
 *
 * `core/seo/seo.ts` escribe las etiquetas del sitio en el arranque, pensadas
 * para la portada. Las páginas de apoyo necesitan las suyas: si heredaran el
 * título y el canonical de la portada, Google vería cuatro URLs distintas
 * diciendo ser la misma y repartiría la señal entre todas.
 *
 * Se extiende como clase base porque el trabajo ocurre en el constructor, que
 * es donde hay contexto de inyección. Corre en el prerender —y ahí es donde
 * cuenta, porque queda escrito en el HTML publicado— y otra vez en el
 * navegador al hidratar; `updateTag` reemplaza en vez de duplicar.
 */
export abstract class PageSeo {
  protected constructor(config: PageSeoConfig) {
    const doc = inject(DOCUMENT);
    const title = inject(Title);
    const meta = inject(Meta);
    const url = absoluteUrl(config.path);

    title.setTitle(config.title);

    meta.updateTag({ name: 'description', content: config.description });
    meta.updateTag({
      name: 'robots',
      // `follow` incluso en noindex: la página no debe indexarse, pero sus
      // enlaces internos sí deben transmitir señal al resto del sitio.
      content: config.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large',
    });

    meta.updateTag({ property: 'og:title', content: config.title });
    meta.updateTag({ property: 'og:description', content: config.description });
    meta.updateTag({ property: 'og:url', content: url });
    meta.updateTag({ name: 'twitter:title', content: config.title });
    meta.updateTag({ name: 'twitter:description', content: config.description });

    const canonical = doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', url);
  }
}
