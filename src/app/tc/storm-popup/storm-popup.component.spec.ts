import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StormPopupComponent } from './storm-popup.component';

describe('StormPopupComponent', () => {
  let component: StormPopupComponent;
  let fixture: ComponentFixture<StormPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StormPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StormPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
