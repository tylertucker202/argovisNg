import { Component, OnInit} from '@angular/core';
import { QueryService } from '../../services/query.service'
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-double-slider',
  templateUrl: './double-slider.component.html',
  styleUrls: ['./double-slider.component.css'],
  encapsulation: ViewEncapsulation.None //add to set styles as global
})
export class DoubleSliderComponent implements OnInit {

  private config: any;
  private slider: any;
  private sliderRange: number[];
  private lRange: number;
  private uRange: number;

  constructor(private queryService: QueryService) {}

  ngOnInit() {

    this.sliderRange = this.queryService.getPresRange()
    this.lRange = this.sliderRange[0]
    this.uRange = this.sliderRange[1]

    this.config = {
      start: this.sliderRange,
      range: { min: 0, max: 6000 },
      step: 3,
      connect: true,
      orientation: 'vertical'
    }
    const newRange = this.queryService.getPresRange()
    const nRange = [newRange[0].valueOf(), newRange[1].valueOf()]
    this.sliderRange[0] = nRange[0]
    this.sliderRange[1] = nRange[1]

    this.queryService.resetToStart
    .subscribe( () => {
      this.sliderRange = this.queryService.getPresRange()
    })
  }

  private sendSliderRange(broadcastChange=true): void {
    this.queryService.sendPres(this.sliderRange, broadcastChange);
  }

  public minValuechange(newLowPres: number ): void {
    this.lRange = Number(newLowPres).valueOf(); //newLowPres is somehow cast as a string. this converts it to a number.
    this.sliderRange = [this.lRange, this.sliderRange[1]];
    this.sendSliderRange();
  }

  public maxValuechange(newUpPres: number ): void {
    this.uRange = Number(newUpPres).valueOf(); //newUpPres is somehow cast as a string. this converts it to a number.
    this.sliderRange = [this.sliderRange[0], this.uRange];
    this.sendSliderRange();
  }

  public sliderChange(newRange: number[]): void {
    this.lRange = newRange[0]
    this.uRange = newRange[1]
    this.sendSliderRange();
  }

}
