import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ArHourRangeComponent } from './ar-hour-range.component'
import { QueryService } from '../../../home/services/query.service'
import { NouisliderModule } from 'ng2-nouislider'
import { RouterTestingModule } from '@angular/router/testing';

describe('ArHourRangeComponent', () => {
  let component: ArHourRangeComponent;
  let fixture: ComponentFixture<ArHourRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArHourRangeComponent ],
      providers: [ QueryService ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      imports: [ NouisliderModule, RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArHourRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
