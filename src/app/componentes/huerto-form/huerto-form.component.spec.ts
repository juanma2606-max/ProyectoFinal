import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HuertoFormComponent } from './huerto-form.component';

describe('HuertoFormComponent', () => {
  let component: HuertoFormComponent;
  let fixture: ComponentFixture<HuertoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HuertoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HuertoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
