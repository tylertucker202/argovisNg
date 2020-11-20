import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GridMeta } from '../../../../typeings/grids'
import { PresSelComponent } from './pres-sel.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
//import { MatInputModule } from '@angular/material';
import { QueryGridService } from '../../query-grid.service';
import { DebugElement } from '@angular/core'; //can view dom elements with this
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse, HttpClientModule, HttpHandler } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { SelectGridService } from '../../select-grid.service';
import { Observable, of } from 'rxjs'

describe('PresSelComponent', () => {
  let component: PresSelComponent;
  let fixture: ComponentFixture<PresSelComponent>;
  let debugElement: DebugElement;
  let queryGridService: QueryGridService;
  let selectGridService: SelectGridService
  let spysend_pres: jasmine.Spy;
  let spyGetPresLevel: jasmine.Spy;
  let spyGetGridMeta: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresSelComponent ], 
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        QueryGridService, 
        HttpClientTestingModule, 
        HttpTestingController, 
        HttpClient, 
        HttpClientModule, 
        HttpHandler, ],
      imports: [ RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresSelComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement

    queryGridService = debugElement.injector.get(QueryGridService)
    selectGridService = debugElement.injector.get(SelectGridService)

    const pres = 10
    const dummyGridMeta: Observable<GridMeta[]> = of([{_id: 'dummyGrid', presLevels: [5, 10, 200], minDate: "min date", maxDate: "max date", dates: ["test date 1"]}])
    spyGetGridMeta = spyOn(selectGridService, 'getGridMeta').and.returnValue(dummyGridMeta)
    spyGetPresLevel = spyOn(queryGridService, 'getPresLevel').and.returnValue(pres)
    spysend_pres = spyOn(queryGridService, 'send_pres').and.callThrough()
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    const pres = 10;
    expect(component['presLevel']).toEqual(pres)
    expect(spysend_pres).toHaveBeenCalledTimes(0)
    expect(spyGetPresLevel).toHaveBeenCalledTimes(1)
  });

  it('should resetToStart', () => {
    queryGridService.resetToStart.emit('test change')
    expect(spyGetPresLevel).toHaveBeenCalledTimes(2)
  });

  it('should incrementLevel', () => {
    const pres = 10
    component['presLevels'] = [5, 10, 200]
    component['makePressureLevels']()
    expect(component['presLevel']).toEqual(pres)
    let inc = 1
    component['incrementLevel'](inc)
    expect(component['presLevel']).toEqual(200)
    inc = -1
    component['incrementLevel'](inc)
    expect(component['presLevel']).toEqual(pres)
    inc = -1
    component['incrementLevel'](inc)
    expect(component['presLevel']).toEqual(5)

  });

  it('should send_presLevel', () => {
    component['send_presLevel']
    expect(spysend_pres).toHaveBeenCalledTimes(0)
    expect(spyGetPresLevel).toHaveBeenCalledTimes(1)

    const pres = 200
    component['selChange'](pres)
    expect(spysend_pres).toHaveBeenCalledTimes(1)
    expect(spyGetPresLevel).toHaveBeenCalledTimes(2)
  });

  it('should selChange', () => {

    const pres = 200
    component['selChange'](pres)
    expect(component['presLevel']).toEqual(pres)
    expect(spysend_pres).toHaveBeenCalledTimes(1)
    expect(spyGetPresLevel).toHaveBeenCalledTimes(2)

  });
});
