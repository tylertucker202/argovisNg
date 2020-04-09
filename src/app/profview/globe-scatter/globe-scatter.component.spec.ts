import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobeScatterComponent } from './globe-scatter.component';

describe('GlobeScatterComponent', () => {
  let component: GlobeScatterComponent;
  let fixture: ComponentFixture<GlobeScatterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobeScatterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobeScatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
