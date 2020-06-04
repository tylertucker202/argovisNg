import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse, HttpClientModule, HttpHandler } from '@angular/common/http';
import { PlatformWindowComponent } from './platform-window.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from './../../material/material.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('PlatformWindowComponent', () => {
  let component: PlatformWindowComponent;
  let fixture: ComponentFixture<PlatformWindowComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatformWindowComponent ],
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
    fixture = TestBed.createComponent(PlatformWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
