import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MapComponent } from './map.component';
import { MapService } from '../map.service';
import { PointsService } from '../points.service'
import { QueryService } from '../query.service';
import { PopupCompileService } from '../popup-compile.service';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async(() => {
    const spy = jasmine.createSpyObj('MapService', ['getValue']);
    TestBed.configureTestingModule({
      declarations: [ MapComponent],
      providers: [{ provide: MapService, useValue: spy }, PointsService, QueryService, PopupCompileService]
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
});
