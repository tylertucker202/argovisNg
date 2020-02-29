import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';

import { QueryGridService } from '../../query-grid.service'

import * as moment from 'moment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-month-picker',
  templateUrl: './month-picker.component.html',
  styleUrls: ['./month-picker.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class MonthPickerComponent implements OnInit {

  private date = new FormControl(moment());
  private monthYear: moment.Moment;
  private minDate = new Date(2012, 0, 1);
  private maxDate = new Date(2012, 11, 1);
  @Input() paramMode: boolean
  @ViewChild('dp') datepicker: MatDatepicker<any>;

  constructor(private queryGridService: QueryGridService) { }

  ngOnInit() {
    this.setDate()
    this.queryGridService.resetToStart.subscribe((msg) => {
      this.setDate()
    })
  }

  private incrementMonth(increment: number): void {
    this.monthYear = this.monthYear.add(increment, 'M')
    this.date = new FormControl(this.monthYear)
    this.sendmonthYear()
  }

  private setDate(): void {
    this.monthYear = this.queryGridService.getMonthYear()
    this.date = new FormControl(this.monthYear)    
  }

  private sendmonthYear(): void {
    const broadcastChange = true;
    this.queryGridService.sendmonthYear(this.monthYear, broadcastChange)
  }

  private displayDateChanged(date: moment.Moment): void {
    //triggered when user changes date manually
    this.date.setValue(date)
    this.monthYear = date
    this.sendmonthYear()
  }

  private chosenYearHandler(year: number) {
    //triggered when user selects on menu
    const ctrlValue = this.date.value;
    ctrlValue.year(year);
    this.date.setValue(ctrlValue);
    this.monthYear = ctrlValue
    this.sendmonthYear()
  }

  private chosenMonthHandler(month: number) {
    //triggered when user selects month on menu
    const ctrlValue = this.date.value;
    ctrlValue.month(month);
    this.date.setValue(ctrlValue);
    this.datepicker.close();
    this.monthYear = ctrlValue
    this.sendmonthYear()
  }
}
