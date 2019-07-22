import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CovarComponent } from './covar.component';

describe('CovarComponent', () => {
  let component: CovarComponent;
  let fixture: ComponentFixture<CovarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CovarComponent ]
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
