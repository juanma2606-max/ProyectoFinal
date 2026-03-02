import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HuertoListComponent } from './huerto-list.component';

describe('HuertoListComponent', () => {
  let component: HuertoListComponent;
  let fixture: ComponentFixture<HuertoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HuertoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HuertoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
