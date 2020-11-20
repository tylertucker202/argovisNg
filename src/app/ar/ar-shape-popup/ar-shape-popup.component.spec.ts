import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ArShapePopupComponent } from './ar-shape-popup.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ArQueryService } from '../ar-query.service';
import { DebugElement } from '@angular/core';

describe('ArShapePopupComponent', () => {
  let component: ArShapePopupComponent;
  let fixture: ComponentFixture<ArShapePopupComponent>;
  let arQueryService: ArQueryService;
  let query_ar_shapeSpy: jasmine.Spy
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
    query_ar_shapeSpy = spyOn<any>(component, 'query_ar_shape').and.callThrough()
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate selection page url properly', () => {
    let url = component['generate_url'](false)

    expect(url.includes('startDate=')).toEqual(true)
    expect(url.includes('endDate')).toEqual(true)
    expect(url.includes('/page')).toEqual(false)
    url = component['generate_url'](true)
    expect(url.includes('/page')).toEqual(true)
    expect(url.includes('&bgcOnly=true')).toEqual(false)
    expect(url.includes('&deepOnly=true')).toEqual(false)

    component['bgc_only_change'](true)
    component['deep_only_change'](true)
    url = component['generate_url'](true)
    expect(url.includes('&bgcOnly=true')).toEqual(true)
    expect(url.includes('&deepOnly=true')).toEqual(true)
  })

  it('should generate homepage url', () => {
    let url = component['generate_homepage_url']()
    expect(url.includes('/ng/home?')).toEqual(true)
  })

  it('should generate query_ar_shape on init', () => {
    expect(query_ar_shapeSpy).toHaveBeenCalled()
  })
});
