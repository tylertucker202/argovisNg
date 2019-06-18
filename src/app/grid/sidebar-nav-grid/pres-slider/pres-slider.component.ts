import { Component, OnInit } from '@angular/core';

export interface PressureLevels {
  value: number;
}

@Component({
  selector: 'app-pres-slider',
  templateUrl: './pres-slider.component.html',
  styleUrls: ['./pres-slider.component.css'],
})
export class PresSliderComponent implements OnInit {
  presLevels: PressureLevels[] = [
    {value: 5},
    {value: 10},
    {value: 200}
  ];

  constructor() { }

  private presLevel: number;

  ngOnInit() { 
    this.presLevel=10
  }

  public selChange(newPres: any ): void {
    this.presLevel = newPres.value
    console.log('sel Change ')
    console.log(newPres.value)
    console.log(this.presLevel)
    //this.sendSliderRange();
  }

}
