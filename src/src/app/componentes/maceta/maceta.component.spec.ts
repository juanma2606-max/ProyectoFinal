import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacetaComponent } from './maceta.component';

describe('MacetaComponent', () => {
  let component: MacetaComponent;
  let fixture: ComponentFixture<MacetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MacetaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MacetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
