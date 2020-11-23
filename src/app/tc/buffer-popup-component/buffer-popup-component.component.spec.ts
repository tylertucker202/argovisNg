import { TcQueryService } from './../tc-query.service';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BufferPopupComponentComponent } from './buffer-popup-component.component';

describe('BufferPopupComponentComponent', () => {
  let component: BufferPopupComponentComponent;
  let fixture: ComponentFixture<BufferPopupComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BufferPopupComponentComponent ],
      imports: [ RouterTestingModule ],
      providers: [ TcQueryService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BufferPopupComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
