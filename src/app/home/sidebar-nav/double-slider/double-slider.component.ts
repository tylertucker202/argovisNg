import { Component, OnInit} from '@angular/core';
import { QueryService } from '../../services/query.service'
import {ViewEncapsulation} from '@angular/core';


@Component({
  selector: 'app-double-slider',
  templateUrl: './double-slider.component.html',
  styleUrls: ['./double-slider.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DoubleSliderComponent implements OnInit {

  private config: any;
  private slider: any;
  private sliderRange: number[];
  private lRange: number;
  private uRange: number;

  constructor(private queryService: QueryService) {
    this.lRange = 0;
    this.uRange = 2000;
    this.sliderRange = [this.lRange, this.uRange];
   }

  ngOnInit() {
    this.config = {
      start: this.sliderRange,
      range: { min: 0, max: 6000 },
      step: 1,
      connect: true,
      orientation: 'vertical'
    }
    const newRange = this.queryService.getPresRange()
    const nRange = [newRange[0].valueOf(), newRange[1].valueOf()]
    this.sliderRange[0] = nRange[0]
    this.sliderRange[1] = nRange[1]

  }

  private sendSliderRange(): void {
    this.queryService.sendPresMessage(this.sliderRange);
  }

  public minValuechange(newLowPres : number ): void {
    this.lRange = newLowPres;
    this.sliderRange = [newLowPres, null];
    this.sendSliderRange();
  }

  public maxValuechange(newUpPres : number ): void {
    this.uRange = newUpPres;
    this.sliderRange = [null, newUpPres];
    this.sendSliderRange();
  }

  public sliderChange(newRange: number[]): void {
    this.lRange = newRange[0]
    this.uRange = newRange[1]
    this.sendSliderRange();
  }

}
