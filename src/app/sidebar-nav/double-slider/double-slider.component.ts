import { Component, OnInit, Input, Output, ViewChild, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-double-slider',
  templateUrl: './double-slider.component.html',
  styleUrls: ['./double-slider.component.css']
})
export class DoubleSliderComponent implements OnInit {

  private config: any;
  constructor() { }

  ngOnInit() {
    this.config = {
      start: [0, 2000],
      range: { min: 0, max: 6000 },
      step: 1,
      connect: true,
      orientation: 'vertical'
    }
  }

}
