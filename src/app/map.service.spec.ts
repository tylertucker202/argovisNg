import { TestBed, inject } from '@angular/core/testing';
import * as L from 'leaflet';
import { MapService } from './map.service';
import { ShapePopupComponent } from './shape-popup/shape-popup.component';
import { PopupCompileService } from './popup-compile.service';

describe('MapService', () => {
  const spy = jasmine.createSpyObj('MapService', ['getValue']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: MapService, useValue: spy }, ShapePopupComponent, PopupCompileService]
    });
  });

  it('should be created', inject([MapService], (service: MapService) => {
    expect(service).toBeTruthy();
  }));
});
