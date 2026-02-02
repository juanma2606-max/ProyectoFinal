import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlagaDetalleComponent } from './plaga-detalle.component';

describe('PlagaDetalleComponent', () => {
  let component: PlagaDetalleComponent;
  let fixture: ComponentFixture<PlagaDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlagaDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlagaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
