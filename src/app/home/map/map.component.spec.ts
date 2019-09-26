import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { MapComponent } from './map.component';
import { MapService } from '../services/map.service';
import { PointsService } from '../services/points.service';
import { QueryService } from '../services/query.service';
import { DebugElement } from '@angular/core'; //can view dom elements with this
import { PopupCompileService } from '../services/popup-compile.service';
import { NotifierService, NotifierModule } from 'angular-notifier';


import { MaterialModule } from '../../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

fdescribe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let debugElement: DebugElement;
  let queryService: QueryService;
  let mapService: MapService;
  let spyRT: jasmine.Spy;
  let spy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ MapComponent ],
      providers: 
      [NotifierService,
       HttpClient,
       HttpClientModule,
       HttpHandler,
       //{ provide: MapService, useValue: spy },
       MapService,
       PointsService,
       QueryService,
       PopupCompileService],
       imports: [RouterTestingModule, NotifierModule],

    })
    .compileComponents();

    const spy = jasmine.createSpyObj('MapService', ['init']);
    const notifierSpy = jasmine.createSpyObj('NotifierService', ['getValue'])

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    queryService = debugElement.injector.get(QueryService);
    mapService = debugElement.injector.get(MapService)

    fixture.detectChanges();
    queryService.setParamsFromURL()
  });


  it('should create', () => {
     expect(component).toBeTruthy();
  });

  it('should have web mercator', () => {
    queryService.setProj('WM')
    spy = spyOn(queryService, 'getProj').and.returnValue('WM');
    expect(component['proj'] == 'WM')
    expect(component['wrappedComponents'] == true)

    const lat = mapService['WMstartView'][0]
    const lng = mapService['WMstartView'][1]
    expect(component.startView.lat === lat)
    expect(component.startView.lat === lng)
    expect(component.startZoom === mapService['WMStartZoom'])
  })

  it('should have southern stereographic', () => {
    queryService.setProj('SSP')
    expect(component['proj'] == 'SSP')
    expect(component['wrappedComponents'] == false)
    const lat = mapService['SSPstartView'][0]
    const lng = mapService['SSPstartView'][1]
    expect(component.startView.lat === lat)
    expect(component.startView.lat === lng)
    expect(component.startZoom === mapService['SSPStartZoom'])
  })

  it('should have norther stereographic', () => {
    queryService.setProj('NSP')
    expect(component['proj'] == 'NSP')
    expect(component['wrappedComponents'] == false)
    const lat = mapService['NSPstartView'][0]
    const lng = mapService['NSPstartView'][1]
    expect(component.startView.lat === lat)
    expect(component.startView.lat === lng)
    expect(component.startZoom === mapService['NSPStartZoom'])
  })

  it('should have Default set', () => {
    queryService.setProj('made up')
    expect(component['proj'] == 'WM')
    expect(component['wrappedComponents'] == true)
    const lat = mapService['WMstartView'][0]
    const lng = mapService['WMstartView'][1]
    expect(component.startView.lat === lat)
    expect(component.startView.lat === lng)
    expect(component.startZoom === mapService['WMStartZoom'])
  })

  it('should add and remove mock points', () => {
    component.setMockPoints()
    let myMarkers = component.markersLayer.toGeoJSON()
    expect(myMarkers['features'].length > 0)
    component.markersLayer.clearLayers()
    myMarkers = component.markersLayer.toGeoJSON()
    expect(myMarkers['features'].length === 0)
  })


  it('should detect query service change', () => {
    const spyURL = spyOn(queryService, 'setURL'); 
    const ssomSpy = spyOn<any>(component, 'shapeSelectionOnMap')

    component.setMockPoints()
    expect(ssomSpy).toHaveBeenCalledTimes(0);
    expect(spyURL).toHaveBeenCalledTimes(0);
    
    queryService.change.emit('testing a change')
    expect(spyURL).toHaveBeenCalled()
    expect(spyURL).toHaveBeenCalledTimes(1);

    expect(ssomSpy).toHaveBeenCalled();
    expect(ssomSpy).toHaveBeenCalledTimes(1);

    let myMarkers = component.markersLayer.toGeoJSON()
    expect(myMarkers['features'].length === 0)
  });

  it('should detect query service clearLayers', () => {
    const spyURL = spyOn(queryService, 'setURL'); 
    const ssomSpy = spyOn<any>(component, 'shapeSelectionOnMap')

    component.setMockPoints()
    expect(ssomSpy).toHaveBeenCalledTimes(0);
    expect(spyURL).toHaveBeenCalledTimes(0);
    
    queryService.clearLayers.emit('testing a clear')
    expect(spyURL).toHaveBeenCalled()
    expect(spyURL).toHaveBeenCalledTimes(1);

    expect(ssomSpy).toHaveBeenCalledTimes(0); //should not be called

    let myMarkers = component.markersLayer.toGeoJSON()
    expect(myMarkers['features'].length === 0)
  });

  it('should detect query service clearLayers', () => {
    const spyURL = spyOn(queryService, 'setURL'); 
    const ssomSpy = spyOn<any>(component, 'shapeSelectionOnMap')
    const sspSpy = spyOn<any>(component, 'setStartingProfiles')

    component.setMockPoints()
    expect(ssomSpy).toHaveBeenCalledTimes(0);
    expect(spyURL).toHaveBeenCalledTimes(0);
    
    queryService.resetToStart.emit('testing a clear')
    expect(spyURL).toHaveBeenCalledTimes(0); //should not be called

    expect(ssomSpy).toHaveBeenCalledTimes(0); //should not be called
    expect(sspSpy).toHaveBeenCalled()
    expect(sspSpy).toHaveBeenCalledTimes(1);
    let myMarkers = component.markersLayer.toGeoJSON()
    expect(myMarkers['features'].length === 0)
  });

  // it('should set ', () => {
  // });

  // it('should detect clear event', () => {
  // });

  // it('should detect reset event', () => {
  // });

  // it('should detect clear event', () => {
  // });

  // it('should detect clear event', () => {
  // });

  // it('should detect clear event', () => {
  // });

});
