import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantaDetalleComponent } from './planta-detalle.component';

describe('PlantaDetalleComponent', () => {
  let component: PlantaDetalleComponent;
  let fixture: ComponentFixture<PlantaDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantaDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
