import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresSliderComponent } from './pres-slider.component';

describe('PresSliderComponent', () => {
  let component: PresSliderComponent;
  let fixture: ComponentFixture<PresSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
