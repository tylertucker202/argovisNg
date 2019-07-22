import { Component, OnInit } from '@angular/core';
import { TopToolbarService } from './../top-toolbar.service'


@Component({
  selector: 'app-top-toolbar',
  templateUrl: './top-toolbar.component.html',
  styleUrls: ['./top-toolbar.component.css']
})
export class TopToolbarComponent implements OnInit {

  constructor(private toolbarService: TopToolbarService) { }

  
  ngOnInit() {
  }

  private sidebarMenuToggle(): void {
    this.toolbarService.drawerToggle.emit(true)
  }



}
