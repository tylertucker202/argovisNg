import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { DateRange } from '../../../../typeings/daterange'
import { Options } from 'nouislider'
import { ArQueryService } from './../../ar-query.service'
import * as moment from 'moment';

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
  constructor( private ArQueryService: ArQueryService) { }

  ngOnInit() {

    this.setSliderRange()

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

    this.ArQueryService.resetToStart.subscribe( (msg: string) => {
      this.setSliderRange()
    })
  }

  private setSliderRange(): void {
    this.sliderRange = this.ArQueryService.getArDateRange()
    this.lRange = this.sliderRange[0]
    this.uRange = this.sliderRange[1]    
  }

  private formatDate(date: moment.Moment): string {
    return date.format("YYYY-MM-DDTHH:mm:ss") + 'Z'
  }

  private updateSelectDates(): void {
    this.ArQueryService.sendArDateRange(this.sliderRange)
    let arDate = this.ArQueryService.getArDate()
    const startDate = this.formatDate(arDate.clone().add(this.lRange, 'h'))
    const endDate = this.formatDate(arDate.clone().add(this.uRange, 'h'))
    const dateRange: DateRange = {startDate: startDate, endDate: endDate, label: ''}
    const broadcastChange = true
    this.ArQueryService.sendSelectedDate(dateRange, broadcastChange)
    this.ArQueryService.setURL()
  }

  private sliderChange() { //triggers when a user stops sliding, when a slider value is changed by 'tap', or on keyboard interaction.
    this.lRange = this.sliderRange[0]
    this.uRange = this.sliderRange[1]
    this.updateSelectDates()
  }
}
