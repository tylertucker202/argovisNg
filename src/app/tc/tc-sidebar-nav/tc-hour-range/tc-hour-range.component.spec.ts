import { RouterTestingModule } from '@angular/router/testing';
import { NouisliderModule } from 'ng2-nouislider';
import { TcQueryService } from './../../tc-query.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core'

import { TcHourRangeComponent } from './tc-hour-range.component';

describe('TcHourRangeComponent', () => {
  let component: TcHourRangeComponent;
  let fixture: ComponentFixture<TcHourRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TcHourRangeComponent ],
      providers: [ TcQueryService ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      imports: [ NouisliderModule, RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcHourRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
