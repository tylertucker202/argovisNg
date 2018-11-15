import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { QueryService } from '../../query.service'

@Component({
  selector: 'app-daterangepicker',
  templateUrl: './daterangepicker.component.html',
  styleUrls: ['./daterangepicker.component.css']
})
export class DaterangepickerComponent {
  constructor(private queryService: QueryService) {}
  private daterange: any = {};
  private start = moment().subtract(14, 'days');
  private end = moment();
 
  // see original project for full list of options
  // can also be setup using the config service to apply to multiple pickers
  private options: any = {
      locale: { format: 'MM/DD/YYYY' },
      startDate: this.start,
      endDate: this.end,
      alwaysShowCalendars: true,
      minDate: "01/01/1997",
      ranges: {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
  };

  ngOnInit() {
    this.daterange = {start: this.start.format('YYYY-MM-DD'), end: this.end.format('YYYY-MM-DD') }
    this.sendDateRange()
  }

  private sendDateRange(): void {
    this.queryService.sendSelectedDateMessage(this.daterange);
  }

  public selectedDate(value: any) {
      this.daterange.start = value.start.format('YYYY-MM-DD');
      this.daterange.end = value.end.format('YYYY-MM-DD');
      this.daterange.label = value.label;
      this.sendDateRange();
  }
}