import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GriddedClimComponent } from './gridded-clim.component';

describe('GriddedClimComponent', () => {
  let component: GriddedClimComponent;
  let fixture: ComponentFixture<GriddedClimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GriddedClimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GriddedClimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
