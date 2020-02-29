import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ArDateRangeComponent } from './ar-date-range.component'
import { QueryService } from '../../services/query.service'
import { NouisliderModule } from 'ng2-nouislider'
import { RouterTestingModule } from '@angular/router/testing';

describe('ArDateRangeComponent', () => {
  let component: ArDateRangeComponent;
  let fixture: ComponentFixture<ArDateRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArDateRangeComponent ],
      providers: [ QueryService ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      imports: [ NouisliderModule, RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArDateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
