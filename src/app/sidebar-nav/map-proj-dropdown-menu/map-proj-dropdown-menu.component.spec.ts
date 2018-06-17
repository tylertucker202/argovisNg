import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapProjDropdownMenuComponent } from './map-proj-dropdown-menu.component';

describe('MapProjDropdownMenuComponent', () => {
  let component: MapProjDropdownMenuComponent;
  let fixture: ComponentFixture<MapProjDropdownMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapProjDropdownMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapProjDropdownMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
