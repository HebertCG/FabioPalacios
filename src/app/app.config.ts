import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  inject,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { Analytics } from './core/analytics/analytics';
import { Seo } from './core/seo/seo';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    /**
     * `anchorScrolling` mantiene vivas las anclas del navbar al navegar entre
     * paginas: sin el, volver a la portada con `/#charlas` cargaria arriba del
     * todo. `scrollPositionRestoration` evita el otro sintoma tipico, que es
     * abrir una pagina nueva conservando el scroll de la anterior.
     */
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
    ),

    /**
     * El SEO se escribe antes de que se pinte nada.
     *
     * Corre tanto al prerenderizar —y ahí es donde importa, porque el
     * resultado queda grabado en el `index.html` que se publica— como
     * en el navegador tras la hidratación. `Seo.apply()` es idempotente
     * a propósito para que la segunda pasada actualice en lugar de
     * duplicar.
     */
    provideAppInitializer(() => inject(Seo).apply()),

    /**
     * La analítica se carga después, y solo si hay un identificador
     * configurado. Con `analytics.config.ts` vacío esto no hace nada: ni
     * script, ni cookie, ni conexión a un tercero.
     */
    provideAppInitializer(() => inject(Analytics).load()),
  ],
};
