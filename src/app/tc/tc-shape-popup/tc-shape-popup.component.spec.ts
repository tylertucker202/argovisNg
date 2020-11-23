import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { tcTrackPopupComponent } from './tc-shape-popup.component';

describe('tcTrackPopupComponent', () => {
  let component: tcTrackPopupComponent;
  let fixture: ComponentFixture<tcTrackPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ tcTrackPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(tcTrackPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
