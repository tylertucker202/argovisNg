import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobeScatterComponent } from './globe-scatter.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse, HttpClientModule, HttpHandler } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { QueryProfviewService } from '../query-profview.service';
describe('GlobeScatterComponent', () => {
  let component: GlobeScatterComponent;
  let fixture: ComponentFixture<GlobeScatterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobeScatterComponent ],
      providers: [
        HttpClientTestingModule, 
        HttpTestingController, 
        HttpClient, 
        HttpClientModule, 
        HttpHandler, QueryProfviewService],
        imports: [
          RouterTestingModule,
        ]
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
