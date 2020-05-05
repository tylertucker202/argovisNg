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
fdescribe('ArDisplayComponent', () => {
  let component: ArDisplayComponent;
  let fixture: ComponentFixture<ArDisplayComponent>;
  let arQueryService: ArQueryService;
  let debugElement: DebugElement
  let spySendArDate: jasmine.Spy;
  let spySendArDateRange: jasmine.Spy;
  let spySetUrl: jasmine.Spy;
  let spySendThreeDayMsg: jasmine.Spy;
  let spyGetArShapes: jasmine.Spy;
  let spyGetArDate: jasmine.Spy;
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
    spySendArDate = spyOn(arQueryService, 'sendArDate').and.callThrough()
    spySendArDateRange = spyOn(arQueryService, 'sendArDateRange').and.callThrough()
    spySetUrl = spyOn(arQueryService, 'setURL').and.callThrough()
    spySendThreeDayMsg = spyOn(arQueryService, 'sendThreeDayMsg').and.callThrough()
    spyGetArShapes = spyOn(arQueryService, 'getArShapes').and.callThrough()
    spyGetArDate = spyOn(arQueryService, 'getArDate').and.callThrough()
    spyReset = spyOn(arQueryService, 'triggerResetToStart').and.callThrough()
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
    expect(component['arDate']).toEqual(arDateDefault)
    expect(component['hour']).toEqual(defaultHour)
  })

  it('should change date on increment day', () => {
    component['incrementDay'](1)
    expect(component['arDate']).toEqual(arDateDefault.add(1, 'd'))
    expect(spySendArDate).toHaveBeenCalledTimes(1)
    component['incrementDay'](-1)
    expect(component['arDate']).toEqual(arDateDefault.add(-1, 'd'))
    expect(spySendArDate).toHaveBeenCalledTimes(2)

    expect(component['arDate']).toEqual(arQueryService.getArDate())
  })

  it('should change date on drop down menu select', () => {
    expect(component['hour']).toEqual(0)
    expect(component['arDate']).toEqual(arDateDefault)
    component['timeChange'](21)
    expect(component['hour']).toEqual(21)
    expect(component['arDate']).toEqual(arDateDefault.add(21, 'h'))

    expect(component['arDate']).toEqual(arQueryService.getArDate())
  })

  it('should change date on date select, preserving hour', () => {
    const hour = 6
    component['incrementHour'](hour)
    const newDate = new Date(2016, 1, 4, 0, 0, 0, 0) //calendar date does not use hours 
    const date = moment(newDate).add(hour, 'h')
    component['calendarDateChanged'](newDate)
    expect(component['arDate']).toEqual(date)
    //check if the hour carried over
    expect(component['hour']).toEqual(hour)
    expect(component['arDate'].hour()).toEqual(hour)

    expect(component['arDate']).toEqual(arQueryService.getArDate())
  })

  it('should change date on increment hour', () => {
    component['incrementHour'](3)
    expect(component['arDate']).toEqual(arDateDefault.add(3, 'h'))
    expect(spySendArDate).toHaveBeenCalledTimes(1)
    component['incrementHour'](-3)
    expect(component['arDate']).toEqual(arDateDefault.add(-3, 'h'))
    expect(spySendArDate).toHaveBeenCalledTimes(2)


    expect(component['arDate']).toEqual(arQueryService.getArDate())
  })

  it('should reset to default on resetEvent', () => {
    const hour = 6
    component['incrementHour'](hour)
    const newDate = new Date(2016, 1, 4, 0, 0, 0, 0) //calendar date does not use hours
    component['calendarDateChanged'](newDate)
    arQueryService.triggerResetToStart()

    expect(component['arDate']).toEqual(arDateDefault)
    expect(component['hour']).toEqual(defaultHour)
  })

  it('should set mock ar shapes in query service', () => {
    console.log(spyGetArShapes)
    console.log(arQueryService.getArShapes())
    //expect(arQueryService.getArShapes().length).toEqual(0)
    //component['setArShape']([mockShapeSimple, mockShapeComplex])
    //expect(arQueryService.getArShapes().length).toEqual(2)
  })

  it('time should maintain local offset, ', () => {
    expect(component['arDate']).toEqual(arQueryService.getArDate())
  })
});
