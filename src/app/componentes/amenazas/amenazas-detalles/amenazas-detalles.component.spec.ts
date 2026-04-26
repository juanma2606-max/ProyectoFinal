import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmenazasDetallesComponent } from './amenazas-detalles.component';

describe('AmenazasDetallesComponent', () => {
  let component: AmenazasDetallesComponent;
  let fixture: ComponentFixture<AmenazasDetallesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmenazasDetallesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmenazasDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
