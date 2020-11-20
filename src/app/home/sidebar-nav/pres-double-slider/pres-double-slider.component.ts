import { Component, OnInit} from '@angular/core';
import { QueryService } from '../../services/query.service'
import { ViewEncapsulation } from '@angular/core';
import { Options } from 'nouislider'

@Component({
  selector: 'app-pres-double-slider',
  templateUrl: './pres-double-slider.component.html',
  styleUrls: ['./pres-double-slider.component.css'],
  encapsulation: ViewEncapsulation.None //add to set styles as global
})
export class PresDoubleSliderComponent implements OnInit {

  public config: Options;
  public sliderRange: [number, number];
  public lRange: number;
  public uRange: number;

  constructor(private queryService: QueryService) {}

  ngOnInit() {

    this.sliderRange = this.queryService.get_pres_range()
    this.lRange = this.sliderRange[0]
    this.uRange = this.sliderRange[1]

    this.config = {
      start: this.sliderRange,
      range: { min: 0, max: 6000 },
      step: 3,
      connect: true,
      orientation: 'horizontal'
    }
    const newRange = this.queryService.get_pres_range()
    const nRange = [newRange[0].valueOf(), newRange[1].valueOf()]
    this.sliderRange[0] = nRange[0]
    this.sliderRange[1] = nRange[1]

    this.queryService.resetToStart
    .subscribe( () => {
      this.sliderRange = this.queryService.get_pres_range()
    })
  }

  public send_slider_range(broadcastChange=true): void {
    this.queryService.send_pres(this.sliderRange, broadcastChange);
  }

  public min_value_change(newLowPres: number ): void {
    this.lRange = Number(newLowPres).valueOf(); //newLowPres is somehow cast as a string. this converts it to a number.
    this.sliderRange = [this.lRange, this.sliderRange[1]];
    this.send_slider_range();
  }

  public max_value_change(newUpPres: number ): void {
    this.uRange = Number(newUpPres).valueOf(); //newUpPres is somehow cast as a string. this converts it to a number.
    this.sliderRange = [this.sliderRange[0], this.uRange];
    this.send_slider_range();
  }

  public slider_change(newRange: number[]): void { //triggers when a user stops sliding, when a slider value is changed by 'tap', or on keyboard interaction.
    this.lRange = newRange[0]
    this.uRange = newRange[1]
    this.send_slider_range();
  }

}
