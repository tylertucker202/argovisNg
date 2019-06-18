import { TestBed } from '@angular/core/testing';

import { QueryGridService } from './query-grid.service';

describe('QueryGridService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QueryGridService = TestBed.get(QueryGridService);
    expect(service).toBeTruthy();
  });
});
