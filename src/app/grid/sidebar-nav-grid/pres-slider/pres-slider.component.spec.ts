import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresSliderComponent } from './pres-slider.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
//import { MatInputModule } from '@angular/material';
import { QueryGridService } from './../../query-grid.service';
import { RouterTestingModule } from '@angular/router/testing';


describe('PresSliderComponent', () => {
  let component: PresSliderComponent;
  let fixture: ComponentFixture<PresSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresSliderComponent ], 
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [QueryGridService],
      imports: [ RouterTestingModule ]
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
