import { Component, Input, OnInit } from '@angular/core';
import { MapProjectionService } from '../leaflet-map/map-projection.service';
import { MapService } from '../map.service';
import * as L from "leaflet";
import '../../../node_modules/leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.src.js';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent {
  public constructor(private mapProjectionService: MapProjectionService, 
  private mapService: MapService) {}
  public map: any;

  ngOnInit() {
    console.log('im in leaflet-map.component');
    console.log('mProj starts as:');
    console.log(this.mapService.mProj);
    this.generateMap();
    this.mapProjectionService.change.subscribe(mProj => {
      delete this.mapService.map;
      delete this.map;
      this.mapService.mProj = mProj;
      this.generateMap();
    });
  }

  private generateMap(this) {
    switch(this.mapService.mProj) {
      case 'Web Mercator': {
        console.log('generating web mercator');
        this.createWebMercator();
        break;
      }
      case 'Southern Stereographic': {
        console.log('generating south stereo');
        this.createSouthernStereographic();
        break;
      }
      case 'Northern Stereographic': {
        console.log('generating north stereo');
        this.createNorthernStereographic();
        break;
      }
      default: {
        console.log('proj not found, using web mercator')
        this.createWebMercator();
        break;
      }
    }
  }

  public createWebMercator(this) {
    this.map = L.map('map', {maxZoom: 13, minZoom: 1, maxBounds: [[-180, -270], [180,270]]}).setView([ 46.879966, -121.726909 ], 2);
    var drawnItems = L.featureGroup().addTo(this.map);
    L.control.layers({
      'Esri World Imagery ': this.mapService.satelliteMap,
      'Google': this.mapService.googleMap, 
      'Ocean basemap': this.mapService.esri_OceanBasemap,
      },
      { },
      { position: 'topleft', collapsed: false }
      ).addTo(this.map);

    L.control.zoom({ position: "topright" }).addTo(this.map);
    L.control.layers(this.mapService.baseMaps).addTo(this.map);
    L.control.scale().addTo(this.map);

    L.control.coordinates({
      position:"topright",
      //labelTemplateLat:"Latitude: {y}",
      //labelTemplateLng:"Longitude: {x}",
      useDMS:true,
      labelTemplateLat:"N {y}",
      labelTemplateLng:"E {x}",
      decimals:2,}).addTo(this.map);

    this.mapService.map = this.map;
  }
  
  private createSouthernStereographic(this) {}

  private createNorthernStereographic(this) {}

}
