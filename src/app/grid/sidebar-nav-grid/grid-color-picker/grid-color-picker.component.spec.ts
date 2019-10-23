import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridColorPickerComponent } from './grid-color-picker.component';

describe('GridColorPickerComponent', () => {
  let component: GridColorPickerComponent;
  let fixture: ComponentFixture<GridColorPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridColorPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
