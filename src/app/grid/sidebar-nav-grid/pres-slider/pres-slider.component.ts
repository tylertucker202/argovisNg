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
  presLevels: PressureLevels[] = [
    {value: 5},
    {value: 10},
    {value: 200}
  ];

  constructor(private queryGridService: QueryGridService) { }

  private presLevel: number;

  ngOnInit() { 
    this.presLevel = this.queryGridService.getPresLevel()

    this.queryGridService.resetToStart.subscribe((msg) => {
      this.presLevel = this.queryGridService.getPresLevel()
    })
  }

  private sendPresLevel(): void {
    const broadcastChange = true
    this.queryGridService.sendPresMessage(this.presLevel, broadcastChange)
  } 

  private selChange(newPres: any ): void {
    this.presLevel = newPres.value
    console.log(this.presLevel)
    this.sendPresLevel();
  }

}
