import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { DateRange } from './../../../../typeings/daterange'
import { Options } from 'nouislider'
import { QueryService } from '../../services/query.service'
@Component({
  selector: 'app-ar-date-range',
  templateUrl: './ar-date-range.component.html',
  styleUrls: ['./ar-date-range.component.css'],
  encapsulation: ViewEncapsulation.Emulated //add to set styles as global
})
export class ArDateRangeComponent implements OnInit {
  private config: Options;
  private sliderRange: number[];
  private lRange: number;
  private uRange: number;
  constructor( private queryService: QueryService) { }

  ngOnInit() {

    this.sliderRange = this.queryService.getArDateRange()
    this.lRange = this.sliderRange[0]
    this.uRange = this.sliderRange[1]

    this.config = {
      start: this.sliderRange, //binds sliderRange to slider element
      range: { min: -36, max: 36 },
      step: 3,
      connect: true,
      margin: 3,
      direction: 'ltr',
      pips: {
        mode: 'positions',
        values: [0, 25, 50, 75, 100],
        density: 4
      }
    }
  }

  private updateSelectDates(): void {
    let arDate = this.queryService.getArDate()
    console.log('arDate: ', arDate)

    const startDate = arDate.clone().add(this.lRange, 'h').toISOString(false)
    const endDate = arDate.clone().add(this.uRange, 'h').toISOString(false)
    const dateRange: DateRange = {start: startDate, end: endDate, label: ''}
    console.log('dateRange: ', dateRange)
    const broadcastChange = true
    this.queryService.sendSelectedDate(dateRange, broadcastChange)
  }

  private sliderChange() { //triggers when a user stops sliding, when a slider value is changed by 'tap', or on keyboard interaction.
    this.lRange = this.sliderRange[0]
    this.uRange = this.sliderRange[1]
    this.updateSelectDates()
  }
}
