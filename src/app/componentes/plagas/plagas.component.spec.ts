import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlagasComponent } from './plagas.component';

describe('PlagasComponent', () => {
  let component: PlagasComponent;
  let fixture: ComponentFixture<PlagasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlagasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlagasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
