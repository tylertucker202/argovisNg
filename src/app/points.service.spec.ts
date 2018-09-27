import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { PointsService } from './points.service';
import { MapService } from './map.service';
import { PopupCompileService } from './popup-compile.service';
import { ProfPopupComponent } from './prof-popup/prof-popup.component';


describe('PointsService', () => {
  beforeEach(() => {
    const spy = jasmine.createSpyObj('MapService', ['getValue']);
    TestBed.configureTestingModule({
      providers: [PointsService, HttpClient, { provide: MapService, useValue: spy }, PopupCompileService, ProfPopupComponent]
    });
  });

  it('should be created', inject([PointsService], (service: PointsService) => {
    expect(service).toBeTruthy();
  }));
});
