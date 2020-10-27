import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TcShapePopupComponent } from './tc-shape-popup.component';

describe('TcShapePopupComponent', () => {
  let component: TcShapePopupComponent;
  let fixture: ComponentFixture<TcShapePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TcShapePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcShapePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
