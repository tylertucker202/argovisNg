import { Component, OnInit } from '@angular/core';
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
  public presLevel: number;
  public presLevels: number[]
  
  constructor(private queryGridService: QueryGridService,
              private selectGridService: SelectGridService) { }

  ngOnInit() { 
    this.presLevel = this.queryGridService.getPresLevel()
    this.queryGridService.resetToStart.subscribe((msg: string) => {
      this.presLevel = this.queryGridService.getPresLevel()
    })

    this.selectGridService.gridMetaChange.subscribe((gridMeta: GridMeta) => {
      this.presLevels = gridMeta.presLevels
      this.makePressureLevels()
      if (!this.presLevels.includes(this.presLevel)) {
        this.presLevel = this.presLevels[0]
        this.queryGridService.sendPres(this.presLevel, false)
        this.queryGridService.set_url()
      }
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
    const idx = this.presLevels.indexOf(this.presLevel)
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
