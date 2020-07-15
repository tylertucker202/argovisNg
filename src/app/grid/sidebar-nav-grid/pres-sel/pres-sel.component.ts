import { Component, OnInit, Input } from '@angular/core';
import { QueryGridService } from '../../query-grid.service'
import { GridMeta } from '../../../../typeings/grids'
import { SelectGridService } from '../../select-grid.service';

export interface PressureLevels {
  value: number;
}

@Component({
  selector: 'app-pres-sel',
  templateUrl: './pres-sel.component.html',
  styleUrls: ['./pres-sel.component.css'],
})
export class PresSelComponent implements OnInit {
  public presLevelsDisplay: PressureLevels[]
  public presArray: number[]
  public presLevel: number;
  @Input() presLevels: number[]
  
  constructor(private queryGridService: QueryGridService,
              private selectGridService: SelectGridService) { }

  ngOnInit() { 
    this.presLevel = this.queryGridService.getPresLevel()
    this.makePressureLevels()
    this.queryGridService.resetToStart.subscribe((msg) => {
      this.presLevel = this.queryGridService.getPresLevel()
    })
  }

  public makePressureLevels(): void {
    let presLevelsDisplay = []
    this.presLevels.forEach(pres => {
      presLevelsDisplay.push({value: pres})
    });
    this.presLevelsDisplay = presLevelsDisplay
  }

  public incrementLevel(increment: number): void {
    const idx = this.presArray.indexOf(this.presLevel)
    const inc = idx + increment
    if( inc >= 0 && inc < this.presLevelsDisplay.length) {
      this.presLevel = this.presLevelsDisplay[inc].value
      this.sendPresLevel()
    }

  }

  public sendPresLevel(): void {
    const broadcastChange = true
    if (this.presLevel !== this.queryGridService.getPresLevel()){
      this.queryGridService.sendPres(this.presLevel, broadcastChange)
    }
  } 

  public selChange(newPres: number ): void {
    this.presLevel = newPres
    console.log(this.presLevel)
    this.sendPresLevel();
  }

}
