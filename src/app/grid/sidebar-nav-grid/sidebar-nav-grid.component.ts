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
  private displayGridParam: boolean
  ngOnInit() {

    this.queryGridService.urlBuild.subscribe(msg => {
      //toggle if states have changed    
      this.globalGrid = this.queryGridService.getGlobalGrid()
      this.displayGridParam = this.queryGridService.getDisplayGridParam();
    })

    
    this.queryGridService.change.subscribe(msg => {
      this.displayGridParam = this.queryGridService.getDisplayGridParam();
    })
  }

  clearGrids(): void {
    console.log('clearProfiles Clicked')
    this.queryGridService.triggerClearLayers();
  }

  resetToStart(): void {
    console.log('resetToStart Clicked')
    this.queryGridService.triggerResetToStart();
  }

  globalGridToggle(checked: boolean): void {
    this.globalGrid = checked
    this.queryGridService.sendGlobalGrid(this.globalGrid);
  }

  displayGridParamToggle(checked: boolean): void {
    this.displayGridParam = checked
    this.queryGridService.sendDisplayGridParamMessage(this.displayGridParam);
  }

}
