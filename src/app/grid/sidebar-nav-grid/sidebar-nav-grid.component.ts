import { Component, OnInit } from '@angular/core';
import { QueryGridService } from '../query-grid.service'
import * as moment from 'moment'
import { SelectGridService } from '../select-grid.service'
import { GridMeta } from './../../../typeings/grids'

@Component({
  selector: 'app-sidebar-nav-grid',
  templateUrl: './sidebar-nav-grid.component.html',
  styleUrls: ['./sidebar-nav-grid.component.css'],
})
export class SidebarNavGridComponent implements OnInit {

  constructor(private queryGridService: QueryGridService, private selectGridService: SelectGridService) { }
  public interpolateBool: boolean
  public paramMode: boolean
  public monthPicker: boolean = true

  ngOnInit() {

    this.paramMode = this.queryGridService.getParamMode()
    this.interpolateBool = this.queryGridService.getInterplateBool()

    this.queryGridService.urlBuild.subscribe(msg => {
      this.interpolateBool = this.queryGridService.getInterplateBool()
      this.paramMode = this.queryGridService.getParamMode();

      const gridName = this.queryGridService.getGridName()
      if (gridName === 'sose_si_area_3_day') {
        this.monthPicker = false
      }

      this.selectGridService.getGridMeta(gridName).subscribe( (gridMetas: GridMeta[] )=> {
        this.selectGridService.gridMeta = gridMetas[0]
        this.selectGridService.gridChange.emit('grids initalized')
      })
    })
    
    this.queryGridService.change.subscribe(msg => {
      console.log('change msg: ', msg)
      this.paramMode = this.queryGridService.getParamMode();
    })


  }

  public clearGrids(): void {
    this.queryGridService.triggerClearLayers();
  }

  public resetToStart(): void {
    this.queryGridService.triggerResetToStart();
  }

  public interpolateBoolToggle(checked: boolean): void {
    this.interpolateBool = checked
    const broadcastChange = true
    this.queryGridService.sendInterpolateBool(this.interpolateBool, broadcastChange);
  }

  public paramModeToggle(checked: boolean): void {
    this.paramMode = checked
    if (this.paramMode) {
      const broadcastChange = false
      const param = 'anomaly'
      this.queryGridService.sendParam(param, broadcastChange)
    }
    this.queryGridService.sendParamMode(this.paramMode);
  }

}
