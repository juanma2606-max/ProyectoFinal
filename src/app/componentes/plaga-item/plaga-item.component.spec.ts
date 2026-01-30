import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlagaItemComponent } from './plaga-item.component';

describe('PlagaItemComponent', () => {
  let component: PlagaItemComponent;
  let fixture: ComponentFixture<PlagaItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlagaItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlagaItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
