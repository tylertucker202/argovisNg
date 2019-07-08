import { TestBed } from '@angular/core/testing';

import { TopToolbarService } from './top-toolbar.service';

describe('TopToolbarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TopToolbarService = TestBed.get(TopToolbarService);
    expect(service).toBeTruthy();
  });
});
