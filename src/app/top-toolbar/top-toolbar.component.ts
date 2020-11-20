import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TopToolbarService } from './../top-toolbar.service'
import { Router } from '@angular/router';
import { Location } from '@angular/common';

export interface avModule {
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

export class TopToolbarComponent implements OnInit, AfterViewInit {

  public avModules: avModule[];
  public href: string = "";
  public currentModule: string;
  constructor(private toolbarService: TopToolbarService, private location: Location, private router: Router) { 
  }

  ngOnInit() {
    this.avModules = [
      {name: "Home", viewValue: "Home (Argo profiles)", link: "/ng/home", tooltip: "link to Argovis home page"},
      {name: "AR", viewValue: "Atmospheric River (Beta)", link: "/ng/ar", tooltip: 'link to AR page (Beta)'},
      {name: "Grids", viewValue: "Gridded Products (Beta)", link: "/ng/grid", tooltip: 'link to gridded page (Beta)'},
      {name: "GridsOld", viewValue: "Gridded Products (old)", link: "https://argovis.colorado.edu/docs/Gridded_Argovis.html ", tooltip: 'link to old gridded page page'},
      {name: "Covar", viewValue: "Float Trajectory Forecast", link: "/ng/covar", tooltip: 'link to float trajectory forcast page'}
    ]
  }

  ngAfterViewInit() {
    this.router.events.subscribe((val) => {
      if(this.location.path() != ''){
        this.href = this.location.path();
      } else {
        this.href = 'ng/home'
      }
      this.set_current_module_text() 
    })
  }

  public set_current_module_text() {
    let currentModuleLink: string
    if (this.href.includes('?')) {
      currentModuleLink = this.href.substring(0, this.href.indexOf("?")); 
    }
    else {
      currentModuleLink = this.href
    }

    for (let idx=0; idx<this.avModules.length; ++idx) {
      const modL = this.avModules[idx]['link']
      if (modL === currentModuleLink) {
        this.currentModule = "Current viewer: " + this.avModules[idx]['viewValue']
        break
      }
    }
  }

  public go_to_home(): void {
    const url = '/ng/home'
    location.href = url;
  }

  public go_to_api_docs(): void {
    const url = '/api-docs'
    location.href = url;
  }



}
