import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TcMapComponent } from './tc-map.component';

describe('TcMapComponent', () => {
  let component: TcMapComponent;
  let fixture: ComponentFixture<TcMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TcMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
