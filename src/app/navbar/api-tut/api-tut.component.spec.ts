import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiTutComponent } from './api-tut.component';

describe('ApiTutComponent', () => {
  let component: ApiTutComponent;
  let fixture: ComponentFixture<ApiTutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiTutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiTutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
