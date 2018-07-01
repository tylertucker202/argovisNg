import { Component, OnInit } from '@angular/core';
import { MapProjectionService } from '../leaflet-map/map-projection.service'

@Component({
  selector: 'app-map-tabs',
  templateUrl: './map-tabs.component.html',
  styleUrls: ['./map-tabs.component.css']
})
export class MapTabsComponent implements OnInit {

  changeProj(evt: any) {
    console.log("tab change");
    console.log(evt.nextId); //clicked tab is the nextId.
    //this.mapProjectionService.setmProj(evt.nextId);
  }
  constructor(private mapProjectionService: MapProjectionService) { }

  ngOnInit() {
  }

}
