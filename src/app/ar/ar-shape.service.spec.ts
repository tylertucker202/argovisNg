import { TestBed } from '@angular/core/testing';

import { ArShapeService } from './ar-shape.service';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse, HttpClientModule, HttpHandler } from '@angular/common/http';

describe('ArShapeService', () => {
  beforeEach(() => 
  TestBed.configureTestingModule({
    providers: [ HttpClientTestingModule, HttpTestingController, HttpClient, HttpClientModule, HttpHandler, ArShapeService ], 
  }));

  it('should be created', () => {
    const service: ArShapeService = TestBed.get(ArShapeService);
    expect(service).toBeTruthy();
  });
});
