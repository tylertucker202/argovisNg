import { Component, OnInit } from '@angular/core';
import { MapProjectionService } from '../../leaflet-map/map-projection.service'
@Component({
  selector: 'app-map-proj-dropdown-menu',
  templateUrl: './map-proj-dropdown-menu.component.html',
  styleUrls: ['./map-proj-dropdown-menu.component.css']
})
export class MapProjDropdownMenuComponent {

  constructor(private mapProjectionService: MapProjectionService) {}

  mapProjections: string[] = ["Web Mercator", "Southern Stereographic", "Northern Stereographic"];
  selectedMapProjection: string = "Web Mercator";

  GetMapProjection() {
    return this.selectedMapProjection;
  }

  ChangeMapProjection(newProjection: string) {
    this.selectedMapProjection = newProjection;
    this.mapProjectionService.setmProj(this.selectedMapProjection);
  }

}
