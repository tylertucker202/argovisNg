import { TestBed } from '@angular/core/testing';

import { ArServiceService } from './ar-service.service';

describe('ArServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArServiceService = TestBed.get(ArServiceService);
    expect(service).toBeTruthy();
  });
});
