import { TestBed } from '@angular/core/testing';

import { TcMapService } from './tc-map.service';

describe('TcMapService', () => {
  let service: TcMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TcMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
