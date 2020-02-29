import { TestBed } from '@angular/core/testing';
import { QueryGridService } from './query-grid.service';
import { MapService } from './../home/services/map.service'
import { RasterService } from './raster.service'
import { GridMappingService } from './grid-mapping.service';
import { PopupCompileService } from './../home/services/popup-compile.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NotifierService, NotifierModule } from 'angular-notifier';

describe('GridMappingService', () => {
  beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [ QueryGridService, RasterService, MapService, PopupCompileService, NotifierService ],
    imports: [ RouterTestingModule, HttpClientTestingModule, NotifierModule ],
  })
});

  it('should be created', () => {
    const service: GridMappingService = TestBed.get(GridMappingService);
    expect(service).toBeTruthy();
  });
});
