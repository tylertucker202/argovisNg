import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArSidebarNavComponent } from './ar-sidebar-nav.component';

describe('ArSidebarNavComponent', () => {
  let component: ArSidebarNavComponent;
  let fixture: ComponentFixture<ArSidebarNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArSidebarNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArSidebarNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
