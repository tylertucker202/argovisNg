import { Component, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import { QueryService } from '../../services/query.service'
import { DateRange, DateRangeSel } from '../../../../typeings/daterange';
import { DaterangePickerComponent } from 'ng2-daterangepicker';


@Component({
  selector: 'app-selectiondatepicker',
  templateUrl: './selectiondatepicker.component.html',
  styleUrls: ['./selectiondatepicker.component.css']
})
export class SelectionDatePicker {
  constructor(private queryService: QueryService) {}

  @ViewChild(DaterangePickerComponent)
  private picker: DaterangePickerComponent;
  private daterange: DateRange;
  private start: moment.Moment;
  private end: moment.Moment;
  private options: any;

  ngOnInit() {
    this.daterange = this.queryService.getSelectionDates()
    this.start = moment(this.daterange.start)
    this.end = moment(this.daterange.end)
    this.options = {
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

    this.queryService.resetToStart
    .subscribe( () => {
      this.daterange = this.queryService.getSelectionDates()
      this.start = moment.utc(this.daterange.start)
      this.end = moment.utc(this.daterange.end)
      this.picker.datePicker.setStartDate(this.start);
      this.picker.datePicker.setEndDate(this.end);
    })

    this.queryService.change
    .subscribe( () => {
      this.daterange = this.queryService.getSelectionDates()
      this.start = moment.utc(this.daterange.start)
      this.end = moment.utc(this.daterange.end)
      this.picker.datePicker.setStartDate(this.start);
      this.picker.datePicker.setEndDate(this.end);
    })
  }

  private sendDateRange(): void {
    this.queryService.sendSelectedDate(this.daterange);
  }

  public selectedDate(daterangeSel: DateRangeSel):void {
    console.log(daterangeSel)
      this.daterange.start = daterangeSel.start.format('YYYY-MM-DD');
      this.daterange.end = daterangeSel.end.format('YYYY-MM-DD');
      this.daterange.label = daterangeSel.label;
      this.sendDateRange();
  }
}