import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridColorPickerComponent } from './grid-color-picker.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MaterialModule } from './../../../material/material.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { QueryGridService } from './../../query-grid.service';
import { DebugElement } from '@angular/core'; //can view dom elements with this
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('GridColorPickerComponent', () => {
  let component: GridColorPickerComponent;
  let fixture: ComponentFixture<GridColorPickerComponent>;
  let debugElement: DebugElement;
  let queryGridService: QueryGridService;
  let spyGetColorScale: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridColorPickerComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      imports: [ MaterialModule, FormsModule, ReactiveFormsModule, RouterTestingModule, BrowserAnimationsModule ],
      providers: [ QueryGridService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridColorPickerComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
    queryGridService = debugElement.injector.get(QueryGridService);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement
    queryGridService = debugElement.injector.get(QueryGridService);

    const colorScale = 'OrRd'
    spyGetColorScale = spyOn(queryGridService, 'getColorScale').and.returnValue(colorScale)

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(spyGetColorScale).toHaveBeenCalledTimes(0)
  });


  it('should resetToStart', () => {
    queryGridService.resetToStart.emit('test change')
    expect(spyGetColorScale).toHaveBeenCalledTimes(1)
  });

  it('should changeColorScale', () => {
    const colorScale = 'reds'
    component['changeColorScale'](colorScale)
    expect(spyGetColorScale).toHaveBeenCalledTimes(0)
    expect(component['colorScale']).toEqual(colorScale)
  });
});
