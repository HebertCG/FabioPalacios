import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { Icon } from '../../ui/icon/icon';
import { CONTACT, SOCIALS } from '../../core/data/doctor.data';

/**
 * Atajos flotantes a las redes del doctor.
 *
 * Orden vertical: las redes arriba y WhatsApp abajo, más grande y en
 * verde, porque es la acción que de verdad convierte.
 *
 * En móvil se ocultan las redes y queda solo WhatsApp. Motivo: en una
 * pantalla de 375px una columna de cuatro botones tapa contenido y
 * compite con el pulgar, y quien entra desde el celular casi siempre
 * quiere escribir, no navegar a otro perfil. Qué botón sobrevive lo
 * decide la bandera `keepOnMobile` de cada red, no el CSS.
 */
@Component({
  selector: 'app-social-dock',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './social-dock.html',
  styleUrl: './social-dock.scss',
})
export class SocialDock {
  protected readonly phone = CONTACT.whatsappDisplay;

  /** Redes visibles arriba: confirmadas y distintas de WhatsApp */
  protected readonly links = computed(() =>
    SOCIALS.filter((s) => s.enabled && s.id !== 'whatsapp'),
  );

  /** WhatsApp va aparte: es el botón principal del dock */
  protected readonly whatsapp = computed(() =>
    SOCIALS.find((s) => s.id === 'whatsapp' && s.enabled),
  );
}
