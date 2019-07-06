import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { CovarPoints } from './../../home/models/covar-points'
import { CovarService } from '../covar.service'
import { MapCovarService } from '../map-covar.service'

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import MousePosition from 'ol/control/MousePosition.js';
import { createStringXY } from 'ol/coordinate.js';
import { defaults as defaultControls, } from 'ol/control.js';

import { TileWMS } from 'ol/source.js'

import { toLonLat } from 'ol/proj.js';
import Overlay from 'ol/Overlay';
import {register} from 'ol/proj/proj4.js';
import {get as getProjection} from 'ol/proj.js';
import { getCenter } from 'ol/extent'

import proj4 from 'proj4';
import { PARAMETERS } from '@angular/core/src/util/decorators';


@Component({
  selector: 'app-map-covar',
  templateUrl: './map-covar.component.html',
  styleUrls: ['./map-covar.component.css'],
  encapsulation: ViewEncapsulation.None 
})
export class MapCovarComponent implements OnInit {

  constructor(private covarService: CovarService, 
              private mapCovarService: MapCovarService) { }
  @ViewChild('mouse-position') mousePosition: any;
  @ViewChild('')

  private map: Map;
  private mousePositionControl: MousePosition;
  private proj: string;
  private longCovar: boolean
  private currentCoordinate: number[]

  ngOnInit() {

    this.covarService.readURLParams()

    this.proj = this.covarService.getProj()
    this.longCovar = this.covarService.getForcast()
    this.currentCoordinate = this.covarService.getLngLat()

    this.makeMousePositionControl()

    this.projSetup() //set up projections before creating map

    this.addMap()

    this.addCovarPoints()

    this.clickHandler()

    this.covarService.change
    .subscribe(msg => {
       console.log('query changed: ' + msg);
       this.proj = this.covarService.getProj()
       this.longCovar = this.covarService.getForcast()
       this.removePoints()
       //this.addMockPoints()
       this.addCovarPoints()
       this.covarService.setURL()

       if (msg === 'proj changed') {
         this.projUpdate()
       }
    })

  }

  private projUpdate(): void {
    const newProj = getProjection(this.proj)
    const newProjExtent = newProj.getExtent();
    const newView = new View({
      projection: newProj,
      center: getCenter(newProjExtent || [0, 0, 0, 0]),
      zoom: 3,
      extent: newProjExtent || undefined
    });
    this.map.setView(newView);         
   }    
  

  private projSetup(): void {
    proj4.defs('ESRI:54009', '+proj=moll +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 ' +
        '+units=m +no_defs');
    proj4.defs("EPSG:3031", "+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");
    proj4.defs('EPSG:3413', '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs');
    register(proj4);

    let proj54009 = getProjection('ESRI:54009');
    proj54009.setExtent([-18e6, -9e6, 18e6, 9e6]);
    const halfWidth = 12367396.2185; // To the Equator
    const extent = [-halfWidth, -halfWidth, halfWidth, halfWidth];
    let proj3031 = getProjection('EPSG:3031');
    proj3031.setExtent(extent);
    let proj3413 = getProjection('EPSG:3413');
    proj3413.setExtent(extent);
  }

  private clickHandler(): void {
    const container = document.getElementById('popup');
    const content = document.getElementById('popup-content');
    const closer = document.getElementById('popup-closer');

    const overlay = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });

    this.map.addOverlay(overlay)

    var featureOnClick;
    this.map.on('singleclick', (evt) => {

      featureOnClick = this.map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
        return feature;
      });


      if (featureOnClick) {
        //if content is a shape get prob
        const prob = featureOnClick.getProperties().Probability
        if (prob) {
          overlay.setPosition(evt.coordinate);
          content.innerHTML = "<p>probability float drifted here:</p><code>" + prob +"</code>";
          container.style.display = 'block';
        }
        else {
          overlay.setPosition(evt.coordinate);
          content.innerHTML = "<p>Hi!</p>";
          container.style.display = 'block';          
        }

        //if content is a point, get coords
      }
      else {
        const coordinate = toLonLat(evt.coordinate, this.proj);
        let lng = new Number(coordinate[0].toFixed(2)).valueOf()
        let lat = new Number(coordinate[1].toFixed(2)).valueOf()
        this.currentCoordinate = [lng, lat ]
        this.covarService.sendLngLat(this.currentCoordinate)
        this.removePoints()
        //this.addMockPoints()
        this.addCovarPoints()
      }

      });

    closer.onclick = function () {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };
  }

  private addMap(): void {
    let layers = {}
    // layers['osm'] = new TileLayer({
    //   source: new OSM()
    // });

    layers['wms4326'] = new TileLayer({
      source: new TileWMS({
        url: 'https://ahocevar.com/geoserver/wms',
        crossOrigin: '',
        params: {
          'LAYERS': 'ne:NE1_HR_LC_SR_W_DR',
          'TILED': true
        },
        projection: 'EPSG:4326'
      })
    });

    this.map = new Map({
      controls: defaultControls().extend([this.mousePositionControl]),
      layers: Object.values(layers),
      target: 'map',
      view: new View({
        projection: this.proj,
        center: [0, 0],
        zoom: 2
      })
    });


  }

  private removePoints(): void {
    let layersToRemove = []
    this.map.getLayers().forEach( function(layer) {
      const layerName = layer.get('name')
      if (layerName != undefined && layerName === 'grid' || layerName === 'float') {
        layersToRemove.push(layer)
      }
    })

    const len = layersToRemove.length;
    for(let i = 0; i < len; i++) {
        this.map.removeLayer(layersToRemove[i]);
    }
  };

  private addCovarField(covarPoints: CovarPoints): void {
    let features = covarPoints.features;
    let geoLocation = covarPoints.geoLocation;

    const floatLayer = this.mapCovarService.makeFloatPoint(geoLocation.coordinates, this.proj)

    const gridLayer = this.mapCovarService.makeCovarPolygons(features, this.proj)

    this.map.addLayer(gridLayer);
    this.map.addLayer(floatLayer);

    //const grid = gridLayer.getSource()
    //this.map.getView().fit(grid.getExtent())
  }

  private addCovarPoints(): void {
    if (this.currentCoordinate) {
      const [lng, lat] = this.currentCoordinate
      this.mapCovarService.getCovarPoints(lng, lat, this.longCovar)
      .subscribe( (covarPoints: CovarPoints) => {
        if (covarPoints) {
          this.addCovarField(covarPoints)
        }
        else {
          console.log('warning: no points')
        }
        },
        error => {
          console.log('error in getting points' )
        })
    }
  }

  private addMockPoints(): void {

    this.mapCovarService.getMockCovarPoints()
    .subscribe( (covarPoints: CovarPoints) => {
      if (covarPoints) {
        this.addCovarField(covarPoints)
      }
      else {
        console.log('warning: no points')
      }
      },
      error => {
        console.log('error in getting mock points' )
      })
  }

  private makeMousePositionControl(): void {
    this.mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(1),
      projection: 'EPSG:4326',
      className:  'ol-mouse-position',
      target: this.mousePosition,
      undefinedHTML: '&nbsp;'
    });    
  }

}
