import { TestBed } from '@angular/core/testing';

import { ArServiceService } from './ar-service.service';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse, HttpClientModule, HttpHandler } from '@angular/common/http';

describe('ArServiceService', () => {
  beforeEach(() => 
  TestBed.configureTestingModule({
    providers: [ HttpClientTestingModule, HttpTestingController, HttpClient, HttpClientModule, HttpHandler, ArServiceService ], 
  }));

  it('should be created', () => {
    const service: ArServiceService = TestBed.get(ArServiceService);
    expect(service).toBeTruthy();
  });
});
