import { ComponentFixture, TestBed } from '@angular/core/testing';
import { About } from './about';

describe('About photo carousel', () => {
  let fixture: ComponentFixture<About>;
  let root: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [About] }).compileComponents();
    fixture = TestBed.createComponent(About);
    root = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => fixture.destroy());

  it('includes the seven curated moments and changes photograph with its controls', () => {
    expect(root.querySelectorAll('.figure__slide')).toHaveLength(7);

    root.querySelector<HTMLButtonElement>('.figure__arrow--next')?.click();
    fixture.detectChanges();

    expect(
      root.querySelector('.figure__dots button[aria-current="true"]')?.getAttribute('aria-label'),
    ).toContain('Ver fotografía 2');
    expect(root.querySelector<HTMLElement>('.figure__track')?.style.transform).toContain('-100%');
  });

  it('provides descriptive alternative text for every photograph', () => {
    const images = Array.from(root.querySelectorAll<HTMLImageElement>('.figure__slide img'));
    expect(images).toHaveLength(7);
    expect(images.every((image) => image.alt.trim().length > 20)).toBe(true);
  });
});
