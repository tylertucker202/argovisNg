import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { MapComponent } from './map.component';
import { MapService } from '../services/map.service';
import { PointsService } from '../services/points.service';
import { QueryService } from '../services/query.service';
import { PopupCompileService } from '../services/popup-compile.service';
import { NotifierService, NotifierModule } from 'angular-notifier';


import { MaterialModule } from '../../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async(() => {
    const spy = jasmine.createSpyObj('MapService', ['init']);
    const notifierSpy = jasmine.createSpyObj('NotifierService', ['getValue'])
    TestBed.configureTestingModule({
      declarations: [ MapComponent],
      providers: 
      [NotifierService,
       HttpClient,
       HttpClientModule,
       HttpHandler,
       //{ provide: MapService, useValue: spy },
       MapService,
       PointsService,
       QueryService,
       PopupCompileService],
       imports: [RouterTestingModule, NotifierModule],

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
     expect(component).toBeTruthy();
  });

  it('should have web mercator', () => {
    expect(component.proj == 'WM')
  })

});
