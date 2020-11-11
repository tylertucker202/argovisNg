import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StormSelectComponent } from './storm-select.component';

describe('StormSelectComponent', () => {
  let component: StormSelectComponent;
  let fixture: ComponentFixture<StormSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StormSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StormSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
