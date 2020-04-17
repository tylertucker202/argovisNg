import { TestBed } from '@angular/core/testing';

import { ArQueryService } from './ar-query.service';

describe('ArQueryService', () => {
  let service: ArQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArQueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
