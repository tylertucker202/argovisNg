import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-map-proj-dropdown-menu',
  templateUrl: './map-proj-dropdown-menu.component.html',
  styleUrls: ['./map-proj-dropdown-menu.component.css']
})
export class MapProjDropdownMenuComponent {

  constructor() {}

  mapProjections: string[] = ["Web Mercator", "Southern Stereographic", "Northern Stereographic"];
  selectedMapProjection: string = "Web Mercator";

  GetMapProjection() {
    return this.selectedMapProjection;
  }

  ChangeMapProjection(newProjection: string) {
    this.selectedMapProjection = newProjection;
  }

}
