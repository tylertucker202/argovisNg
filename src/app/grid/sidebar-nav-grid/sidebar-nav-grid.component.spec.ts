import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarNavGridComponent } from './sidebar-nav-grid.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { QueryGridService } from './../query-grid.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SidebarNavGridComponent', () => {
  let component: SidebarNavGridComponent;
  let fixture: ComponentFixture<SidebarNavGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarNavGridComponent ],
      providers: [ QueryGridService ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      imports: [ RouterTestingModule, HttpClientTestingModule ]
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
