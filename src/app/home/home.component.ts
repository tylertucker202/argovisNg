import { Component, OnInit, Output } from '@angular/core';
import { TopToolbarService } from '../top-toolbar.service'
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public toolbarService: TopToolbarService,
              public route: ActivatedRoute) { }

  @Output() sidebarOpen: boolean

  ngOnInit() {

    this.sidebarOpen = true //start sidebar as open

    this.toolbarService.drawerToggle.subscribe((toggle: boolean) => {
      const toggleStateChange = this.sidebarOpen ? toggle: toggle
      if (toggleStateChange) {
        this.sidebarOpen = !this.sidebarOpen
      }
    })
  }

  public getSidebarState(): boolean {
    return this.sidebarOpen
  }

}
