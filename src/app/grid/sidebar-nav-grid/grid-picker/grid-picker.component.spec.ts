import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridPickerComponent } from './grid-picker.component';

describe('GridPickerComponent', () => {
  let component: GridPickerComponent;
  let fixture: ComponentFixture<GridPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
