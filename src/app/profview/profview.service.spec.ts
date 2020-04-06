import { TestBed } from '@angular/core/testing';

import { QueryProfviewService } from './query-profview.service';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse, HttpClientModule, HttpHandler } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('QueryProfviewService', () => {
  let service: QueryProfviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      providers: [ 
        HttpClientTestingModule, 
        HttpTestingController, 
        HttpClient, 
        HttpClientModule, 
        HttpHandler, 
      ]
    });
    service = TestBed.inject(QueryProfviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
