import { TestBed } from '@angular/core/testing';
import { GetProfilesService } from './get-profiles.service';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse, HttpClientModule, HttpHandler } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
describe('GetProfilesService', () => {
  let service: GetProfilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClientTestingModule, 
        HttpTestingController, 
        HttpClient, 
        HttpClientModule, 
        HttpHandler, ],
    });
    service = TestBed.inject(GetProfilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
