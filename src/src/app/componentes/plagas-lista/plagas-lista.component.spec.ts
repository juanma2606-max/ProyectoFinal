import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlagasListaComponent } from './plagas-lista.component';

describe('PlagasListaComponent', () => {
  let component: PlagasListaComponent;
  let fixture: ComponentFixture<PlagasListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlagasListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlagasListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
