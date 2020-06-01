import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'
import { ProfviewComponent } from './profview.component';
import { QueryProfviewService } from './query-profview.service'
import { HttpClient, HttpErrorResponse, HttpClientModule, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ProfviewComponent', () => {
  let component: ProfviewComponent;
  let fixture: ComponentFixture<ProfviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfviewComponent ],
      imports: [ RouterTestingModule ],
      providers: [ 
        QueryProfviewService,
        HttpClientTestingModule, 
        HttpTestingController, 
        HttpClient, 
        HttpClientModule, 
        HttpHandler, 
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
