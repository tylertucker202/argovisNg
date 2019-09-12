import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SelectionDatePicker } from './selectiondatepicker.component';
import { DebugElement } from '@angular/core'; //can view dom elements with this
import { QueryService } from '../../services/query.service';
import { Daterangepicker } from 'ng2-daterangepicker';

import * as moment from 'moment';

import { By } from '@angular/platform-browser';

import { MaterialModule } from '../../../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('SelectionDatePicker', () => {
  let component: SelectionDatePicker;
  let fixture: ComponentFixture<SelectionDatePicker>;
  let debugElement: DebugElement;
  let queryService: QueryService;
  let spySend: jasmine.Spy;
  let spyGet: jasmine.Spy;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionDatePicker ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [ QueryService ], 
      imports: [    MaterialModule,
                    RouterTestingModule,
                    BrowserAnimationsModule, Daterangepicker
                   ]
    }).compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(SelectionDatePicker);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    queryService = debugElement.injector.get(QueryService);

    queryService.setParamsFromURL()
    
    spySend = spyOn(queryService, 'sendSelectedDateMessage');

    const start = moment('1900-01-01').format('YYYY-MM-DD')
    const end = moment('1900-02-01').format('YYYY-MM-DD')

    var dr = {start: start, end: end, label: ''}

    spyGet = spyOn(queryService, 'getSelectionDates').and.returnValue(dr)

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set dates from query service', () => {
      const start = moment('1900-01-01')
      const end = moment('1900-02-01')
      expect(component['start']).toEqual(start)
      expect(component['end']).toEqual(end)
  });

  it('should get dates once', () => {
    expect(spyGet).toHaveBeenCalledTimes(1)
  });


});

