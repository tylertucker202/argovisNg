import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArDisplayComponent } from './ar-display.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ArServiceService } from '../../ar-service.service'
import { MapService } from '../../../home/services/map.service'
import { MaterialModule } from '../../../material/material.module'
import { MatDialogRef } from '@angular/material/dialog';
import { QueryService } from '../../../home/services/query.service';
import { RouterTestingModule } from '@angular/router/testing';
import { PopupCompileService } from '../../../home/services/popup-compile.service';
import { NotifierService, NotifierModule } from 'angular-notifier';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ArDisplayComponent', () => {
  let component: ArDisplayComponent;
  let fixture: ComponentFixture<ArDisplayComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ArDisplayComponent ],
      imports: [ MaterialModule, RouterTestingModule, NotifierModule, HttpClientTestingModule, BrowserAnimationsModule ],
      providers: [ {provide : MatDialogRef, useValue : {}},
         PopupCompileService,
         ArServiceService, 
         QueryService, 
         MapService,
         NotifierService
         ], 
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })

    // Inject the http service and test controller for each test
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
