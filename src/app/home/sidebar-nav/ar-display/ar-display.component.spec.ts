import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArDisplayComponent } from './ar-display.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse, HttpClientModule, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ArServiceService } from './../../services/ar-service.service'
import { MapService } from './../../services/map.service'
import { MaterialModule } from './../../../material/material.module'
import { MatDialogRef } from '@angular/material/dialog';
import { QueryService } from '../../services/query.service';
import { RouterTestingModule } from '@angular/router/testing';
import { PopupCompileService } from './../../../home/services/popup-compile.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ArDisplayComponent', () => {
  let component: ArDisplayComponent;
  let fixture: ComponentFixture<ArDisplayComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ArDisplayComponent ],
      imports: [ MaterialModule, RouterTestingModule, BrowserAnimationsModule ],
      providers: [ {provide : MatDialogRef, useValue : {}},
         PopupCompileService,
         HttpClientTestingModule, 
         HttpTestingController, 
         HttpClient, 
         HttpClientModule, 
         HttpHandler, 
         ArServiceService, 
         QueryService, 
         MapService,
         ], 
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })

    // Inject the http service and test controller for each test
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ArDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
