import { Routes } from '@angular/router';
import { Story } from './sections/story/story';

/**
 * RUTAS DEL SITIO
 * ---------------
 * La landing es una sola página con anclas; el resto son páginas de apoyo
 * que existen por razones concretas, no por completar un menú:
 *
 *  · `/gracias`     cierra el circuito después de escribir por WhatsApp, y es
 *                   la URL que Analytics puede contar como conversión.
 *  · `/privacidad`  obligación legal desde que la página mide visitas.
 *  · `/404`         se prerenderiza a `404.html` para que Cloudflare devuelva
 *                   un 404 de verdad. Sin ella, una URL inexistente respondía
 *                   200 con la portada: para Google eso es un «soft 404» y
 *                   ensucia el índice.
 *
 * Las tres van con `loadComponent` porque son secundarias: quien entra a la
 * portada —la inmensa mayoría— no debe descargar su código.
 */
export const routes: Routes = [
  {
    path: '',
    component: Story,
  },
  {
    path: 'gracias',
    loadComponent: () => import('./pages/gracias/gracias').then((m) => m.Gracias),
  },
  {
    path: 'privacidad',
    loadComponent: () => import('./pages/privacidad/privacidad').then((m) => m.Privacidad),
  },
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
