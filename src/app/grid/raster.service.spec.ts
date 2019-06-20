import { TestBed } from '@angular/core/testing';

import { RasterService } from './raster.service';

describe('RasterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RasterService = TestBed.get(RasterService);
    expect(service).toBeTruthy();
  });
});
