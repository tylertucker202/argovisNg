import { TestBed, inject } from '@angular/core/testing';

import { MapProjectionService } from './map-projection.service';

describe('MapProjectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapProjectionService]
    });
  });

  it('should be created', inject([MapProjectionService], (service: MapProjectionService) => {
    expect(service).toBeTruthy();
  }));
});
