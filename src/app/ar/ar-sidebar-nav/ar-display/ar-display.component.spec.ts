import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArDisplayComponent } from './ar-display.component';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ArShapeService } from '../../ar-shape.service'
import { MapService } from '../../../home/services/map.service'
import { MaterialModule } from '../../../material/material.module'
import { MatDialogRef } from '@angular/material/dialog';
import { ArQueryService } from './../../ar-query.service';
import { RouterTestingModule } from '@angular/router/testing';
import { PopupCompileService } from '../../../home/services/popup-compile.service';
import { NotifierService, NotifierModule } from 'angular-notifier';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { mockShapeComplex, mockShapeSimple } from './../../ar-shape.parameters'
import * as moment from 'moment'
describe('ArDisplayComponent', () => {
  let component: ArDisplayComponent;
  let fixture: ComponentFixture<ArDisplayComponent>;
  let arQueryService: ArQueryService;
  let debugElement: DebugElement
  let spysend_ar_date: jasmine.Spy;
  let spysend_ar_date_range: jasmine.Spy;
  let spyset_url: jasmine.Spy;
  let spySendThreeDayMsg: jasmine.Spy;
  let spyget_ar_shapes: jasmine.Spy;
  let spyget_ar_date: jasmine.Spy;
  let spyReset: jasmine.Spy
  let defaultHour: number
  let arDateDefault: moment.Moment

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ArDisplayComponent ],
      imports: [ MaterialModule, RouterTestingModule, NotifierModule, HttpClientTestingModule, BrowserAnimationsModule ],
      providers: [ {provide : MatDialogRef, useValue : {}},
         PopupCompileService,
         ArShapeService, 
         ArQueryService, 
         MapService,
         NotifierService
         ], 
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    fixture = TestBed.createComponent(ArDisplayComponent);
    debugElement = fixture.debugElement

    arQueryService = debugElement.injector.get(ArQueryService)  
    spysend_ar_date = spyOn(arQueryService, 'send_ar_date').and.callThrough()
    spysend_ar_date_range = spyOn(arQueryService, 'send_ar_date_range').and.callThrough()
    spyset_url = spyOn(arQueryService, 'set_url').and.callThrough()
    spySendThreeDayMsg = spyOn(arQueryService, 'sendThreeDayMsg').and.callThrough()
    spyget_ar_shapes = spyOn(arQueryService, 'get_ar_shapes').and.callThrough()
    spyget_ar_date = spyOn(arQueryService, 'get_ar_date').and.callThrough()
    spyReset = spyOn(arQueryService, 'trigger_reset_to_start').and.callThrough()
    arDateDefault = moment(new Date( 2010, 0, 1, 0, 0, 0, 0))
    defaultHour = arDateDefault.hour()
    
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ArDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set default parameters', () => {
    expect(component['date']).toEqual(arDateDefault)
    expect(component['hour']).toEqual(defaultHour)
  })

  it('should change date on increment day', () => {
    component['incrementDay'](1)
    expect(component['date']).toEqual(arDateDefault.add(1, 'd'))
    expect(spysend_ar_date).toHaveBeenCalledTimes(1)
    component['incrementDay'](-1)
    expect(component['date']).toEqual(arDateDefault.add(-1, 'd'))
    expect(spysend_ar_date).toHaveBeenCalledTimes(2)

    expect(component['date']).toEqual(arQueryService.get_ar_date())
  })

  it('should change date on drop down menu select', () => {
    expect(component['hour']).toEqual(0)
    expect(component['date']).toEqual(arDateDefault)
    component['timeChange'](21)
    expect(component['hour']).toEqual(21)
    expect(component['date']).toEqual(arDateDefault.add(21, 'h'))

    expect(component['date']).toEqual(arQueryService.get_ar_date())
  })

  it('should change date on date select, preserving hour', () => {
    const hour = 6
    component['incrementHour'](hour)
    const newDate = new Date(2016, 1, 4, 0, 0, 0, 0) //calendar date does not use hours 
    const date = moment(newDate).add(hour, 'h')
    component['calendarDateChanged'](newDate)
    expect(component['date']).toEqual(date)
    //check if the hour carried over
    expect(component['hour']).toEqual(hour)
    expect(component['date'].hour()).toEqual(hour)

    expect(component['date']).toEqual(arQueryService.get_ar_date())
  })

  it('should change date on increment hour', () => {
    component['incrementHour'](3)
    expect(component['date']).toEqual(arDateDefault.add(3, 'h'))
    expect(spysend_ar_date).toHaveBeenCalledTimes(1)
    component['incrementHour'](-3)
    expect(component['date']).toEqual(arDateDefault.add(-3, 'h'))
    expect(spysend_ar_date).toHaveBeenCalledTimes(2)


    expect(component['date']).toEqual(arQueryService.get_ar_date())
  })

  it('should reset to default on resetEvent', () => {
    const hour = 6
    component['incrementHour'](hour)
    const newDate = new Date(2016, 1, 4, 0, 0, 0, 0) //calendar date does not use hours
    component['calendarDateChanged'](newDate)
    arQueryService.trigger_reset_to_start()

    expect(component['date']).toEqual(arDateDefault)
    expect(component['hour']).toEqual(defaultHour)
  })

  it('should set mock ar shapes in query service', () => {
    console.log(spyget_ar_shapes)
    console.log(arQueryService.get_ar_shapes())
    //expect(arQueryService.get_ar_shapes().length).toEqual(0)
    //component['set_ar_shape']([mockShapeSimple, mockShapeComplex])
    //expect(arQueryService.get_ar_shapes().length).toEqual(2)
  })

  it('time should maintain local offset, ', () => {
    expect(component['date']).toEqual(arQueryService.get_ar_date())
  })
});
