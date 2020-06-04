import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PvxChartComponent } from './pvx-chart.component';

describe('PvxChartComponent', () => {
  let component: PvxChartComponent;
  let fixture: ComponentFixture<PvxChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PvxChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PvxChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
