import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { Icon } from '../../ui/icon/icon';
import {
  CONTACT,
  DOCTOR,
  FOOTER,
  NAV_LINKS,
  SOCIALS,
  SPECIALTIES,
  whatsappLink,
} from '../../core/data/doctor.data';

/**
 * Pie de página.
 *
 * Además de navegación, deja constancia de que el sitio no reemplaza una
 * consulta y repite el canal de contacto para quien llegó al final.
 */
@Component({
  selector: 'app-footer',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly doctor = DOCTOR;
  protected readonly contact = CONTACT;
  protected readonly footer = FOOTER;
  protected readonly links = NAV_LINKS;
  protected readonly specialties = SPECIALTIES;
  protected readonly waLink = whatsappLink();
  protected readonly year = new Date().getFullYear();

  /** Solo las redes confirmadas llegan al pie. */
  protected readonly socials = computed(() =>
    SOCIALS.filter((s) => s.enabled && s.id !== 'whatsapp'),
  );
}
