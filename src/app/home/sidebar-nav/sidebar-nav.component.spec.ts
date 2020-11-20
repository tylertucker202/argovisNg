import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SidebarNavComponent } from './sidebar-nav.component';
import { DebugElement } from '@angular/core'; //can view dom elements with this
import { QueryService } from '../services/query.service';
import * as moment from 'moment';


import { MaterialModule } from '../../material/material.module';
import { MatMomentDateModule } from '@angular/material-moment-adapter'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';


describe('SidebarNavComponent', () => {
  let component: SidebarNavComponent;
  let fixture: ComponentFixture<SidebarNavComponent>;
  let debugElement: DebugElement;
  let queryService: QueryService;
  let spyRT: jasmine.Spy;
  let spy3D: jasmine.Spy;
  let spyBGC: jasmine.Spy;
  let spyDeep: jasmine.Spy;
  let spyPlatform: jasmine.Spy;
  let spyProj: jasmine.Spy;
  let spyDate: jasmine.Spy;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarNavComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [ QueryService ], 
      imports: [    MaterialModule,
                    RouterTestingModule,
                    BrowserAnimationsModule, 
                    MatMomentDateModule]
    }).compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(SidebarNavComponent);
    component = fixture.componentInstance;
    //component.ngOnInit()
    debugElement = fixture.debugElement;

    queryService = debugElement.injector.get(QueryService);

    queryService.set_params_from_url()
    
    spyRT = spyOn(queryService, 'send_realtime_msg'); 
    spy3D = spyOn(queryService, 'send_three_day_msg'); 
    spyBGC = spyOn(queryService, 'send_bgc_toggle_msg'); 
    spyDeep = spyOn(queryService, 'send_deep_toggle_msg'); 
    spyProj = spyOn(queryService, 'send_proj'); 
    spyPlatform = spyOn(queryService, 'trigger_show_platform'); 
    spyDate = spyOn(queryService, 'send_global_date')
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have set state according to urlBuild', () => {
     const RTToggle = queryService.get_realtime_toggle()
     const bgcToggle = queryService.get_bgc_toggle()
     const deepToggle = queryService.get_deep_toggle()
     const proj = queryService.get_proj()
     const threeDayToggle = queryService.get_three_day_toggle()
     const globalDisplayDate = queryService.get_global_display_date()

     queryService.urlBuild.emit('test')
     expect(component['proj']).toEqual(proj)
     expect(component['includeRT']).toEqual(RTToggle)
     expect(component['onlyBGC']).toEqual(bgcToggle)
     expect(component['onlyDeep']).toEqual(deepToggle)
     expect(component['threeDayToggle']).toEqual(threeDayToggle)
     const date = moment(component['date'].value).format('YYYY-MM-DD')
     expect(date).toEqual(globalDisplayDate.split('T')[0])
  })

  it('should set realtime toggle', () => {
    const checked = false
    component.realtimeChange(!checked)  
    expect(component['includeRT']).toBeTruthy()
    component.realtimeChange(checked)
    expect(component['includeRT']).toBeFalsy()
    expect(spyRT).toHaveBeenCalled()
    expect(spyRT).toHaveBeenCalledTimes(2);
  });

  it('should set three day toggle toggle', () => {
    const checked = false
    component.displayGlobalChange(!checked)
    expect(component['threeDayToggle']).toBeTruthy()
    component.displayGlobalChange(checked)
    expect(component['threeDayToggle']).toBeFalsy()
    expect(spy3D).toHaveBeenCalled()
    expect(spy3D).toHaveBeenCalledTimes(2);
  });

  it('should set bgc toggle', () => {
    const checked = true
    component.bgcChange(!checked)
    expect(component['onlyBGC']).toBeFalsy()
    component.bgcChange(checked)
    expect(component['onlyBGC']).toBeTruthy()
    expect(spyBGC).toHaveBeenCalled()
    expect(spyBGC).toHaveBeenCalledTimes(2);
  });

  it('should set deep toggle', () => {
    const checked = true
    component.deepChange(!checked)
    expect(component['onlyDeep']).toBeFalsy()
    component.deepChange(checked)
    expect(component['onlyDeep']).toBeTruthy()
    expect(spyDeep).toHaveBeenCalled()
    expect(spyDeep).toHaveBeenCalledTimes(2);
  });

  it('should set proj', () => {
    expect(component['proj']).toBeFalsy()
    const proj = 'WMtest'
    component.mapProjChange(proj)
    expect(component['proj']).toBeTruthy()
    expect(component['proj']).toEqual(proj)
    expect(spyProj).toHaveBeenCalled()
    expect(spyProj).toHaveBeenCalledTimes(1);
  });

  it('should set platform string', () => {
    expect(component['platformInput']).toBeFalsy()
    const platformInput = '12345'
    component.displayPlatformInputChanged(platformInput)
    expect(component['platformInput']).toBeTruthy()
    expect(component['platformInput']).toEqual(platformInput)
    expect(spyPlatform).toHaveBeenCalled()
    expect(spyPlatform).toHaveBeenCalledTimes(1);
  });

  it('should set date string', () => {
    const dateStr = '1900-01-01'
    const momentDate = moment(dateStr, 'YYYY-MM-DD').utc()
    let date = momentDate

    component.displayGlobalDateChanged(date)
    const outDate = component['date'];
    const outDateMoment = moment(outDate.value)
    expect(outDateMoment).toEqual(date)
  });

});

