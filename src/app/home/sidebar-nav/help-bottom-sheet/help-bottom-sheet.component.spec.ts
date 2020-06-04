import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpBottomSheetComponent } from './help-bottom-sheet.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { MatBottomSheet } from '@angular/material/bottom-sheet';

describe('HelpBottomSheetComponent', () => {
  let component: HelpBottomSheetComponent;
  let fixture: ComponentFixture<HelpBottomSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpBottomSheetComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
                  { provide: MatBottomSheet, useValue: {}}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
