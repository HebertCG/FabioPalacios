import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/ssr';
import { appConfig } from './app.config';

/**
 * Configuración usada únicamente al prerenderizar.
 *
 * El sitio se compila como HTML estático (`outputMode: static` en
 * angular.json): en tiempo de build, Angular ejecuta la aplicación en
 * Node y vuelca el resultado en `index.html`. No hay servidor Node en
 * producción; el hosting sirve archivos planos.
 *
 * Esto existe por SEO. Antes, el HTML publicado era literalmente
 * `<app-root></app-root>` y todo el contenido —las seis áreas
 * quirúrgicas, las preguntas frecuentes, la formación— solo aparecía
 * después de que el navegador ejecutara JavaScript. Googlebot lo
 * renderiza, pero en una segunda pasada que puede tardar días; Bing y
 * los rastreadores de WhatsApp, Facebook y LinkedIn no lo hacen del
 * todo. Con prerender, el texto ya está en la respuesta HTML.
 */
const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering()],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
