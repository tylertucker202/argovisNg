import { Component, OnInit} from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { Options } from 'nouislider'
import { TcQueryService } from '../../tc-query.service'

@Component({
  selector: 'app-tc-hour-range',
  templateUrl: './tc-hour-range.component.html',
  styleUrls: ['./tc-hour-range.component.css'],
  encapsulation: ViewEncapsulation.Emulated //add to set styles as global
})
export class TcHourRangeComponent implements OnInit {
  public config: Options;
  public sliderRange: [number, number];
  public lRange: number;
  public uRange: number;
  constructor( private tcQueryService: TcQueryService) {}

  ngOnInit() {

    this.setSliderRange()
    
    this.config = {
      start: this.sliderRange, //binds sliderRange to slider element
      range: { min: -72, max: 72 },
      step: 6,
      connect: false,
      margin: 0,
      direction: 'ltr',
      pips: {
        mode: 'positions',
        values: [0, 25, 50, 75, 100],
        density: 4
      }
    }

    this.tcQueryService.resetToStart.subscribe( (msg: string) => {
      this.setSliderRange()
    })

  }

  public minValuechange(newLowPres: number ): void {
    this.lRange = Number(newLowPres).valueOf(); //newLowPres is somehow cast as a string. this converts it to a number.
    this.sliderRange = [this.lRange, this.sliderRange[1]];
    this.updateHourRange();
  }

  public maxValuechange(newUpPres: number ): void {
    this.uRange = Number(newUpPres).valueOf(); //newUpPres is somehow cast as a string. this converts it to a number.
    this.sliderRange = [this.sliderRange[0], this.uRange];
    this.updateHourRange();
  }

  public setSliderRange(): void {
    this.sliderRange = this.tcQueryService.get_prof_hour_range() as [number, number]
    this.lRange = this.sliderRange[0]
    this.uRange = this.sliderRange[1]
  }

  public updateHourRange(): void {
    this.tcQueryService.send_prof_date_range(this.sliderRange, true, 'slider change')
  }

  public sliderChange(sliderRange: [number, number]) {
    //triggers when a user stops sliding, when a slider value is changed by 'tap', or on keyboard interaction.
    this.sliderRange = sliderRange
    this.lRange = this.sliderRange[0]
    this.uRange = this.sliderRange[1]
    this.updateHourRange()
  }
}
