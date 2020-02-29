import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapCovarComponent } from './map-covar.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MapCovarComponent', () => {
  let component: MapCovarComponent;
  let fixture: ComponentFixture<MapCovarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapCovarComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      imports: [ RouterTestingModule, HttpClientTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapCovarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
