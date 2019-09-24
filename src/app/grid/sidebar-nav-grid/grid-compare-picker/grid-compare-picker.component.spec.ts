import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridComparePickerComponent } from './grid-compare-picker.component';

describe('GridComparePickerComponent', () => {
  let component: GridComparePickerComponent;
  let fixture: ComponentFixture<GridComparePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridComparePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridComparePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
