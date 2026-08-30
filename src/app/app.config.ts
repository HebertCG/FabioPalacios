import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  inject,
} from '@angular/core';
import { Seo } from './core/seo/seo';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

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
  ],
};
