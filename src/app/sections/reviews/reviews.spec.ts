import { TestBed } from '@angular/core/testing';
import { REVIEWS } from '../../core/data/doctor.data';
import { Reviews } from './reviews';

describe('Reviews', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Reviews] }).compileComponents();
  });

  it('muestra tres testimonios ficticios claramente identificados', () => {
    const fixture = TestBed.createComponent(Reviews);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;

    expect(REVIEWS.published).toHaveLength(3);
    expect(REVIEWS.published.every((review) => review.isSample)).toBe(true);
    expect(root.querySelectorAll('.review-card')).toHaveLength(3);
    expect(root.textContent).toContain('Testimonios de muestra');
    expect(root.textContent).not.toContain('Contenido demostrativo y ficticio');
    expect(root.querySelector('.review-actions')).toBeNull();
  });

  it('dibuja exactamente cinco estrellas completas en cada tarjeta', () => {
    const fixture = TestBed.createComponent(Reviews);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelectorAll('.review-card__rating app-icon')).toHaveLength(15);
    expect(root.querySelectorAll('.review-card__rating app-icon.is-off')).toHaveLength(0);
    expect(root.textContent?.match(/5 de 5 estrellas/g)).toHaveLength(3);
  });
});
