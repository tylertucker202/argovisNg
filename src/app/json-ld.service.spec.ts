import { TestBed } from '@angular/core/testing';

import { JsonLDService } from './json-ld.service';

describe('JsonLDService', () => {
  let service: JsonLDService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonLDService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
