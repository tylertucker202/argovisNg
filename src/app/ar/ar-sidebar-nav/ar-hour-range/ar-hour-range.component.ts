import { Component, OnInit} from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { Options } from 'nouislider'
import { ArQueryService } from '../../ar-query.service'

@Component({
  selector: 'app-ar-hour-range',
  templateUrl: './ar-hour-range.component.html',
  styleUrls: ['./ar-hour-range.component.css'],
  encapsulation: ViewEncapsulation.Emulated //add to set styles as global
})
export class ArHourRangeComponent implements OnInit {
  public config: Options;
  public sliderRange: number[];
  public lRange: number;
  public uRange: number;
  constructor( private arQueryService: ArQueryService) {}

  ngOnInit() {

    this.set_slider_range()
    
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
      this.set_slider_range()
    })

  }

  public min_value_change(newLowPres: number ): void {
    this.lRange = Number(newLowPres).valueOf(); //newLowPres is somehow cast as a string. this converts it to a number.
    this.sliderRange = [this.lRange, this.sliderRange[1]];
    this.update_select_dates();
  }

  public max_value_change(newUpPres: number ): void {
    this.uRange = Number(newUpPres).valueOf(); //newUpPres is somehow cast as a string. this converts it to a number.
    this.sliderRange = [this.sliderRange[0], this.uRange];
    this.update_select_dates();
  }

  public set_slider_range(): void {
    this.sliderRange = this.arQueryService.get_ar_date_range()
    this.lRange = this.sliderRange[0]
    this.uRange = this.sliderRange[1]
  }

  public update_select_dates(): void {
    this.arQueryService.send_ar_date_range(this.sliderRange)
  }

  public slider_change(sliderRange: number[]) {
    //triggers when a user stops sliding, when a slider value is changed by 'tap', or on keyboard interaction.
    this.sliderRange = sliderRange
    this.lRange = this.sliderRange[0]
    this.uRange = this.sliderRange[1]
    this.update_select_dates()
  }
}
