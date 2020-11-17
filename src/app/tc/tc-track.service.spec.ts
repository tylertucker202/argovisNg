import { PopupCompileService } from './../home/services/popup-compile.service';
import { TcMapService } from './tc-map.service';
import { MapService } from './../home/services/map.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TcTrackService } from './tc-track.service';

describe('TcTrackService', () => {
  let service: TcTrackService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        MapService,
        TcMapService,
        PopupCompileService,
      ]
    });
    service = TestBed.inject(TcTrackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
