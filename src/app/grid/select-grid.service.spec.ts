import { TestBed } from '@angular/core/testing';

import { SelectGridService } from './select-grid.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse, HttpClientModule, HttpHandler } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('SelectGridService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpClientTestingModule, 
      HttpTestingController, 
      HttpClient, 
      HttpClientModule, 
      HttpHandler, ],
    imports: [ RouterTestingModule ]
  }));

  it('should be created', () => {
    const service: SelectGridService = TestBed.get(SelectGridService);
    expect(service).toBeTruthy();
  });
});
