
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ArSidebarNavComponent } from './ar-sidebar-nav.component';
import { DebugElement } from '@angular/core'; //can view dom elements with this
import { ArQueryService } from '../ar-query.service';
import { QueryService } from '../../home/services/query.service'
import * as moment from 'moment';


import { MaterialModule } from '../../material/material.module';
import { MatMomentDateModule } from '@angular/material-moment-adapter'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';


describe('ArSidebarNavComponent', () => {
  let component: ArSidebarNavComponent;
  let fixture: ComponentFixture<ArSidebarNavComponent>;
  let debugElement: DebugElement;
  let arQueryService: ArQueryService;
  let spyRT: jasmine.Spy;
  let spyDisplayGlobally: jasmine.Spy;
  let spyBGC: jasmine.Spy;
  let spyDeep: jasmine.Spy;
  let spyPlatform: jasmine.Spy;
  let spyProj: jasmine.Spy;
  let spyDate: jasmine.Spy;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ArSidebarNavComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [ ArQueryService, QueryService ], 
      imports: [    MaterialModule,
                    RouterTestingModule,
                    BrowserAnimationsModule, 
                    MatMomentDateModule]
    }).compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(ArSidebarNavComponent);
    component = fixture.componentInstance;
    //component.ngOnInit()
    debugElement = fixture.debugElement;

    arQueryService = debugElement.injector.get(ArQueryService);

    arQueryService.set_params_from_url()
    
    spyRT = spyOn(arQueryService, 'sendRealtimeMsg'); 
    spyDisplayGlobally = spyOn(arQueryService, 'send_display_globally'); 
    spyBGC = spyOn(arQueryService, 'sendBGCToggleMsg'); 
    spyDeep = spyOn(arQueryService, 'sendDeepToggleMsg'); 
    spyProj = spyOn(arQueryService, 'sendProj'); 
    spyPlatform = spyOn(arQueryService, 'triggerShowPlatform'); 
    spyDate = spyOn(arQueryService, 'sendGlobalDate')
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have set state according to urlBuild', () => {
     const RTToggle = arQueryService.get_realtime_toggle()
     const bgcToggle = arQueryService.get_bgc_toggle()
     const deepToggle = arQueryService.get_deep_toggle()
     const proj = arQueryService.getProj()
     const displayGlobally = arQueryService.get_display_globally()

     arQueryService.urlBuild.emit('test')
     expect(component['includeRT']).toEqual(RTToggle)
     expect(component['onlyBGC']).toEqual(bgcToggle)
     expect(component['onlyDeep']).toEqual(deepToggle)
     expect(component['displayGlobally']).toEqual(displayGlobally)
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

  it('should set global toggle', () => {
    const checked = false
    component.displayGlobalChange(!checked)
    expect(component['displayGlobally']).toBeTruthy()
    component.displayGlobalChange(checked)
    expect(component['displayGlobally']).toBeFalsy()
    expect(spyDisplayGlobally).toHaveBeenCalled()
    expect(spyDisplayGlobally).toHaveBeenCalledTimes(2);
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


})