import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse, HttpClientModule, HttpHandler } from '@angular/common/http';
import { TableComponent } from './table.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from './../../material/material.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableComponent ],
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
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
