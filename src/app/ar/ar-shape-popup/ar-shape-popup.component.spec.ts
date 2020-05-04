import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ArShapePopupComponent } from './ar-shape-popup.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ArQueryService } from '../ar-query.service';
import { DebugElement } from '@angular/core';

fdescribe('ArShapePopupComponent', () => {
  let component: ArShapePopupComponent;
  let fixture: ComponentFixture<ArShapePopupComponent>;
  let arQueryService: ArQueryService;
  let queryARShapeSpy: jasmine.Spy
  let debugElement: DebugElement

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArShapePopupComponent ],
      imports: [ RouterTestingModule ], 
      providers: [ ArQueryService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArShapePopupComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement
    arQueryService = debugElement.injector.get(ArQueryService)
    queryARShapeSpy = spyOn<any>(component, 'queryARShape').and.callThrough()
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate selection page url properly', () => {
    let url = component['generateURL'](false)

    expect(url.includes('startDate=')).toEqual(true)
    expect(url.includes('endDate')).toEqual(true)
    expect(url.includes('/page')).toEqual(false)
    url = component['generateURL'](true)
    expect(url.includes('/page')).toEqual(true)
    expect(url.includes('&bgcOnly=true')).toEqual(false)
    expect(url.includes('&deepOnly=true')).toEqual(false)

    component['bgcOnlyChange'](true)
    component['deepOnlyChange'](true)
    url = component['generateURL'](true)
    expect(url.includes('&bgcOnly=true')).toEqual(true)
    expect(url.includes('&deepOnly=true')).toEqual(true)
  })

  it('should generate homepage url', () => {
    let url = component['generateHomepageURL']()
    expect(url.includes('/ng/home?')).toEqual(true)
  })

  it('should generate queryARShape on init', () => {
    expect(queryARShapeSpy).toHaveBeenCalled()
  })
});
