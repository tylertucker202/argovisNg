import { TestBed } from '@angular/core/testing';

import { MapCovarService } from './map-covar.service';

describe('MapCovarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapCovarService = TestBed.get(MapCovarService);
    expect(service).toBeTruthy();
  });
});
