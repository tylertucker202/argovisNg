import { TestBed } from '@angular/core/testing';

import { QueryFieldsService } from './query-fields.service';

describe('QueryFieldsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QueryFieldsService = TestBed.get(QueryFieldsService);
    expect(service).toBeTruthy();
  });
});
