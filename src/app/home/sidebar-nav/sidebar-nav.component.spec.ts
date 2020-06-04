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

    queryService.setParamsFromURL()
    
    spyRT = spyOn(queryService, 'sendRealtimeMsg'); 
    spy3D = spyOn(queryService, 'sendThreeDayMsg'); 
    spyBGC = spyOn(queryService, 'sendBGCToggleMsg'); 
    spyDeep = spyOn(queryService, 'sendDeepToggleMsg'); 
    spyProj = spyOn(queryService, 'sendProj'); 
    spyPlatform = spyOn(queryService, 'triggerShowPlatform'); 
    spyDate = spyOn(queryService, 'sendGlobalDate')
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have set state according to urlBuild', () => {
     const RTToggle = queryService.getRealtimeToggle()
     const bgcToggle = queryService.getBGCToggle()
     const deepToggle = queryService.getDeepToggle()
     const proj = queryService.getProj()
     const threeDayToggle = queryService.getThreeDayToggle()
     const globalDisplayDate = queryService.getGlobalDisplayDate()

     queryService.urlBuild.emit('test')
     expect(component['proj']).toEqual(proj)
     expect(component['includeRT']).toEqual(RTToggle)
     expect(component['onlyBGC']).toEqual(bgcToggle)
     expect(component['onlyDeep']).toEqual(deepToggle)
     expect(component['threeDayToggle']).toEqual(threeDayToggle)
     const date = moment(component['date'].value).format('YYYY-MM-DD')
     expect(date).toEqual(globalDisplayDate)
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

