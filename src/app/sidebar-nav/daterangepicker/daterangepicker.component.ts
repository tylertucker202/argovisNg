import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
//import { DaterangepickerConfig } from 'ng2-daterangepicker';

@Component({
  selector: 'app-daterangepicker',
  templateUrl: './daterangepicker.component.html',
  styleUrls: ['./daterangepicker.component.css']
})
export class DaterangepickerComponent {
  public daterange: any = {};
  private start = moment().subtract(14, 'days');
  private end = moment();
 
  // see original project for full list of options
  // can also be setup using the config service to apply to multiple pickers
  public options: any = {
      locale: { format: 'MM/DD/YYYY' },
      alwaysShowCalendars: true,
      minDate: "01/01/1997",
      ranges: {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
  };

  public selectedDate(value: any, datepicker?: any) {
      // this is the date the iser selected
      console.log(value);

      // any object can be passed to the selected event and it will be passed back here
      datepicker.start = value.start;
      datepicker.end = value.end;

      // or manupulat your own internal property
      this.daterange.start = value.start;
      this.daterange.end = value.end;
      this.daterange.label = value.label;
  }
}