import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapService } from './../../../home/services/map.service';
import { TcTrackService } from './../../tc-track.service';
import { PopupCompileService } from './../../../home/services/popup-compile.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NotifierModule, NotifierService } from 'angular-notifier';
import { MaterialModule } from './../../../material/material.module';
import { TcDisplayComponent } from './tc-display.component';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';

describe('TcDisplayComponent', () => {
  let component: TcDisplayComponent;
  let fixture: ComponentFixture<TcDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        TcDisplayComponent 
      ], 
      imports: [
        BrowserAnimationsModule,
        MaterialModule,
        RouterTestingModule,
        NotifierModule,
        HttpClientTestingModule, 
      ],
      providers: [
        PopupCompileService,
        TcTrackService,
        MapService,
        NotifierService
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
