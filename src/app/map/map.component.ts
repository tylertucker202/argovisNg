import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MapProjectionService } from '../leaflet-map/map-projection.service';
import { MapService } from '../map.service';
import * as L from "leaflet";
//import * as L from "./../../../node_modules/leaflet/dist/leaflet.js";
//import '../../../node_modules/leaflet-draw/dist/leaflet.draw.js';
//import '../../../node_modules/leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.src.js';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit, OnDestroy {
  @Input() mProj: string;
  public map: L.Map;
  public drawnItems: any;
  public constructor(public mapProjectionService: MapProjectionService, 
                     public mapService: MapService) {}

  ngOnInit() {
    console.log('im in leaflet-map.component');
    console.log('mProj currently is:');
    console.log(this.mProj);
    //this.map = this.mapService.map;
    this.generateMap();

    this.map.on('draw:created', (event: L.DrawEvents.Created) => {
      var layer = event.layer;
      this.mapService.popupWindowCreation(layer, this.drawnItems);
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
        //this.createSouthernStereographic();
        this.createWebMercator();
        break;
      }
      case 'Northern Stereographic': {
        console.log('generating north stereo');
        //this.createNorthernStereographic();
        this.createWebMercator();
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

    this.drawnItems = L.featureGroup();
    var drawOptions = {
      position: 'topleft',
      draw: {
          polygon: {
              allowIntersection: <false> false,
              shapeOptions: {
                  color: '#983fb2',
                  weight: 4
              },
          },
          rectangle: {
              shapeOptions: {
                  color: '#983fb2',
                  weight: 4
              },
          },
          polyline: <false> false,
          lineString: <false> false,
          marker: <false> false,
          circlemarker: <false> false, 
          circle: <false> false
      },
      edit: {
        featureGroup: this.drawnItems,
        polygon: {
            allowIntersection: <false> false
        }
    },
  }
    this.drawnItems.addTo(this.map);
    var drawControl = new L.Control.Draw(drawOptions);
    L.control.layers(this.mapService.baseMaps).addTo(this.map);

    L.control.scale().addTo(this.map);
    drawControl.addTo(this.map);

    L.control.coordinates({
      position:"topright",
      useDMS:true,
      labelTemplateLat:"N {y}",
      labelTemplateLng:"E {x}",
      decimals:2,})
    .addTo(this.map);

    this.mapService.map = this.map;
    this.invalidateSize();
  }

  
  private createSouthernStereographic(this) {};

  private createNorthernStereographic(this) {};

}
