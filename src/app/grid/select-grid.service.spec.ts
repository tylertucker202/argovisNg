import { TestBed } from '@angular/core/testing';

import { SelectGridService } from './select-grid.service';

describe('SelectGridService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelectGridService = TestBed.get(SelectGridService);
    expect(service).toBeTruthy();
  });
});
