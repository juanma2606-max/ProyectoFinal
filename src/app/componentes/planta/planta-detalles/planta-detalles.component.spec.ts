import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantaDetallesComponent } from './planta-detalles.component';

describe('PlantaDetallesComponent', () => {
  let component: PlantaDetallesComponent;
  let fixture: ComponentFixture<PlantaDetallesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantaDetallesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantaDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
