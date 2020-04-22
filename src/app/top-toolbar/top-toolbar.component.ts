import { Component, OnInit } from '@angular/core';
import { TopToolbarService } from './../top-toolbar.service'

export interface arModule {
  name: string,
  viewValue: string, 
  link: string, 
  tooltip: string
}
@Component({
  selector: 'app-top-toolbar',
  templateUrl: './top-toolbar.component.html',
  styleUrls: ['./top-toolbar.component.css']
})
export class TopToolbarComponent implements OnInit {

  private avModules: arModule[];

  constructor(private toolbarService: TopToolbarService) { }

  
  ngOnInit() {
    this.avModules = [
      {name: "AR", viewValue: "Atmospheric River (Beta)", link: "/ng/ar", tooltip: 'link to AR page (Beta)'},
      {name: "Grids", viewValue: "Gridded Products (Beta)", link: "/ng/grid", tooltip: 'link to gridded page (Beta)'},
      {name: "GridsOld", viewValue: "Gridded Products (old)", link: "http://www.argo.ucsd.edu/Gridded_Argovis.html", tooltip: 'link to old gridded page page'},
      {name: "Covar", viewValue: "Float Trajectory Forcast", link: "/ng/covar", tooltip: 'link to float trajectory forcast page'}
    ]
  }

  private sidebarMenuToggle(): void {
    this.toolbarService.drawerToggle.emit(true)
  }



}
