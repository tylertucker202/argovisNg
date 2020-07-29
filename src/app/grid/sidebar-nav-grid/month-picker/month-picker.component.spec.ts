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
  let spyGetDate: jasmine.Spy;
  let spySendDate: jasmine.Spy;
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

    spySendDate = spyOn(queryGridService, 'sendDate').and.callThrough()
    spyGetDate = spyOn(queryGridService, 'getDate').and.callThrough()
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy()
    expect(component['date']).toBeTruthy()
    expect(component['dateForm']).toBeTruthy()
    expect(component['minDate']).toBeTruthy()
    expect(component['maxDate']).toBeTruthy()
    expect(component['paramMode']).toBeTruthy()

    expect(spyGetDate).toHaveBeenCalledTimes(1)
  });

  it('should set date', () => {
    const ddate = moment('01-01-2012', 'DD-MM-YYYY').utc(false)
    const date = new FormControl(ddate)
    expect(component['dateForm']).toEqual(date)
    const cDate = component['dateForm']
    expect(cDate.value.format('DD-MM-YYYY')).toEqual(ddate.format('DD-MM-YYYY'))
  });

  it('should incrementMonth', () => {

    component['incrementMonth'](1)

    let mys = moment('02-2012', 'DD-MM-YYYY').utc(false).format('DD-MM-YYYY')
    expect(component['date'].format('DD-MM-YYYY')).toEqual(mys)
    let cDate = component['dateForm']
    expect(cDate.value.format('DD-MM-YYYY')).toEqual(mys)

    component['incrementMonth'](-1)
    mys = moment('01-2012', 'DD-MM-YYYY').utc(false).format('DD-MM-YYYY')
    expect(component['date'].format('DD-MM-YYYY')).toEqual(mys)
    cDate = component['dateForm']
    expect(cDate.value.format('DD-MM-YYYY')).toEqual(mys)

    component['incrementMonth'](-1)
    mys = moment('12-2011', 'DD-MM-YYYY').utc(false).format('DD-MM-YYYY')
    expect(component['date'].format('DD-MM-YYYY')).toEqual(mys)
    cDate = component['dateForm']
    expect(cDate.value.format('DD-MM-YYYY')).toEqual(mys)

    expect(spySendDate).toHaveBeenCalledTimes(3)  //somehow service is getting rewritten before message is called
    expect(spyGetDate).toHaveBeenCalledTimes(1)
  });

  it('should sendDate', () => {
    component['sendDate']()
    expect(spySendDate).toHaveBeenCalledTimes(1)
  });

  it('should chosenYearHandler', () => {
    const year = 2018
    component['chosenYearHandler'](year)
    expect(component['date'].year()).toEqual(year);
    expect(spySendDate).toHaveBeenCalledTimes(1)
  });

  it('should chosenMonthHandler', () => {
    const month = 6

    component['chosenMonthHandler'](month)
    expect(component['date'].month()).toEqual(month)
    expect(spySendDate).toHaveBeenCalledTimes(1)
  });

  it('should displayDateChanged', () => {
    const mys = moment('01-11-2015', 'DD-MM-YYYY').utc(false)
    component['displayDateChanged'](mys)
    expect(component['date'].format('DD-MM-YYYY')).toEqual(mys.format('DD-MM-YYYY'))
    expect(spySendDate).toHaveBeenCalledTimes(1)
  });

});
