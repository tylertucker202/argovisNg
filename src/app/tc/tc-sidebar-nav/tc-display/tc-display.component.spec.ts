import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TcDisplayComponent } from './tc-display.component';

describe('TcDisplayComponent', () => {
  let component: TcDisplayComponent;
  let fixture: ComponentFixture<TcDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TcDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
