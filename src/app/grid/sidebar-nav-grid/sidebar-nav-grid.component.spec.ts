import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarNavGridComponent } from './sidebar-nav-grid.component';

describe('SidebarNavGridComponent', () => {
  let component: SidebarNavGridComponent;
  let fixture: ComponentFixture<SidebarNavGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarNavGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarNavGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
