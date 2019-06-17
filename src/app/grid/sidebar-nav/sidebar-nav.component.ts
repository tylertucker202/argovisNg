import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import {FormControl} from '@angular/forms';

import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';

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
  selector: 'app-sidebar-nav',
  templateUrl: './sidebar-nav.component.html',
  styleUrls: ['./sidebar-nav.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class SidebarNavComponent implements OnInit {
  private date = new FormControl(moment());

  constructor() { }

  ngOnInit() {
  }

  displayGridMonthChanged(type: string, event: MatDatepickerInputEvent<Date>) {
    const date = event.value
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const dateStr = year + '-' + month + '-' + day
    //this.queryService.sendGlobalDateMessage(dateStr)
  }

}
