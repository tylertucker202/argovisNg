import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorbarComponent } from './colorbar.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { QueryGridService } from './../../query-grid.service';
import { DebugElement } from '@angular/core'; //can view dom elements with this

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ColorbarComponent', () => {
  let component: ColorbarComponent;
  let fixture: ComponentFixture<ColorbarComponent>;
  let debugElement: DebugElement;
  let queryGridService: QueryGridService;
  let spySDM: jasmine.Spy;
  let spyGetGridDomain: jasmine.Spy;
  let spyGetColorScale: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorbarComponent ],
      providers: [ QueryGridService ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      imports: [ RouterTestingModule, HttpClientTestingModule ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorbarComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    queryGridService = debugElement.injector.get(QueryGridService);

    const domain = [0, 1]
    const colorScale = 'OrRd'

    spySDM = spyOn(queryGridService, 'sendGridDomain')
    spyGetColorScale = spyOn(queryGridService, 'getColorScale').and.returnValue(colorScale)
    spyGetGridDomain = spyOn(queryGridService, 'getGridDomain').and.returnValue(domain)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    
  });

  it('should create create_colorbar', () => {
    const domain = [0, 1]
    const colorScale = 'OrRd'
    expect(component['domain']).toEqual(domain)
    expect(component['colorScale']).toEqual(colorScale)
    expect(component['svg']).toBeTruthy()

    expect(spyGetColorScale).toHaveBeenCalledTimes(1)
    expect(spyGetGridDomain).toHaveBeenCalledTimes(1)
  });

  it('should update_colorbar', () => {

    queryGridService.update_colorbarEvent.emit('test update')

    expect(component['svg']).toBeTruthy()
    expect(spyGetColorScale).toHaveBeenCalledTimes(2)
    expect(spyGetGridDomain).toHaveBeenCalledTimes(2)
  });

  it('should change', () => {
    queryGridService.change.emit('test change')

    expect(component['svg']).toBeTruthy()
    expect(spyGetColorScale).toHaveBeenCalledTimes(2)
    expect(spyGetGridDomain).toHaveBeenCalledTimes(2)
  });

  it('should resetToStart', () => {
    queryGridService.resetToStart.emit('test change')

    expect(component['svg']).toBeTruthy()
    expect(spyGetColorScale).toHaveBeenCalledTimes(2)
    expect(spyGetGridDomain).toHaveBeenCalledTimes(2)
  });

  it('should min_change', () => {
    const domain = [-1, 1]
    component.min_change(domain[0])
    expect(component['domain']).toEqual(domain)
    //colorbar should not update from event emitters
    expect(spyGetGridDomain).toHaveBeenCalledTimes(1) 
    expect(spyGetColorScale).toHaveBeenCalledTimes(1)

  });

  it('should max_change', () => {
    const domain = [0, 2]
    component.max_change(domain[1])
    expect(component['domain']).toEqual(domain)
    //colorbar should not update from event emitters
    expect(spyGetGridDomain).toHaveBeenCalledTimes(1) 
    expect(spyGetColorScale).toHaveBeenCalledTimes(1)
  });

  it('should min and max change', () => {
    const domain = [-1, 2]
    component.min_change(domain[0])
    component.max_change(domain[1])
    expect(component['domain']).toEqual(domain)

    //colorbar should not update from event emitters
    expect(spyGetGridDomain).toHaveBeenCalledTimes(1) 
    expect(spyGetColorScale).toHaveBeenCalledTimes(1)
  });
  


});
