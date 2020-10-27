import { TestBed } from '@angular/core/testing';

import { TcShapeService } from './tc-shape.service';

describe('TcShapeService', () => {
  let service: TcShapeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TcShapeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
