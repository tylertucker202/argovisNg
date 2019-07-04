import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';

import { CovarPoints } from './../../home/models/covar-points'
import { QueryFieldsService } from './../query-fields.service'

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import MousePosition from 'ol/control/MousePosition.js';
import { createStringXY } from 'ol/coordinate.js';
import { defaults as defaultControls, Control } from 'ol/control.js';

import { TileWMS } from 'ol/source.js'

import { toLonLat } from 'ol/proj.js';
import Overlay from 'ol/Overlay';
import {register} from 'ol/proj/proj4.js';
import {get as getProjection} from 'ol/proj.js';
import { getCenter } from 'ol/extent'

import proj4 from 'proj4';


@Component({
  selector: 'app-map-covar',
  templateUrl: './map-covar.component.html',
  styleUrls: ['./map-covar.component.css']
})
export class MapCovarComponent implements OnInit {

  constructor(private queryFieldService: QueryFieldsService) { }
  @ViewChild('mouse-position') mousePosition: any;
  @ViewChild('')

  private map: Map;
  private mousePositionControl: MousePosition;
  private controlPanel: Control;
  private proj: string;
  private longCovar: boolean
  private currentCoordinate: number[]

  ngOnInit() {

    this.proj = 'EPSG:3857' //'EPSG:3857 (WM)or EPSG:4346 (plate carrie)'
    this.longCovar = true
    this.currentCoordinate = [0,0]

    this.makeMousePositionControl()

    this.makeCheckbox()

    this.addMap()

    //this.addMockPoints()

    this.addCovarPoints()

    this.projHandler()

    this.clickHandler()

  }

  private projHandler(): void {
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

    const viewProjSelect = <HTMLInputElement>document.getElementById('view-projection'); //casts html element as an input type
    viewProjSelect.onchange = () => {
      const newProj = getProjection(viewProjSelect.value);
      this.proj = newProj.getCode()

      this.removePoints()
      //this.addMockPoints()
      this.addCovarPoints()
      const newProjExtent = newProj.getExtent();
      const newView = new View({
        projection: newProj,
        center: getCenter(newProjExtent || [0, 0, 0, 0]),
        zoom: 3,
        extent: newProjExtent || undefined
      });
      this.map.setView(newView);
    };      
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
        //console.log(feature);
        return feature;
      });


      if (featureOnClick) {
        //if content is a shape get prob
        const prob = featureOnClick.getProperties().Probability
        if (prob) {
          //console.log(prob);
          overlay.setPosition(evt.coordinate);
          content.innerHTML = "<p>probability float drifted here:</p><code>" + prob +"</code>";
          container.style.display = 'block';
        }
        else {
          //console.log(prob);
          overlay.setPosition(evt.coordinate);
          content.innerHTML = "<p>Hi!</p>";
          container.style.display = 'block';          
        }

        //if content is a point, get coords
      }
      else {
        const coordinate = toLonLat(evt.coordinate, this.proj);
        console.log(coordinate)
        this.currentCoordinate = coordinate
  
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
      controls: defaultControls().extend([this.mousePositionControl, this.controlPanel]),
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
      //console.log(layer)
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

    const floatLayer = this.queryFieldService.makeFloatPoint(geoLocation.coordinates, this.proj)

    const gridLayer = this.queryFieldService.makeCovarPolygons(features, this.proj)

    this.map.addLayer(gridLayer);
    this.map.addLayer(floatLayer);

    //const grid = gridLayer.getSource()
    //this.map.getView().fit(grid.getExtent())
  }

  private addCovarPoints(): void {
    const [lng, lat] = this.currentCoordinate
    if (this.currentCoordinate) {
      console.log(this.longCovar)
      this.queryFieldService.getCovarPoints(lng, lat, this.longCovar)
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

    this.queryFieldService.getMockCovarPoints()
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


  private makeCheckbox(): void {
    var longCovarCheckbox = document.createElement('input');
    longCovarCheckbox.type = "checkbox";
    longCovarCheckbox.id = "long-covar-checkbox";
    longCovarCheckbox.checked = this.longCovar;
    

    var element = document.createElement('div');
    element.className = 'ol-control-panel ol-unselectable ol-control';
    element.innerHTML="<b>120 day forcast</b>&nbsp;"
    element.appendChild(longCovarCheckbox);

    longCovarCheckbox.addEventListener( 'change', (evt: any) => {
      const checkBox = <any>evt.currentTarget
          if(checkBox.checked) {
              console.log('checked')
              this.longCovar = true
          } else {
              this.longCovar = false
              console.log('not checked')
          }
      });
    this.controlPanel = new Control({
        element: element
    });
  }

}
