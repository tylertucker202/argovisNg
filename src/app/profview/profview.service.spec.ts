import { TestBed } from '@angular/core/testing';

import { ProfviewService } from './profview.service';

describe('ProfviewService', () => {
  let service: ProfviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
