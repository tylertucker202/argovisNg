import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopToolbarComponent } from './top-toolbar.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MaterialModule } from './../material/material.module'
import { RouterTestingModule } from '@angular/router/testing';
describe('TopToolbarComponent', () => {
  let component: TopToolbarComponent;
  let fixture: ComponentFixture<TopToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopToolbarComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      // providers: [ RouterTestingModule ],
      imports: [ MaterialModule, RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
