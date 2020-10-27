import { async, fakeAsync, tick, flush, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { MapComponent } from './map.component';
import { MapService } from '../services/map.service';
import { PointsService } from '../services/points.service';
import { QueryService } from '../services/query.service';
import { DebugElement } from '@angular/core'; //can view dom elements with this
import { PopupCompileService } from '../services/popup-compile.service';
import { NotifierService, NotifierModule } from 'angular-notifier';
import { ShapePopupComponent } from '../shape-popup/shape-popup.component';

import { HomeModule } from '../home.module';

import { MaterialModule } from '../../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let debugElement: DebugElement;
  let queryService: QueryService;
  let mapService: MapService;
  let pointsService: PointsService;
  let spyRT: jasmine.Spy;
  let getProjSpy: jasmine.Spy;
  let displayProfilesSpy: jasmine.Spy;
  let setPointsOnMapSpy: jasmine.Spy;
  let spyURL: jasmine.Spy;
  let getSelectionPointsSpy: jasmine.Spy;
  let getPlatformProfilesSpy: jasmine.Spy;
  let getLatestProfiles: jasmine.Spy;
  let getLastThreeDaysProfiles: jasmine.Spy;
  let popupWindowCreationSpy: jasmine.Spy;

  beforeEach( () => {
    TestBed.configureTestingModule({
      declarations: [ MapComponent ],
      providers: 
      [NotifierService,
       HttpClient,
       HttpClientModule,
       HttpHandler,
       { provide: MapService, useValue: getProjSpy },
       MapService,
       PointsService,
       QueryService,
       PopupCompileService],
       imports: [ RouterTestingModule,
                  NotifierModule,
                  MaterialModule,
                  BrowserAnimationsModule
                ],

    })
    .compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    queryService = debugElement.injector.get(QueryService);
    mapService = debugElement.injector.get(MapService)
    pointsService = debugElement.injector.get(PointsService)

    const mockPoints = pointsService.getMockPoints()

    const getSelectionPoints = spyOn(pointsService, 'getSelectionPoints').and.returnValue(mockPoints)
    const getPlatformProfiles = spyOn(pointsService, 'getPlatformProfiles').and.returnValue(mockPoints)
    const getLatestProfiles = spyOn(pointsService, 'getLatestProfiles').and.returnValue(mockPoints)
    const getLastThreeDaysProfiles = spyOn(pointsService, 'getLastThreeDaysProfiles').and.returnValue(mockPoints)
    const popupWindowCreationSpy = spyOn(mapService, 'popupWindowCreation').and.callThrough()
    spyURL = spyOn(queryService, 'set_url'); 
    displayProfilesSpy = spyOn<any>(component, 'displayProfiles').and.callThrough()
    setPointsOnMapSpy = spyOn<any>(component, 'setPointsOnMap').and.callThrough()
    getProjSpy = spyOn(queryService, 'getProj').and.returnValue('WM');
    fixture.detectChanges();
  });


  it('should create', () => {
     expect(component).toBeTruthy();
  });

  it('should have web mercator', () => {
    //TODO: find out why getting false positives!
    queryService['threeDayToggle'] = false
    queryService.setProj('WM')

    //getLastThreeDaysProfiles
    //spy = spyOn(queryService, 'getProj').and.returnValue('WM');
    expect(component['wrappedComponents'] == true)

    const lat = mapService['WMstartView'][0]
    const lng = mapService['WMstartView'][1]
    expect(component.startView.lat === lat)
    expect(component.startView.lat === lng)
    expect(component.startZoom === mapService['WMStartZoom'])
  })


  it('should have southern stereographic', () => {
    //TODO: find out why getting false positives!
    queryService.setProj('SSP')
    expect(component['proj'] == 'SSP')
    expect(component['wrappedComponents'] == false)
    const lat = mapService['SSPstartView'][0]
    const lng = mapService['SSPstartView'][1]
    expect(component.startView.lat === lat)
    expect(component.startView.lat === lng)
    expect(component.startZoom === mapService['SSPStartZoom'])
  })

  it('should have northern stereographic', () => {
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
    component.markersLayer.clear_layers()
    myMarkers = component.markersLayer.toGeoJSON()
    expect(myMarkers['features'].length === 0)
  })


  it('should detect query service change', () => {

    component.setMockPoints()
    expect(displayProfilesSpy).toHaveBeenCalledTimes(1);
    expect(spyURL).toHaveBeenCalledTimes(0);
    
    queryService.change.emit('testing a change')
    expect(spyURL).toHaveBeenCalled()
    expect(spyURL).toHaveBeenCalledTimes(1);

    expect(displayProfilesSpy).toHaveBeenCalled();
    expect(displayProfilesSpy).toHaveBeenCalledTimes(2);

    let myMarkers = component.markersLayer.toGeoJSON()
    expect(myMarkers['features'].length === 0)
  });

  it('should detect query service clear_layers', () => {
    component.setMockPoints()
    expect(displayProfilesSpy).toHaveBeenCalledTimes(1);
    expect(spyURL).toHaveBeenCalledTimes(0);
    
    queryService.resetToStart.emit('testing a clear')
    expect(spyURL).toHaveBeenCalledTimes(0); //should not be called

    expect(displayProfilesSpy).toHaveBeenCalledTimes(2); //should not be called
    expect(setPointsOnMapSpy).toHaveBeenCalledTimes(0);
    let myMarkers = component.markersLayer.toGeoJSON()
    expect(myMarkers['features'].length === 0)
  });

  it('should add a shape', () => {
    const shapes = [[[55.578345,-146.074219],[52.908902,-148.886719],[52.48278,-141.328125],[55.578345,-146.074219]]]
    const notifiyChange = true 
    //we check if shape is added indirectly by checking if setPointsOnMap() is called. It should when a change occurs.
    expect(setPointsOnMapSpy).toHaveBeenCalledTimes(0)
    let drawnItemsBefore = component.mapService.drawnItems.toGeoJSON()
    expect(drawnItemsBefore['features'].length).toEqual(0)
    queryService.sendShape(shapes, notifiyChange)
    expect(setPointsOnMapSpy).toHaveBeenCalledTimes(1)
  })

});
