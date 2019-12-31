import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArDateRangeComponent } from './ar-date-range.component';

describe('ArDateRangeComponent', () => {
  let component: ArDateRangeComponent;
  let fixture: ComponentFixture<ArDateRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArDateRangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArDateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
