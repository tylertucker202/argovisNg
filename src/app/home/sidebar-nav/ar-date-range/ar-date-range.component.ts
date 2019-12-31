import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-ar-date-range',
  templateUrl: './ar-date-range.component.html',
  styleUrls: ['./ar-date-range.component.css'],
  encapsulation: ViewEncapsulation.Emulated //add to set styles as global
})
export class ArDateRangeComponent implements OnInit {
  private config: any;
  private slider: any;
  private sliderRange: number[];
  private lRange: number;
  private uRange: number;
  constructor() { }

  ngOnInit() {

    this.sliderRange = [-18, 18]
    this.lRange = this.sliderRange[0]
    this.uRange = this.sliderRange[1]

    this.config = {
      start: this.sliderRange,
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

}
