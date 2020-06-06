import { Component, OnInit } from '@angular/core';
import { QueryGridService } from '../query-grid.service'

@Component({
  selector: 'app-sidebar-nav-grid',
  templateUrl: './sidebar-nav-grid.component.html',
  styleUrls: ['./sidebar-nav-grid.component.css'],
})
export class SidebarNavGridComponent implements OnInit {

  constructor(private queryGridService: QueryGridService) { }
  public interpolateBool: boolean
  public paramMode: boolean
  ngOnInit() {

    this.paramMode = this.queryGridService.getParamMode()
    this.interpolateBool = this.queryGridService.getInterplateBool()

    this.queryGridService.urlBuild.subscribe(msg => {
      this.interpolateBool = this.queryGridService.getInterplateBool()
      this.paramMode = this.queryGridService.getParamMode();
    })
    
    this.queryGridService.change.subscribe(msg => {
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
