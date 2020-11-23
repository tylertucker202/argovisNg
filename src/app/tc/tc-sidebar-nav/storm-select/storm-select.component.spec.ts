import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './../../../material/material.module';
import { PopupCompileService } from './../../../home/services/popup-compile.service';
import { MapService } from './../../../home/services/map.service';
import { TcQueryService } from './../../tc-query.service';
import { TcTrackService } from './../../tc-track.service';
import { TcMapService } from './../../tc-map.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StormSelectComponent } from './storm-select.component';

describe('StormSelectComponent', () => {
  let component: StormSelectComponent;
  let fixture: ComponentFixture<StormSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StormSelectComponent ],
      imports: [ 
        RouterTestingModule, 
        MaterialModule, 
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [ 
        TcMapService, 
        MapService,
        PopupCompileService,
        TcTrackService,
        TcQueryService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StormSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
