import { TestBed } from '@angular/core/testing';

import { ArMapService } from './ar-map.service';

describe('ArMapService', () => {
  let service: ArMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
