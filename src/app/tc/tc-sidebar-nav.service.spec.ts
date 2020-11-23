import { TestBed } from '@angular/core/testing';

import { TcSidebarNavService } from './tc-sidebar-nav.service';

describe('TcSidebarNavService', () => {
  let service: TcSidebarNavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TcSidebarNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
