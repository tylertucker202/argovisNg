import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';

import { QueryGridService } from '../../query-grid.service'

import * as _moment from 'moment';
import {Moment} from 'moment';
const moment = _moment;

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
  private monthYear: _moment.Moment;
  private minDate = new Date(2004, 0, 1);
  private maxDate = new Date(2020, 0, 1);

  constructor(private queryGridService: QueryGridService) { }

  ngOnInit() {
    this.monthYear = this.queryGridService.getMonthYear()
    console.log(this.monthYear)
    this.date = new FormControl(this.monthYear)
  }

  private sendMonthYearMessage(): void {
    const broadcastChange = true;
    this.queryGridService.sendMonthYearMessage(this.monthYear, broadcastChange)
  }

  displayGridMonthChanged(event: MatDatepickerInputEvent<Date>): void {
    //triggered when user changes date
    const date = moment(event.value)
    this.date.setValue(date)
    this.monthYear = date
    console.log(this.monthYear)
    this.sendMonthYearMessage()
  }

  chosenYearHandler(normalizedYear: Moment) {
    //triggered when user selects year
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    this.monthYear = ctrlValue
    this.sendMonthYearMessage()
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    //triggered when user selects month
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
    this.monthYear = ctrlValue
    this.sendMonthYearMessage()
  }
}
