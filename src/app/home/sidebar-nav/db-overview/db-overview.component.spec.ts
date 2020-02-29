import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbOverviewComponent } from './db-overview.component';

import { MaterialModule } from './../../../material/material.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('DbOverviewComponent', () => {
  let component: DbOverviewComponent;
  let fixture: ComponentFixture<DbOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbOverviewComponent ],
      imports: [ MaterialModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
