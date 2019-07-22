import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapCovarComponent } from './map-covar.component';

describe('MapCovarComponent', () => {
  let component: MapCovarComponent;
  let fixture: ComponentFixture<MapCovarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapCovarComponent ]
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
