import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
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
  
  constructor( private arQueryService: ArQueryService ) { }

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

    this.arQueryService.resetToStart.subscribe( (msg: string) => {
      this.setSliderRange()
    })
  }

  private setSliderRange(): void {
    this.sliderRange = this.arQueryService.getArDateRange()
    console.log('slider range: ', this.sliderRange)
  }

  private updateSelectDates(): void {
    this.arQueryService.sendArDateRange(this.sliderRange)
  }

  private sliderChange(sliderRange: number[]) {
    //triggers when a user stops sliding, when a slider value is changed by 'tap', or on keyboard interaction.
    console.log(sliderRange, this.sliderRange)
    this.sliderRange = sliderRange
    this.updateSelectDates()
  }
}
