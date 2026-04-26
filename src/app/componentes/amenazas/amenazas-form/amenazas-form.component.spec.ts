import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmenazasFormComponent } from './amenazas-form.component';

describe('AmenazasFormComponent', () => {
  let component: AmenazasFormComponent;
  let fixture: ComponentFixture<AmenazasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmenazasFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmenazasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
