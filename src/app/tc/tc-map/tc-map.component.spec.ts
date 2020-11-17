import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TcMapService } from './../tc-map.service';
import { PointsService } from './../../home/services/points.service';
import { PopupCompileService } from './../../home/services/popup-compile.service';
import { MapService } from './../../home/services/map.service';
import { TcQueryService } from './../tc-query.service';
import { MaterialModule } from './../../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NotifierModule } from 'angular-notifier';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TcMapComponent } from './tc-map.component';
import { QueryService } from './../../home/services/query.service';

describe('TcMapComponent', () => {
  let component: TcMapComponent;
  let fixture: ComponentFixture<TcMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ TcMapComponent ], 
      providers: [
        TcMapService,
        TcQueryService,
        QueryService,
        MapService,
        PointsService,
        PopupCompileService
      ],
      imports: [ 
        HttpClientTestingModule,
        NotifierModule, 
        RouterTestingModule,
        BrowserAnimationsModule,
        MaterialModule,
]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TcMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
