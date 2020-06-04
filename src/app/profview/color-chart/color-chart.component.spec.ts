import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse, HttpClientModule, HttpHandler } from '@angular/common/http';

import { MaterialModule } from './../../material/material.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ColorChartComponent } from './color-chart.component';
import { RouterTestingModule } from '@angular/router/testing';
describe('ColorChartComponent', () => {
  let component: ColorChartComponent;
  let fixture: ComponentFixture<ColorChartComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorChartComponent ], 
      imports: [ MaterialModule, RouterTestingModule, BrowserAnimationsModule ],
      providers: [ 
        HttpClientTestingModule, 
        HttpTestingController, 
        HttpClient, 
        HttpClientModule, 
        HttpHandler, 
      ]
    })
    .compileComponents();
    // Inject the http service and test controller for each test
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
