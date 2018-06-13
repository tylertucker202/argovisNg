import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutArgovisComponent } from './about-argovis.component';

describe('AboutArgovisComponent', () => {
  let component: AboutArgovisComponent;
  let fixture: ComponentFixture<AboutArgovisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutArgovisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutArgovisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
