import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TsSidebarNavComponent } from './tc-sidebar-nav.component';

describe('TsSidebarNavComponent', () => {
  let component: TsSidebarNavComponent;
  let fixture: ComponentFixture<TsSidebarNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TsSidebarNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TsSidebarNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
