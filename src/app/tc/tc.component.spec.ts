import { PopupCompileService } from './../home/services/popup-compile.service';
import { TcQueryService } from './tc-query.service';
import { TcMapService } from './tc-map.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TcComponent } from './tc.component';
import { PointsService } from '../home/services/points.service';
import { TcTrackService } from './tc-track.service';

describe('TcComponent', () => {
  let component: TcComponent;
  let fixture: ComponentFixture<TcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TcComponent ],
      imports: [ 
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        TcMapService,
        PointsService,
        TcTrackService,
        TcQueryService,
        PopupCompileService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
