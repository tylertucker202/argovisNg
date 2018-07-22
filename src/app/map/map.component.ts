import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MapService } from '../map.service';
import * as L from "leaflet";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit, OnDestroy {
  @Input() mProj: string;
  public map: L.Map;
  public constructor(public mapService: MapService) {}

  ngOnInit() {
    console.log('im in leaflet-map.component');
    console.log('mProj currently is:');
    console.log(this.mProj);
    this.generateMap();
    this.mapService.coordDisplay.addTo(this.map);
    this.mapService.drawnItems.addTo(this.map);
    this.mapService.scaleDisplay.addTo(this.map);
    this.mapService.drawControl.addTo(this.map);
    this.mapService.map = this.map;
    this.invalidateSize();
    this.map.on('draw:created', (event: L.DrawEvents.Created) => {
      var layer = event.layer;
      this.mapService.popupWindowCreation(layer, this.mapService.drawnItems);
    });
  }

  ngOnDestroy() {
      if (this.map != undefined) { 
        this.map.remove();
       }
  }

  public generateMap(this) {
    switch(this.mProj) {
      case 'Web Mercator': {
        console.log('generating web mercator');
        this.createWebMercator();
        break;
      }
      case 'Southern Stereographic': {
        console.log('generating south stereo');
        this.createSouthernStereographic();
        //this.createWebMercator();
        break;
      }
      case 'Northern Stereographic': {
        console.log('generating north stereo');
        this.createNorthernStereographic();
        //this.createWebMercator();
        break;
      }
      default: {
        console.log('proj not found, using web mercator')
        this.createWebMercator();
        break;
      }
    }
  }

  public invalidateSize(this) {
    if (this.map) {
      setTimeout(() => {
        console.log('inside setTimeout');
        this.mapService.map.invalidateSize(true);
        this.map.invalidateSize(true);
      },100);
    }
  }

  public createWebMercator(this) {
    this.map = L.map('map',
                     {maxZoom: 13,
                      minZoom: 1,
                      maxBounds: [[-180, -270], [180,270]],
                      layers: [this.mapService.baseMaps.ocean]})
                      .setView([ 46.88, -121.73 ], 2, );
    L.control.layers(this.mapService.baseMaps).addTo(this.map);
  }

  
  private createSouthernStereographic(this) {
    this.map = L.map('map',
                    {maxZoom: 13,
                     minZoom: 1,
                     maxBounds: [[-180, -540], [180,540]],
                     crs: this.mapService.sStereo})
                     .setView([-89,.1], 4);
    // var geojsonLayer = new L.GeoJSON.AJAX("../images/world-countries.json");       
    this.mapService.geojsonLayer.addTo(this.map);

    // L.control.layers(
    //     { 'draw layer': this.drawnItems },
    //     { position: 'topleft', collapsed: false }
    // ).addTo(map);
  };

  private createNorthernStereographic(this) {
    this.map = L.map('map',
                    {maxZoom: 13,
                     minZoom: 1,
                     maxBounds: [[-180, -540], [180,540]],
                     crs: this.mapService.nStereo})
                     .setView([89,.1], 4);
    this.mapService.geojsonLayer.addTo(this.map);
  };

}
