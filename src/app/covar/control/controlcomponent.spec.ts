import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { controlComponent } from './control.component';

describe('controlComponent', () => {
  let component: controlComponent;
  let fixture: ComponentFixture<controlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ controlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(controlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
