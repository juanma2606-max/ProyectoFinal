import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagenPlantaComponent } from './imagen-planta.component';

describe('ImagenPlantaComponent', () => {
  let component: ImagenPlantaComponent;
  let fixture: ComponentFixture<ImagenPlantaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagenPlantaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagenPlantaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
