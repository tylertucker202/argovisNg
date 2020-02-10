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
      {name: "AR", viewValue: "Atmospheric River", link: "https://argovis.colorado.edu/ng/ar", tooltip: 'link to AR page'},
      {name: "Grids", viewValue: "Gridded Products", link: "https://argovis.colorado.edu/ng/grid", tooltip: 'link to gridded page'},
      {name: "GridsOld", viewValue: "Gridded Products (old)", link: "http://www.argo.ucsd.edu/Argovis/Argovis_Tutorials.html", tooltip: 'link to old gridded page page'},
      {name: "Covar", viewValue: "Float Trajectory Forcast", link: "https://argovis.colorado.edu/ng/covar", tooltip: 'link to float trajectory forcast page'}
    ]
  }

  private sidebarMenuToggle(): void {
    this.toolbarService.drawerToggle.emit(true)
  }



}
