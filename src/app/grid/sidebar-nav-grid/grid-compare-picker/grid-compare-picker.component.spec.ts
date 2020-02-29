import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { QueryGridService } from '../../query-grid.service'
import { GridComparePickerComponent } from './grid-compare-picker.component';
import { MaterialModule } from '../../../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('GridComparePickerComponent', () => {
  let component: GridComparePickerComponent;
  let fixture: ComponentFixture<GridComparePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridComparePickerComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [ QueryGridService ],
      imports: [   RouterTestingModule,
                   MaterialModule,
                   BrowserAnimationsModule
                 ], 
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridComparePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
