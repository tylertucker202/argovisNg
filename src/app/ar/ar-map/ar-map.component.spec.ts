import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifierService, NotifierModule } from 'angular-notifier'
import { ArMapComponent } from './ar-map.component';
import { ArQueryService } from '../ar-query.service'
import { ArShapeService } from '../ar-shape.service'
import { ArMapService } from '../ar-map.service'
import { mockShapeComplex, mockShapeSimple} from '../ar-shape.parameters'
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { PopupCompileService } from '../../home/services/popup-compile.service';
import { QueryService } from '../../home/services/query.service'
import { MapService } from '../../home/services/map.service'
import { PointsService } from '../../home/services/points.service'
import { MaterialModule } from '../../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core'; //can view dom elements with this
import { Observable, of } from 'rxjs';
import { ProtractorExpectedConditions } from 'protractor';

describe('ArMapComponent', () => {
  let component: ArMapComponent;
  let fixture: ComponentFixture<ArMapComponent>;
  let debugElement: DebugElement;
  let arQueryService: ArQueryService;
  let arShapeService: ArShapeService;
  let arMapService: ArMapService;
  let set_points_on_mapSpy: jasmine.Spy;
  let set_ar_shapeSpy: jasmine.Spy;
  let get_ar_shapespy: jasmine.Spy;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArMapComponent ],
      providers: [ 
          HttpClient,
          HttpClientModule,
          HttpHandler,
          ArMapService, 
          ArQueryService, 
          ArShapeService, 
          MapService, 
          QueryService, 
          PopupCompileService, 
          PointsService ],
      imports: [NotifierModule, RouterTestingModule, BrowserAnimationsModule, MaterialModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement;

    arQueryService = debugElement.injector.get(ArQueryService);
    arShapeService = debugElement.injector.get(ArShapeService);
    arMapService = debugElement.injector.get(ArMapService);
    set_points_on_mapSpy = spyOn<any>(component, 'set_points_on_map').and.callThrough()
    set_ar_shapeSpy = spyOn<any>(component, 'set_ar_shape').and.callThrough()
    get_ar_shapespy = spyOn(arShapeService, 'get_ar_shapes').and.returnValue(of([mockShapeSimple, mockShapeComplex]))
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should acknoledge a change event', () => {
    expect(set_points_on_mapSpy).toHaveBeenCalledTimes(0)
    arQueryService.change.emit('test')
    expect(set_points_on_mapSpy).toHaveBeenCalledTimes(1)    
  })

  it('should have web mercator', () => {
    expect(component['proj'] == 'WM')
  })

  it('should acknoledge a clear layers event emit', () => {
    arQueryService.arEvent.emit('test')
    arQueryService.clear_layers.emit('test')
    const drawnItems = component['arMapService'].arShapeItems.toGeoJSON()
    expect(drawnItems['features'].length).toEqual(0)
  })

  it('should acknoledge a reset to start event emit', () => {
    arQueryService.arEvent.emit('test') //create an ar shape
    arQueryService.resetToStart.emit('test') // state is reset and then an ar shapes are cleared
    expect(set_ar_shapeSpy).toHaveBeenCalledTimes(1)
    const drawnItems = component['arMapService'].arShapeItems.toGeoJSON() //check if ar shapes have been cleared
    console.log('drawn items:', drawnItems)
    expect(drawnItems['features'].length).toEqual(0)
  })
  
  it('should get ar shapes on arEvent emit', () => {
    expect(set_ar_shapeSpy).toHaveBeenCalledTimes(0)
    arQueryService.arEvent.emit('test')
    expect(set_ar_shapeSpy).toHaveBeenCalledTimes(1)
    const drawnItems = component['arMapService'].arShapeItems.toGeoJSON()
    console.log('drawn items:', drawnItems)
    expect(drawnItems['features'].length).toEqual(2)
  })

  it('should convert between ar to shape array properly', () => {
    const shapeArray = component['convertArShapesToshapeArraysAndIds']([mockShapeSimple, mockShapeComplex])
    expect(shapeArray.length).toEqual(2)
    expect(shapeArray[1][0]).toEqual(mockShapeSimple._id)
    expect(shapeArray[1][1]).toEqual(mockShapeComplex._id)
    // coords flip from long lat to lat long.
    const lat = shapeArray[0][1][0][0]
    const lon = shapeArray[0][1][0][1]
    expect(lat).toEqual(mockShapeComplex.geoLocation.coordinates[0][1])
    expect(lon).toEqual(mockShapeComplex.geoLocation.coordinates[0][0])
  })

});
