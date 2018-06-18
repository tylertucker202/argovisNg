import { Component, Input } from '@angular/core';
import { MapProjectionService } from './map-projection.service';
import { icon, latLng, Map, marker, point, polyline, tileLayer, featureGroup, control } from 'leaflet';
import * as L from 'leaflet';
import '../../../node_modules/leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.src.js';


@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.css'],
  })

export class LeafletMapComponent {
  public mProj = 'Web Mercator'
  public constructor(private mapProjectionService: MapProjectionService) {}


  ngOnInit() {
    console.log('im in leaflet-map.component');
    console.log('mProj starts as:')
    console.log(this.mProj);
    this.mapProjectionService.change.subscribe(mProj => {
      this.mProj = mProj;
      console.log('im in leaflet-map.component');
      console.log('a change occured');
      console.log(this.mProj);
    });
  }

  private createWebMercator() {}
  private createSouthernStereographic() {}
  private createNorthernStereographic() {}

  satelliteMap = tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    });
  googleMap = tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}',
    {attribution: 'google'
  });
  watercolor = tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}',
    {attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
  });
  Esri_OceanBasemap = tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}',
    {attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
  });

  layersControl = {
    baseLayers: {
      'Esri World Imagery ': this.satelliteMap,
      'Google': this.googleMap, 
      'Ocean Basemap': this.Esri_OceanBasemap,
    },
  };

  options = {
    layers: [this.Esri_OceanBasemap],
    zoom: 3,
    maxBounds: [[-180, -270], [180,270]],
    center: latLng([ 46.879966, -121.726909 ]),
  };

  drawnItems = featureGroup();

  drawOptions = {
    edit: {
        featureGroup: this.drawnItems,
        poly: {
            allowIntersection: false
        }
    },
    draw: {
        polygon: {
            allowIntersection: false,
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
        polyline: false,
        lineString: false,
        marker: false,
        circlemarker: false, 
        circle: false
    }}
  
    onMapReady(map: Map) {
      this.drawnItems.addTo(map);
      control.layers(this.layersControl.baseLayers, null, {position: 'topleft'}).addTo(map)
      L.control.coordinates({
        position:"topright",
        //labelTemplateLat:"Latitude: {y}",
        //labelTemplateLng:"Longitude: {x}",
        useDMS:true,
        labelTemplateLat:"N {y}",
        labelTemplateLng:"E {x}",
        decimals:2,}).addTo(map);
    }
}
