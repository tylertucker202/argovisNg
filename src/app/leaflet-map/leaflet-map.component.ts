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
  layersControl = {
    baseLayers: {},
  };
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

  ngOnInit() {
    console.log('im in leaflet-map.component');
    console.log('mProj starts as:')
    console.log(this.mProj);
    this.generateMap();
    this.mapProjectionService.change.subscribe(mProj => {
      this.mProj = mProj;
      this.generateMap();
    });
  }

  private generateMap(this) {
    switch(this.mProj) {
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

  private createWebMercator(this) {
    this.layersControl = {
      baseLayers: {
        'Esri World Imagery ': this.satelliteMap,
        'Google': this.googleMap, 
        'Ocean Basemap': this.Esri_OceanBasemap,
      },
    };

    this.options = {
      layers: [this.Esri_OceanBasemap],
      zoom: 3,
      maxBounds: [[-180, -270], [180,270]],
      center: latLng([ 46.879966, -121.726909 ]),
    };
  }
  
  private createSouthernStereographic(this) {
    this.layersControl = {
      baseLayers: {
        'Esri World Imagery ': this.satelliteMap,
        'watercolor': this.watercolor, 
      },
    };

    this.options = {
      layers: [this.watercolor],
      zoom: 3,
      maxBounds: [[-180, -270], [180,270]],
      center: latLng([ 46.879966, -121.726909 ]),
    };

  }

  private createNorthernStereographic(this) {}

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
    }
  }

    onMapReady(map: Map) {
        /*
        //stereographic projection
        //var map = L.map('map', {maxZoom: 13, minZoom: 1, maxBounds: [[-180, -270], [180,270]]}).setView([0,0], 2);
        var satelliteMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                                    {attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        });
        var googleMap = L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}',
                                    {attribution: 'google'
        });
        var watercolor = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}',
                                    {attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                                     subdomains: 'abcd',
        });
        var Esri_OceanBasemap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}',
                                    {attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
        });

        L.control.layers({
            'Esri World Imagery ': satelliteMap.addTo(map),
            'Google': googleMap.addTo(map), 
            'Ocean basemap': Esri_OceanBasemap.addTo(map),
            },
            { 'draw layer': this.drawnItems },
            { position: 'topleft', collapsed: false }
        ).addTo(map);
        */
      
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
