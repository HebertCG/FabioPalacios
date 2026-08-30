import type { ApplicationRef } from '@angular/core';
import {
  bootstrapApplication,
  type BootstrapContext,
} from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

/**
 * Punto de entrada del prerender. Lo invoca el builder de Angular
 * durante `ng build`, no un servidor en tiempo de ejecución.
 *
 * El `context` es obligatorio: en el servidor no existe una plataforma
 * global compartida, así que cada renderizado recibe la suya y hay que
 * reenviarla a `bootstrapApplication`.
 */
const bootstrap = (context: BootstrapContext): Promise<ApplicationRef> =>
  bootstrapApplication(App, config, context);

export default bootstrap;
