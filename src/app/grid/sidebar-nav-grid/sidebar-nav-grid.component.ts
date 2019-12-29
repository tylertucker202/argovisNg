import { Component, OnInit } from '@angular/core';
import { QueryGridService } from '../query-grid.service'

@Component({
  selector: 'app-sidebar-nav-grid',
  templateUrl: './sidebar-nav-grid.component.html',
  styleUrls: ['./sidebar-nav-grid.component.css'],
})
export class SidebarNavGridComponent implements OnInit {

  constructor(private queryGridService: QueryGridService) { }
  private globalGrid: boolean
  private paramMode: boolean
  ngOnInit() {

    this.paramMode = this.queryGridService.getParamMode()
    this.globalGrid = this.queryGridService.getGlobalGrid()

    this.queryGridService.urlBuild.subscribe(msg => {
      this.globalGrid = this.queryGridService.getGlobalGrid()
      this.paramMode = this.queryGridService.getParamMode();
    })
    
    this.queryGridService.change.subscribe(msg => {
      this.paramMode = this.queryGridService.getParamMode();
    })
  }

  private clearGrids(): void {
    this.queryGridService.triggerClearLayers();
  }

  private resetToStart(): void {
    this.queryGridService.triggerResetToStart();
  }

  private globalGridToggle(checked: boolean): void {
    this.globalGrid = checked
    const broadcastChange = true
    this.queryGridService.sendGlobalGrid(this.globalGrid, broadcastChange);
  }

  private paramModeToggle(checked: boolean): void {
    this.paramMode = checked
    if (this.paramMode) {
      const broadcastChange = false
      const param = 'anomaly'
      this.queryGridService.sendParam(param, broadcastChange)
    }
    this.queryGridService.sendParamMode(this.paramMode);
  }

}
