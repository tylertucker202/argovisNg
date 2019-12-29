import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { MonthPickerComponent } from './month-picker.component'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { MaterialModule } from './../../../material/material.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DebugElement } from '@angular/core'; //can view dom elements with this
import { QueryGridService } from './../../query-grid.service'
import {FormControl} from '@angular/forms'

import { RouterTestingModule } from '@angular/router/testing'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import * as moment from 'moment'

describe('MonthPickerComponent', () => {
  let component: MonthPickerComponent;
  let fixture: ComponentFixture<MonthPickerComponent>;
  let debugElement: DebugElement;
  let queryGridService: QueryGridService;
  let spyGetMonthYear: jasmine.Spy;
  let spySendmonthYear: jasmine.Spy;
  let spy: jasmine.Spy;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthPickerComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      imports: [ MaterialModule, FormsModule, ReactiveFormsModule, RouterTestingModule, BrowserAnimationsModule ],
      providers: [ QueryGridService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthPickerComponent)
    component = fixture.componentInstance
    component.paramMode = true
    debugElement = fixture.debugElement

    queryGridService = debugElement.injector.get(QueryGridService)

    spyGetMonthYear = spyOn(queryGridService, 'getMonthYear').and.callThrough()
    spySendmonthYear = spyOn(queryGridService, 'sendmonthYear').and.callThrough()
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy()
    expect(component['date']).toBeTruthy()
    expect(component['monthYear']).toBeTruthy()
    expect(component['minDate']).toBeTruthy()
    expect(component['maxDate']).toBeTruthy()
    expect(component['paramMode']).toBeTruthy()

    expect(spyGetMonthYear).toHaveBeenCalledTimes(1)
  });

  it('should set date', () => {
    const monthYear = moment('01-2007', 'MM-YYYY').utc(false)
    const date = new FormControl(monthYear)
    expect(component['monthYear']).toEqual(monthYear)
    const cDate = component['date']
    expect(cDate.value.format('MM-YYYY')).toEqual(monthYear.format('MM-YYYY'))
  });

  it('should incrementMonth', () => {

    component['incrementMonth'](1)

    let mys = moment('02-2007', 'MM-YYYY').utc(false).format('MM-YYYY')
    expect(component['monthYear'].format('MM-YYYY')).toEqual(mys)
    let cDate = component['date']
    expect(cDate.value.format('MM-YYYY')).toEqual(mys)

    component['incrementMonth'](-1)
    mys = moment('01-2007', 'MM-YYYY').utc(false).format('MM-YYYY')
    expect(component['monthYear'].format('MM-YYYY')).toEqual(mys)
    cDate = component['date']
    expect(cDate.value.format('MM-YYYY')).toEqual(mys)

    component['incrementMonth'](-1)
    mys = moment('12-2006', 'MM-YYYY').utc(false).format('MM-YYYY')
    expect(component['monthYear'].format('MM-YYYY')).toEqual(mys)
    cDate = component['date']
    expect(cDate.value.format('MM-YYYY')).toEqual(mys)

    expect(spySendmonthYear).toHaveBeenCalledTimes(3)  //somehow service is getting rewritten before message is called
    expect(spyGetMonthYear).toHaveBeenCalledTimes(1)
  });

  it('should sendmonthYear', () => {
    component['sendmonthYear']()
    expect(spySendmonthYear).toHaveBeenCalledTimes(1)
  });

  it('should chosenYearHandler', () => {
    const year = 2018
    component['chosenYearHandler'](year)
    expect(component['monthYear'].year()).toEqual(year);
    expect(spySendmonthYear).toHaveBeenCalledTimes(1)
  });

  it('should chosenMonthHandler', () => {
    const month = 6

    component['chosenMonthHandler'](month)
    expect(component['monthYear'].month()).toEqual(month)
    expect(spySendmonthYear).toHaveBeenCalledTimes(1)
  });

  it('should displayDateChanged', () => {
    const mys = moment('11-2015', 'MM-YYYY').utc(false)
    component['displayDateChanged'](mys)
    expect(component['monthYear'].format('MM-YYYY')).toEqual(mys.format('MM-YYYY'))
    expect(spySendmonthYear).toHaveBeenCalledTimes(1)
  });

});
