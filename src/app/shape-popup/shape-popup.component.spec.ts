import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShapePopupComponent } from './shape-popup.component';
import { QueryService } from '../services/query.service';

describe('ShapePopupComponent', () => {
  let component: ShapePopupComponent;
  let fixture: ComponentFixture<ShapePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapePopupComponent ],
      providers: [ QueryService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
