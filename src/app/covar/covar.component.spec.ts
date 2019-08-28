import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CovarComponent } from './covar.component';

import { HttpClientModule } from '@angular/common/http';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CovarComponent', () => {
  let component: CovarComponent;
  let fixture: ComponentFixture<CovarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CovarComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      imports: [
        HttpClientModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
