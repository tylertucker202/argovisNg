import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarNavGridComponent } from './sidebar-nav-grid.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core'; //can view dom elements with this
import { QueryGridService } from './../query-grid.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SidebarNavGridComponent', () => {
  let component: SidebarNavGridComponent;
  let fixture: ComponentFixture<SidebarNavGridComponent>;
  let debugElement: DebugElement;
  let queryGridService: QueryGridService;
  let spyGetParamMode: jasmine.Spy;
  let spySendParamMode: jasmine.Spy;
  let spySendParam: jasmine.Spy;
  let spyGetInterpolateBool: jasmine.Spy;
  let spySendInterpolateBool: jasmine.Spy;
  let spyTriggerClearLayers: jasmine.Spy;
  let spyTriggerResetToStart: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarNavGridComponent ],
      providers: [ QueryGridService ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      imports: [ RouterTestingModule, HttpClientTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarNavGridComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement

    queryGridService = debugElement.injector.get(QueryGridService)

    spyGetParamMode = spyOn(queryGridService, 'getParamMode').and.callThrough()
    spyGetInterpolateBool = spyOn(queryGridService, 'getInterplateBool').and.callThrough()
    spySendParamMode = spyOn(queryGridService, 'sendParamMode').and.callThrough()
    spySendParam = spyOn(queryGridService, 'sendProperty').and.callThrough()
    spySendInterpolateBool = spyOn(queryGridService, 'sendInterpolateBool').and.callThrough()
    spyTriggerClearLayers = spyOn( queryGridService, 'triggerClearLayers').and.callThrough()
    spyTriggerResetToStart = spyOn( queryGridService, 'triggerResetToStart').and.callThrough()
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(spyGetParamMode).toHaveBeenCalled()
  })

  it('should detect urlBuild', () => {
    queryGridService.urlRead.emit('test change')
    expect(spyGetParamMode).toHaveBeenCalledTimes(2)
  })

  it('should detect change', () => {
    queryGridService.change.emit('test change')
    expect(spyGetParamMode).toHaveBeenCalledTimes(2)
  })

  it('should clearGrids', () => {
    component['clearGrids']()
    expect(spyTriggerClearLayers).toHaveBeenCalledTimes(1)
  })

  it('should resetToStart', () => {
    component['resetToStart']()
    expect(spyTriggerResetToStart).toHaveBeenCalledTimes(1)

  })

  it('should interpolateBoolToggle', () => {
    const interpolateBool = true
    component['interpolateBoolToggle'](interpolateBool)
    expect(spySendInterpolateBool).toHaveBeenCalledTimes(1)
  })

  it('should paramModeToggle', () => {
    let paramMode = false
    component['paramModeToggle'](paramMode)
    expect(spySendParamMode).toHaveBeenCalledTimes(1)

    paramMode = true
    component['paramModeToggle'](paramMode)
    expect(spySendParam).toHaveBeenCalledTimes(1)
    expect(spySendParamMode).toHaveBeenCalledTimes(2)
  })

});
