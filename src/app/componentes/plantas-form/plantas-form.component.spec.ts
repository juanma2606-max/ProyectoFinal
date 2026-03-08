import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantasFormComponent } from './plantas-form.component';

describe('PlantasFormComponent', () => {
  let component: PlantasFormComponent;
  let fixture: ComponentFixture<PlantasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantasFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
