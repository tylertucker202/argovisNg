import { TcQueryService } from './tc-query.service';
import { PopupCompileService } from './../home/services/popup-compile.service';
import { TcMapService } from './tc-map.service';
import { MapService } from './../home/services/map.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TcTrackService } from './tc-track.service';
describe('TcTrackService', () => {
  let service: TcTrackService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule ],
      providers: [
        MapService,
        TcMapService,
        TcQueryService,
        PopupCompileService,
      ]
    });
    service = TestBed.inject(TcTrackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
