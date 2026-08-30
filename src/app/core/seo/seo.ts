/**
 * SERVICIO SEO
 * ------------
 * Escribe en el `<head>` todo lo que los buscadores y las redes leen:
 * título, descripción, canonical, Open Graph, Twitter Card y el bloque
 * de datos estructurados.
 *
 * ¿POR QUÉ AQUÍ Y NO EN `index.html`?
 * Porque estas etiquetas se derivan del contenido real. El título sale
 * de la ciudad y la especialidad, la descripción nombra las áreas
 * quirúrgicas y el JSON-LD recorre las seis especialidades y las seis
 * preguntas frecuentes. Escritas a mano en `index.html` se quedarían
 * desactualizadas la primera vez que el doctor corrija un dato, y nadie
 * se daría cuenta: una etiqueta meta desfasada no rompe nada visible.
 *
 * ¿Y NO ES PEOR PARA EL RASTREADOR?
 * No, porque el sitio se prerenderiza. Este código corre en Node
 * durante `ng build` y las etiquetas quedan escritas en el HTML que se
 * publica. El navegador no tiene que ejecutar nada para que Google las
 * vea. Ver `app.config.server.ts`.
 *
 * IDEMPOTENTE: en el navegador, tras la hidratación, todo esto se
 * ejecuta por segunda vez sobre un `<head>` que ya trae las etiquetas
 * del prerender. Cada método busca la etiqueta antes de crearla, así
 * que el resultado es actualizar, nunca duplicar.
 */

import { DOCUMENT, inject, Injectable } from '@angular/core';
import { CONTACT, DOCTOR } from '../data/doctor.data';
import { serializeStructuredData } from './structured-data';
import {
  absoluteUrl,
  SEO_DESCRIPTION,
  SEO_KEYWORDS,
  SEO_SOCIAL_DESCRIPTION,
  SEO_SOCIAL_IMAGE,
  SEO_TITLE,
  SITE_LOCALE,
  SITE_LOCALE_OG,
  SITE_ORIGIN,
} from './site.config';

/** `id` del script de datos estructurados, para poder reemplazarlo. */
const JSON_LD_ID = 'schema-org-graph';

