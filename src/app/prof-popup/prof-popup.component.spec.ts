import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfPopupComponent } from './prof-popup.component';

describe('ProfPopupComponent', () => {
  let component: ProfPopupComponent;
  let fixture: ComponentFixture<ProfPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
