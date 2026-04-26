import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagenAmenazaComponent } from './imagen-amenaza.component';

describe('ImagenAmenazaComponent', () => {
  let component: ImagenAmenazaComponent;
  let fixture: ComponentFixture<ImagenAmenazaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagenAmenazaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagenAmenazaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
