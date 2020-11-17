import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TsSidebarNavComponent } from './tc-sidebar-nav.component';
import { TcQueryService } from '../tc-query.service';
import { QueryService } from './../../home/services/query.service';
import { MaterialModule } from './../../material/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

describe('TsSidebarNavComponent', () => {
  let component: TsSidebarNavComponent;
  let fixture: ComponentFixture<TsSidebarNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TsSidebarNavComponent ], 
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [ TcQueryService, QueryService ], 
      imports: [    MaterialModule,
                    RouterTestingModule,
                    BrowserAnimationsModule, 
                    MatMomentDateModule]     
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
