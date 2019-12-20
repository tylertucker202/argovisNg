import { TestBed } from '@angular/core/testing';

import { GridMappingService } from './grid-mapping.service';

describe('GridMappingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GridMappingService = TestBed.get(GridMappingService);
    expect(service).toBeTruthy();
  });
});
