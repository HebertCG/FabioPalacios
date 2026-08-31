import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Hero } from './hero';

describe('Hero carousel', () => {
  let fixture: ComponentFixture<Hero>;
  let root: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Hero] }).compileComponents();
    fixture = TestBed.createComponent(Hero);
    root = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => fixture.destroy());

  it('renders three banners and advances with the next control', () => {
    expect(root.querySelectorAll('.hero__slide')).toHaveLength(3);

    root.querySelector<HTMLButtonElement>('button[aria-label="Vista siguiente"]')?.click();
    fixture.detectChanges();

    expect(root.querySelector('.hero__dot[aria-current="true"]')?.getAttribute('aria-label')).toContain(
      'Ver portada 2',
    );
    expect(root.querySelector<HTMLElement>('.hero__track')?.style.transform).toContain('-100%');
  });

  it('loads all hero photographs eagerly so an automatic change never appears blank', () => {
    const images = Array.from(root.querySelectorAll<HTMLImageElement>('.portrait__img'));
    expect(images).toHaveLength(3);
    expect(images.every((image) => image.getAttribute('loading') === 'eager')).toBe(true);
  });
});
