import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformWindowComponent } from './platform-window.component';

describe('PlatformWindowComponent', () => {
  let component: PlatformWindowComponent;
  let fixture: ComponentFixture<PlatformWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatformWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
