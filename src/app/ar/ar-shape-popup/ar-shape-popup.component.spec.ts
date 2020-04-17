import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArShapePopupComponent } from './ar-shape-popup.component';

describe('ArShapePopupComponent', () => {
  let component: ArShapePopupComponent;
  let fixture: ComponentFixture<ArShapePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArShapePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArShapePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
