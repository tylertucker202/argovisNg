import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core'
import { ArHourRangeComponent } from './ar-hour-range.component'
import { ArQueryService } from '../../ar-query.service'
import { NouisliderModule } from 'ng2-nouislider'
import { RouterTestingModule } from '@angular/router/testing';

describe('ArHourRangeComponent', () => {
  let component: ArHourRangeComponent;
  let fixture: ComponentFixture<ArHourRangeComponent>;
  let spyQS: jasmine.Spy
  let spySendRange: jasmine.Spy
  let debugElement: DebugElement
  let arQueryService: ArQueryService
  const presRange = [-10, 10] 
  const defaultPresRange = [-18, 18]

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArHourRangeComponent ],
      providers: [ ArQueryService ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      imports: [ NouisliderModule, RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArHourRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement;

    arQueryService = debugElement.injector.get(ArQueryService)  
     
    spySendRange = spyOn(arQueryService, 'sendArDateRange').and.callThrough()
    spyQS = spyOn(arQueryService, 'getArDateRange').and.returnValue(presRange)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set slider range to default', () => {
    expect(component['sliderRange']).toEqual(defaultPresRange)
    component['setSliderRange']()
    expect(component['sliderRange']).toEqual(presRange)
  });
  it('should set min/max value', () => {
    expect(component['lRange']).toEqual(defaultPresRange[0])
    expect(component['uRange']).toEqual(defaultPresRange[1])
    
    component['minValuechange'](presRange[0])
    expect(component['lRange']).toEqual(presRange[0])
    expect(component['sliderRange']).toEqual([presRange[0], defaultPresRange[1]])
    
    component['maxValuechange'](presRange[1])
    expect(component['uRange']).toEqual(presRange[1])
    expect(component['sliderRange']).toEqual(presRange)
  });
  it('should send slider range', () => {
    component['updateSelectDates']()
    expect(spySendRange).toHaveBeenCalledTimes(1)
  });
  it('should reset on trigger', () => {
    expect(component['sliderRange']).toEqual(defaultPresRange)
    arQueryService.resetToStart.emit('testing emit');
    expect(component['sliderRange']).toEqual(presRange)
  });
});
