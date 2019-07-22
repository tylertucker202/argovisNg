import { TestBed } from '@angular/core/testing';

import { CovarService } from './covar.service';

describe('CovarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CovarService = TestBed.get(CovarService);
    expect(service).toBeTruthy();
  });
});
