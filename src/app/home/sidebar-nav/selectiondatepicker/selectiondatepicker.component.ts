import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import * as moment from 'moment';
import { QueryService } from '../../services/query.service'
import { DateRange, DateRangeSel } from '../../../../typeings/daterange';
@Component({
  selector: 'app-selectiondatepicker',
  templateUrl: './selectiondatepicker.component.html',
  styleUrls: ['./selectiondatepicker.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SelectionDatePicker {
  constructor(private queryService: QueryService) {}
  public daterange: DateRange
  public selected: DateRangeSel
  public options: any;

  ngOnInit() {
    this.daterange = this.queryService.getSelectionDates()
    this.selected = this.convertToMoment(this.daterange)
    this.options = {
                    locale: { format: 'MM/DD/YYYY' },
                    alwaysShowCalendars: true,
                    minDate: "01/01/1997",
                    ranges: {
                      //'Today': [moment(), moment()],
                      'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                      //'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                      'This Month': [moment().startOf('month'), moment().endOf('month')],
                      //'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                      },
                    };

    this.queryService.resetToStart
    .subscribe( () => {
      this.daterange = this.queryService.getSelectionDates()
      this.selected = this.convertToMoment(this.daterange)
    })

    this.queryService.change
    .subscribe( () => {
      this.daterange = this.queryService.getSelectionDates()
      this.selected = this.convertToMoment(this.daterange)
    })
  }

  public sendDateRange(): void {
    this.queryService.send_selected_date(this.daterange);
  }

  public convertToMoment(daterange: DateRange): DateRangeSel {
    const select = {startDate: moment.utc(daterange.startDate), endDate: moment.utc(daterange.endDate)}
    return select
  }

  public selectedDate(daterangeSel: DateRangeSel):void {
    if (daterangeSel.startDate) {
      this.daterange.startDate = daterangeSel.startDate.format('YYYY-MM-DD');
      this.daterange.endDate = daterangeSel.endDate.format('YYYY-MM-DD');
      this.sendDateRange();
    }
  }
}