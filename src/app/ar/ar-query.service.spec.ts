import { TestBed } from '@angular/core/testing';

import { ArQueryService } from './ar-query.service';

import { RouterTestingModule } from '@angular/router/testing';
describe('ArQueryService', () => {
  let service: ArQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ArQueryService ],
      imports: [ RouterTestingModule ]
    })
    service = TestBed.inject(ArQueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
