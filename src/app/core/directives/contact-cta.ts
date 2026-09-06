import { Directive, HostListener, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { Analytics } from '../analytics/analytics';

/** Milisegundos que se le dan al navegador para abrir WhatsApp antes de mover
 *  esta pestaña. Suficiente para que el clic se procese, corto para que nadie
 *  perciba un retraso. */
const HANDOFF_DELAY = 150;

/**
 * Cierra el circuito de un botón de WhatsApp.
 *
 * El enlace lleva `target="_blank"`, así que WhatsApp se abre aparte —en el
 * móvil, la propia aplicación— y esta pestaña se queda exactamente igual. Sin
 * nada más, el paciente no recibe ninguna señal de que su mensaje esté listo.
 *
 * Esta directiva la lleva a `/gracias`, que confirma qué pasó y qué esperar. De
 * paso resuelve el otro problema: un clic hacia fuera del sitio es invisible
 * para la analítica, mientras que una visita a `/gracias` sí se puede contar.
 *
 * Uso:  <a appContactCta ctaReason="agendar" [href]="waLink" target="_blank">
 */
@Directive({
  selector: 'a[appContactCta]',
})
export class ContactCta {
  /** Con qué intención se pulsó, para distinguirlas en los informes. */
  readonly ctaReason = input('general');

  private readonly router = inject(Router);
  private readonly analytics = inject(Analytics);

  @HostListener('click', ['$event'])
  protected onClick(event: MouseEvent): void {
    // Abrir en otra pestaña, con rueda o con Ctrl: el visitante se queda aquí
    // a propósito y moverle la página sería justo lo contrario de lo que pidió.
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;

    this.analytics.trackContact(this.ctaReason());
    setTimeout(() => void this.router.navigate(['/gracias']), HANDOFF_DELAY);
  }
}
