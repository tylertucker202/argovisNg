import { Component, OnInit } from '@angular/core';
import { QueryGridService } from '../../query-grid.service'

export interface PressureLevels {
  value: number;
}

@Component({
  selector: 'app-pres-slider',
  templateUrl: './pres-slider.component.html',
  styleUrls: ['./pres-slider.component.css'],
})
export class PresSliderComponent implements OnInit {
  private presLevels: PressureLevels[] = [
    {value: 5},
    {value: 10},
    {value: 200}
  ];

  private presArray: number[] = this.presLevels.map(function(x) {return x.value; })


  constructor(private queryGridService: QueryGridService) { }

  private presLevel: number;

  ngOnInit() { 
    this.presLevel = this.queryGridService.getPresLevel()

    this.queryGridService.resetToStart.subscribe((msg) => {
      this.presLevel = this.queryGridService.getPresLevel()
    })
  }

  private incrementLevel(increment: number): void {
    const idx = this.presArray.indexOf(this.presLevel)
    const inc = idx + increment
    console.log('increment', increment, 'idx', idx, 'inc', inc, 'new pres level', this.presLevels[inc].value)
    if( inc >= 0 && inc < this.presLevels.length) {
      this.presLevel = this.presLevels[inc].value
      this.sendPresLevel()
    }

  }

  private sendPresLevel(): void {
    const broadcastChange = true
    if (this.presLevel !== this.queryGridService.getPresLevel()){
      this.queryGridService.sendPresMessage(this.presLevel, broadcastChange)
    }
  } 

  private selChange(newPres: number ): void {
    this.presLevel = newPres
    console.log(this.presLevel)
    this.sendPresLevel();
  }

}
