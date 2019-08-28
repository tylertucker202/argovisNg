import { TestBed } from '@angular/core/testing';

import { QueryGridService } from './query-grid.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('QueryGridService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ QueryGridService ],
      imports: [ RouterTestingModule ]
    });
  });

  it('should be created', () => {
    const service: QueryGridService = TestBed.get(QueryGridService);
    expect(service).toBeTruthy();
  });
});
