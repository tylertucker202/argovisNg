import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresSliderComponent } from './pres-slider.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
//import { MatInputModule } from '@angular/material';
import { QueryGridService } from './../../query-grid.service';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core'; //can view dom elements with this

describe('PresSliderComponent', () => {
  let component: PresSliderComponent;
  let fixture: ComponentFixture<PresSliderComponent>;
  let debugElement: DebugElement;
  let queryGridService: QueryGridService;
  let spysendPres: jasmine.Spy;
  let spyGetPresLevel: jasmine.Spy;
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
    debugElement = fixture.debugElement

    queryGridService = debugElement.injector.get(QueryGridService)
    const pres = 10
    spyGetPresLevel = spyOn(queryGridService, 'getPresLevel').and.returnValue(pres)
    spysendPres = spyOn(queryGridService, 'sendPres').and.callThrough()
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    const pres = 10;
    expect(component['presLevel']).toEqual(pres)
    expect(spysendPres).toHaveBeenCalledTimes(0)
    expect(spyGetPresLevel).toHaveBeenCalledTimes(1)
  });

  it('should resetToStart', () => {
    queryGridService.resetToStart.emit('test change')
    expect(spyGetPresLevel).toHaveBeenCalledTimes(2)
  });

  it('should incrementLevel', () => {
    const pres = 10;
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

  it('should sendPresLevel', () => {
    component['sendPresLevel']
    expect(spysendPres).toHaveBeenCalledTimes(0)
    expect(spyGetPresLevel).toHaveBeenCalledTimes(1)

    const pres = 200
    component['selChange'](pres)
    expect(spysendPres).toHaveBeenCalledTimes(1)
    expect(spyGetPresLevel).toHaveBeenCalledTimes(2)
  });

  it('should selChange', () => {

    const pres = 200
    component['selChange'](pres)
    expect(component['presLevel']).toEqual(pres)
    expect(spysendPres).toHaveBeenCalledTimes(1)
    expect(spyGetPresLevel).toHaveBeenCalledTimes(2)

  });
});
