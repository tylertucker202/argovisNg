import { TestBed } from '@angular/core/testing';

import { TcQueryService } from './tc-query.service';

describe('TcQueryService', () => {
  let service: TcQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TcQueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
