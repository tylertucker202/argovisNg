import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfviewComponent } from './profview.component';

describe('ProfviewComponent', () => {
  let component: ProfviewComponent;
  let fixture: ComponentFixture<ProfviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfviewComponent ]
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
