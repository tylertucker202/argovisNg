import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapService } from '../../../home/services/map.service';
import { TcTrackService } from '../../tc-track.service';
import { PopupCompileService } from '../../../home/services/popup-compile.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NotifierModule, NotifierService } from 'angular-notifier';
import { MaterialModule } from '../../../material/material.module';
import { TcDaterangeComponent } from './tc-daterange.component';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';

describe('TcDaterangeComponent', () => {
  let component: TcDaterangeComponent;
  let fixture: ComponentFixture<TcDaterangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        TcDaterangeComponent 
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
    fixture = TestBed.createComponent(TcDaterangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
