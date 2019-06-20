import { Component, OnInit } from '@angular/core';
import { QueryGridService } from '../query-grid.service'

@Component({
  selector: 'app-sidebar-nav-grid',
  templateUrl: './sidebar-nav-grid.component.html',
  styleUrls: ['./sidebar-nav-grid.component.css'],
})
export class SidebarNavGridComponent implements OnInit {

  constructor(private queryGridService: QueryGridService) { }

  ngOnInit() {
  }

  clearGrids(): void {
    console.log('clearProfiles Clicked')
    this.queryGridService.triggerClearLayers();
  }

  resetToStart(): void {
    console.log('resetToStart Clicked')
    this.queryGridService.triggerResetToStart();
  }

}
