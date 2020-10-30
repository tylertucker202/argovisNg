import { TestBed } from '@angular/core/testing';

import { TcTrackService } from './tc-track.service';

describe('TcTrackService', () => {
  let service: TcTrackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TcTrackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