@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly doc = inject(DOCUMENT);

  /** Escribe la cabecera completa. Se invoca una sola vez al arrancar. */
  apply(): void {
    this.applyTitle();
    this.applyPrimaryMeta();
    this.applyOpenGraph();
    this.applyTwitterCard();
    this.applyLocalMeta();
    this.applyLinks();
    this.applyStructuredData();
  }

  /* ---------------- título ---------------- */

  private applyTitle(): void {
    this.doc.title = SEO_TITLE;
  }

  /* ---------------- meta básicas ---------------- */

  private applyPrimaryMeta(): void {
    this.setMeta('name', 'description', SEO_DESCRIPTION);
    this.setMeta('name', 'keywords', SEO_KEYWORDS);
    this.setMeta('name', 'author', DOCTOR.displayName);

    /**
     * `max-image-preview:large` es lo que autoriza a Google a mostrar
     * el retrato en grande junto al resultado, en vez de una miniatura.
     * En búsquedas de médicos, la foto es buena parte del clic.
     * `max-snippet:-1` levanta el límite de longitud del extracto.
     */
    this.setMeta(
      'name',
      'robots',
      'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    );

    /** Directiva específica de Google, por si difiere de la genérica. */
    this.setMeta('name', 'googlebot', 'index, follow, max-image-preview:large, max-snippet:-1');

    this.setMeta('name', 'theme-color', '#072634');
    this.setMeta('name', 'referrer', 'strict-origin-when-cross-origin');

    /**
     * Evita que Safari en iOS convierta cifras sueltas —CMP 066389, un
     * número de registro— en enlaces de llamada azules. Los teléfonos
     * de verdad ya son enlaces `tel:` explícitos.
     */
    this.setMeta('name', 'format-detection', 'telephone=no');
  }

  /* ---------------- Open Graph ---------------- */

  /**
   * Open Graph gobierna la tarjeta que se ve al pegar el enlace en
   * WhatsApp, Facebook o LinkedIn. Para este consultorio es la vista
   * más frecuente del sitio después de la propia página: los pacientes
   * se pasan el contacto del médico por WhatsApp.
   */
  private applyOpenGraph(): void {
    const image = absoluteUrl(SEO_SOCIAL_IMAGE.path);

    this.setMeta('property', 'og:type', 'website');
    this.setMeta('property', 'og:site_name', DOCTOR.displayName);
    this.setMeta('property', 'og:locale', SITE_LOCALE_OG);
    this.setMeta('property', 'og:title', SEO_TITLE);
    this.setMeta('property', 'og:description', SEO_SOCIAL_DESCRIPTION);
    this.setMeta('property', 'og:url', `${SITE_ORIGIN}/`);
    this.setMeta('property', 'og:image', image);
    this.setMeta('property', 'og:image:secure_url', image);
    this.setMeta('property', 'og:image:type', SEO_SOCIAL_IMAGE.type);
    this.setMeta('property', 'og:image:width', String(SEO_SOCIAL_IMAGE.width));
    this.setMeta('property', 'og:image:height', String(SEO_SOCIAL_IMAGE.height));
    /** Sin `og:image:alt`, quien usa lector de pantalla oye "imagen". */
    this.setMeta('property', 'og:image:alt', SEO_SOCIAL_IMAGE.alt);
  }

  /* ---------------- Twitter / X ---------------- */

  private applyTwitterCard(): void {
    this.setMeta('name', 'twitter:card', 'summary_large_image');
    this.setMeta('name', 'twitter:title', SEO_TITLE);
    this.setMeta('name', 'twitter:description', SEO_SOCIAL_DESCRIPTION);
    this.setMeta('name', 'twitter:image', absoluteUrl(SEO_SOCIAL_IMAGE.path));
    this.setMeta('name', 'twitter:image:alt', SEO_SOCIAL_IMAGE.alt);
  }

  /* ---------------- señales locales ---------------- */

  /**
   * Etiquetas geográficas heredadas. Google no las usa desde hace años,
   * pero varios directorios médicos peruanos y agregadores locales las
   * siguen leyendo al importar una ficha, y es donde este consultorio
   * puede ganar enlaces. Cuestan tres líneas.
   *
   * Solo se declara el nivel de distrito y región, que es información
   * confirmada. Las coordenadas exactas van en el JSON-LD y solo cuando
   * estén verificadas; ver `SITE_GEO` en `site.config.ts`.
   */
  private applyLocalMeta(): void {
    this.setMeta('name', 'geo.region', 'PE-PIU');
    this.setMeta('name', 'geo.placename', `${DOCTOR.district}, ${DOCTOR.city}`);
    this.setMeta('name', 'business:contact_data:locality', `${DOCTOR.district}, ${DOCTOR.city}`);
    this.setMeta('name', 'business:contact_data:country_name', 'Perú');
    this.setMeta('name', 'business:contact_data:phone_number', CONTACT.whatsapp);
  }

  /* ---------------- enlaces de cabecera ---------------- */

  private applyLinks(): void {
    /**
     * Canonical: le dice a Google cuál es la dirección buena. Sin ella,
     * `?fbclid=…` de Facebook, `?utm_source=…` de una campaña y la
     * versión con y sin `www` compiten entre sí como páginas distintas
     * y se reparten la autoridad.
     */
    this.setLink('canonical', `${SITE_ORIGIN}/`);

    /**
     * Una sola versión de idioma, pero declararla evita que Google
     * ofrezca la página a búsquedas de otros países hispanohablantes
     * donde el doctor no atiende.
     */
    this.setLink('alternate', `${SITE_ORIGIN}/`, { hreflang: SITE_LOCALE });
    this.setLink('alternate', `${SITE_ORIGIN}/`, { hreflang: 'x-default' });
  }

  /* ---------------- datos estructurados ---------------- */

  private applyStructuredData(): void {
    const head = this.doc.head;
    const existing = head.querySelector(`#${JSON_LD_ID}`);
    if (existing) existing.remove();

    const script = this.doc.createElement('script');
    script.id = JSON_LD_ID;
    script.type = 'application/ld+json';
    script.textContent = serializeStructuredData();
    head.appendChild(script);
  }

  /* ============================================================
     UTILIDADES DE BAJO NIVEL
     ============================================================ */

  /**
   * Crea o actualiza una `<meta>`.
   *
   * `attr` distingue las dos familias que conviven en una cabecera:
   * `name` para las de HTML y Twitter, `property` para Open Graph, que
   * viene del vocabulario RDFa. Confundirlas hace que Facebook ignore
   * la etiqueta en silencio.
   */
  private setMeta(attr: 'name' | 'property', key: string, content: string): void {
    const head = this.doc.head;
    const selector = `meta[${attr}="${key}"]`;
    let tag = head.querySelector<HTMLMetaElement>(selector);

    if (!tag) {
      tag = this.doc.createElement('meta');
      tag.setAttribute(attr, key);
      head.appendChild(tag);
    }

    tag.setAttribute('content', content);
  }

  /**
   * Crea o actualiza un `<link>` de cabecera.
   *
   * `hreflang` participa en la identidad del enlace: pueden coexistir
   * varios `rel="alternate"` y distinguirlos por idioma es la única
   * forma de no sobrescribir uno con otro.
   */
  private setLink(rel: string, href: string, attrs: Record<string, string> = {}): void {
    const head = this.doc.head;
    const extra = Object.entries(attrs)
      .map(([key, value]) => `[${key}="${value}"]`)
      .join('');
    const selector = `link[rel="${rel}"]${extra}`;
    let tag = head.querySelector<HTMLLinkElement>(selector);

    if (!tag) {
      tag = this.doc.createElement('link');
      tag.setAttribute('rel', rel);
      for (const [key, value] of Object.entries(attrs)) {
        tag.setAttribute(key, value);
      }
      head.appendChild(tag);
    }

    tag.setAttribute('href', href);
  }
}
