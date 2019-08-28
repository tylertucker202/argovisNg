import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MapService } from './../../home/services/map.service';
import { MapGridComponent } from './map-grid.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PopupCompileService } from './../../home/services/popup-compile.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QueryGridService } from './../query-grid.service';

describe('MapGridComponent', () => {
  let component: MapGridComponent;
  let fixture: ComponentFixture<MapGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapGridComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [ MapService, PopupCompileService, QueryGridService ],
      imports: [ RouterTestingModule, HttpClientTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
