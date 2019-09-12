import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DoubleSliderComponent } from './double-slider.component';
import { DebugElement } from '@angular/core'; //can view dom elements with this
import { QueryService } from '../../services/query.service';

import { By } from '@angular/platform-browser';

import { MaterialModule } from '../../../material/material.module';
import { NouisliderModule } from 'ng2-nouislider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('DoubleSliderComponent', () => {
  let component: DoubleSliderComponent;
  let fixture: ComponentFixture<DoubleSliderComponent>;
  let debugElement: DebugElement;
  let queryService: QueryService;
  let spy: jasmine.Spy;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DoubleSliderComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [ QueryService ], 
      imports: [    MaterialModule,
                    RouterTestingModule,
                    BrowserAnimationsModule, NouisliderModule
                   ]
    }).compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(DoubleSliderComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    queryService = debugElement.injector.get(QueryService);

    queryService.setParamsFromURL()
    
    spy = spyOn(queryService, 'sendPresMessage');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set minValuechange', () => {
      const value = 1000;
      component.minValuechange(value)
      expect(component['lRange']).toEqual(value)
  });

  it('should set maxValuechange', () => {
      const value = 5555;
      component.maxValuechange(value)
      expect(component['uRange']).toEqual(value)
  });

  it('should set inputs', () => {
    const maxValue = 5555;
    component.maxValuechange(maxValue)
    const minValue = 1111;
    component.minValuechange(minValue)
    expect(component['sliderRange']).toEqual([minValue, maxValue])
});
});

