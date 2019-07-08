import { Component, OnInit } from '@angular/core';
import { TopToolbarService } from '../top-toolbar.service'

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

  constructor(private toolbarService: TopToolbarService) { }

  private sidebarOpen: boolean

  ngOnInit() {
    this.sidebarOpen = true //start sidebar as open

    this.toolbarService.drawerToggle.subscribe((toggle: boolean) => {
      const toggleStateChange = this.sidebarOpen ? toggle: toggle
      if (toggleStateChange) {
        this.sidebarOpen = !this.sidebarOpen
      }
    })
  }

  private getSidebarState(): boolean {
    return this.sidebarOpen
  }

}
