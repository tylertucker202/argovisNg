import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MapService } from './../../home/services/map.service';
import { MapGridComponent } from './map-grid.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PopupCompileService } from './../../home/services/popup-compile.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QueryGridService } from './../query-grid.service';
import { GridMappingService } from './../grid-mapping.service';

import { DebugElement } from '@angular/core'; //can view dom elements with this

describe('MapGridComponent', () => {
  let component: MapGridComponent;
  let fixture: ComponentFixture<MapGridComponent>;
  let debugElement: DebugElement;
  let queryGridService: QueryGridService;
  let mapService: MapService;
  let gridMappingService: GridMappingService;
  let setParamsFromURL: jasmine.Spy;
  let updateGrids: jasmine.Spy;
  let setURL: jasmine.Spy;
  let clearShapes: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapGridComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [ MapService, PopupCompileService, QueryGridService, GridMappingService ],
      imports: [ RouterTestingModule, HttpClientTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapGridComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    queryGridService = debugElement.injector.get(QueryGridService)
    gridMappingService = debugElement.injector.get(GridMappingService)
    mapService = debugElement.injector.get(MapService)

    setParamsFromURL = spyOn(queryGridService, 'setParamsFromURL')
    updateGrids = spyOn(gridMappingService, 'updateGrids')
    setURL = spyOn(queryGridService, 'setURL')
    clearShapes = spyOn(queryGridService, 'clearShapes')

    fixture.detectChanges();
  });

  it('should create', () => {
    const proj = 'WM'
    expect(component).toBeTruthy();
    expect(setParamsFromURL).toHaveBeenCalledTimes(1)
    expect(component['proj']).toEqual(proj)
    expect(component['map']).toBeTruthy();

  });

  it('should change', () => {
    gridMappingService.gridLayers
    queryGridService.change.emit('test change')
    expect(updateGrids).toHaveBeenCalledTimes(1)
  });

  it('should clear layers', () => {
    queryGridService.clearLayers.emit('test change')
    expect(setURL).toHaveBeenCalledTimes(1)
    expect(clearShapes).toHaveBeenCalledTimes(1)
    expect(gridMappingService.gridLayers.getLayers().length).toEqual(0)
    expect(mapService.drawnItems.getLayers().length).toEqual(0)
  })

  it('should resetToStart', () => {
    queryGridService.resetToStart.emit('test change')
    expect(gridMappingService.gridLayers.getLayers().length).toEqual(0)
    expect(mapService.drawnItems.getLayers().length).toEqual(0)
  })
});
