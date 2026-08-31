import { TestBed } from '@angular/core/testing';
import { Reviews } from './reviews';
import { REVIEWS } from '../../core/data/doctor.data';
import type { PatientReview } from '../../core/models/content.models';

/**
 * Reseña verificable de prueba para comprobar el enlace a la fuente.
 */
const SAMPLE: PatientReview = {
  id: 'ejemplo-solo-para-test',
  quote: 'Explicó el diagnóstico con calma y respondió cada duda.',
  author: 'Paciente de prueba',
  context: 'Consulta en Piura',
  rating: 5,
  sourceUrl: 'https://www.doctoralia.pe/perfil/fabio-palacios#opinion-de-prueba',
};

const render = (published: readonly PatientReview[]) => {
  const fixture = TestBed.createComponent(Reviews);
  fixture.componentRef.setInput('published', published);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
};

describe('Reviews', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Reviews] }).compileComponents();
  });

  it('publica tres testimonios ficticios claramente marcados como muestra', () => {
    expect(REVIEWS.published).toHaveLength(3);
    expect(REVIEWS.published.every((review) => review.isSample)).toBe(true);
    expect(REVIEWS.published.every((review) => review.rating === 5)).toBe(true);

    const root = render(REVIEWS.published);
    expect(root.querySelectorAll('.review-card')).toHaveLength(3);
    expect(root.textContent).toContain('Testimonios de muestra');
    expect(root.textContent).toContain('Contenido demostrativo y ficticio');
  });

  it('sin opiniones lo dice y enlaza al formulario verificado, sin inventar puntuaciones', () => {
    const root = render([]);
    const content = root.textContent ?? '';

    expect(root.querySelectorAll('.review-card')).toHaveLength(0);
    expect(content).toContain('todavía no registra opiniones');
    expect(content).not.toMatch(/\b[1-5][,.]\d\b/);
    expect(
      root.querySelector('a[href="https://www.doctoralia.pe/anade-opinion/fabio-palacios"]'),
    ).not.toBeNull();
  });

  it('con una opinión verificable dibuja su tarjeta, sus estrellas y el enlace a la fuente', () => {
    const root = render([SAMPLE]);
    const card = root.querySelector('.review-card');

    expect(card).not.toBeNull();
    expect(card?.textContent).toContain(SAMPLE.quote);
    expect(card?.textContent).toContain(SAMPLE.author);
    expect(card?.querySelector('.review-card__avatar')?.textContent?.trim()).toBe('P');
    expect(card?.querySelectorAll('.review-card__rating app-icon')).toHaveLength(5);
    expect(card?.querySelectorAll('.review-card__rating app-icon.is-off')).toHaveLength(0);
    expect(card?.querySelector(`a[href="${SAMPLE.sourceUrl}"]`)).not.toBeNull();
  });

  it('apaga las estrellas que la puntuación no alcanza', () => {
    const root = render([{ ...SAMPLE, rating: 4 }]);

    expect(root.querySelectorAll('.review-card__rating app-icon.is-off')).toHaveLength(1);
    expect(root.textContent).toContain('4 de 5 estrellas');
  });
});
