import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TcHourRangeComponent } from './tc-hour-range.component';

describe('TcHourRangeComponent', () => {
  let component: TcHourRangeComponent;
  let fixture: ComponentFixture<TcHourRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TcHourRangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcHourRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
