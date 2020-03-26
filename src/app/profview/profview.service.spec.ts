import { TestBed } from '@angular/core/testing';

import { QueryProfviewService } from './query-profview.service';

describe('QueryProfviewService', () => {
  let service: QueryProfviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QueryProfviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
