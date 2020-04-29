import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArShapePopupComponent } from './ar-shape-popup.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ArShapePopupComponent', () => {
  let component: ArShapePopupComponent;
  let fixture: ComponentFixture<ArShapePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArShapePopupComponent ],
      imports: [ RouterTestingModule ]
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
