import { Component, OnInit} from '@angular/core';
import { QueryService } from '../../query.service'

@Component({
  selector: 'app-double-slider',
  templateUrl: './double-slider.component.html',
  styleUrls: ['./double-slider.component.css']
})
export class DoubleSliderComponent implements OnInit {

  private config: any;
  private slider: any;
  private sliderRange: Number[];
  private lRange: Number;
  private uRange: Number;
  //@ViewChild('slider') slider: NouisliderModule;


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
    },

    this.sendSliderRange()
  }

  private sendSliderRange(): void {
    this.queryService.sendPresMessage(this.sliderRange);
  }

  public minValuechange(newLowPres : Number ): void {
    this.lRange = Number(newLowPres);
    this.sliderRange = [newLowPres, null];
  }

  public maxValuechange(newUpPres : Number ): void {
    this.uRange = Number(newUpPres);
    this.sliderRange = [null, newUpPres];
  }

  public onChange(newRange: Number[]): void {
    this.lRange = newRange[0]
    this.uRange = newRange[1]
    this.sendSliderRange();
  }

}
