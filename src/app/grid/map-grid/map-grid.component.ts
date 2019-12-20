import { Component, OnInit, OnDestroy, ApplicationRef } from '@angular/core'
import { MapService } from '../../home/services/map.service'
import { QueryGridService } from '../query-grid.service'
import { GridMappingService } from '../grid-mapping.service'
import { RasterService } from '../raster.service'
import { RasterGrid, RasterParam } from '../../home/models/raster-grid'

import * as L from "leaflet";
import { FeatureCollection, Feature, Polygon } from 'geojson'
import { Geometry } from 'ol/geom'

@Component({
  selector: 'app-map-grid',
  templateUrl: './map-grid.component.html',
  styleUrls: ['./map-grid.component.css']
})

export class MapGridComponent implements OnInit, OnDestroy {
  public map: L.Map;
  public startView: L.LatLng;
  public startZoom: number;
  public graticule: any;
  private wrapCoordinates: boolean;
  public proj: string;
  public shapeOptions: any;
  
  constructor(private appRef: ApplicationRef,
              public mapService: MapService,
              public rasterService: RasterService,
              private queryGridService: QueryGridService,
              private gridMappingService: GridMappingService ){ }

  ngOnInit() {

    this.mapService.init(this.appRef);

    this.mapService.shapeOptions = {  color: '#983fb2',
                                      weight: 4, 
                                      fill: false,
                                      opacity: .5,
                                      }

    //set state from url
    this.queryGridService.setParamsFromURL()

    //setup map
    this.proj = 'WM'
    if ( this.proj === 'WM' ){
      this.wrapCoordinates = true
    }
    const queryShapes = true
    this.map = this.mapService.generateMap(this.proj);
    const startView = {lat: 0, lng: 0};
    const startZoom = 3
    this.map.setView(startView, startZoom)
    this.mapService.drawnItems.addTo(this.map);

    const shapeFeature = this.queryGridService.getShapes()
    const displayGlobalGrid = this.queryGridService.getGlobalGrid()
    if (shapeFeature && !displayGlobalGrid) {
      const shapeArray = this.queryGridService.getShapeArray(shapeFeature)
      const initShapes = this.mapService.convertArrayToFeatureGroup(shapeArray)
      this.mapService.drawnItems.addLayer(initShapes)
      const setURLBool = false
      this.gridMappingService.redrawGrids(this.map, setURLBool, queryShapes)
    }
    else if (displayGlobalGrid) {
      const setURLBool = false
      this.gridMappingService.redrawGrids(this.map, setURLBool, queryShapes)
    }

    this.queryGridService.change
      .subscribe(msg => {
         console.log('query changed: ' + msg);
         const setURLBool = true
         let queryShapes = true
         if (msg === 'color scale change') {
           queryShapes = false
           console.log('queryShapes?', queryShapes)
         }
         this.gridMappingService.redrawGrids(this.map, setURLBool, queryShapes) //redraws shape with updated change
        })

    // this.rasterService.getMockGridRaster()
    // .subscribe( (rasterGrids: RasterGrid[]) => {
    //   if (rasterGrids.length == 0) {
    //     console.log('warning: no grid')
    //   }
    //   else {
    //     console.log('adding mock grid')
    //     this.gridMappingService.addRasterGridsToMap(this.map, rasterGrids)
    //   }
    //   },
    //   error => {
    //     console.log('error in getting mock profiles' )
    //   })

    this.queryGridService.clearLayers
    .subscribe( () => {
      this.gridMappingService.gridLayers.clearLayers();
      this.mapService.drawnItems.clearLayers();
      this.queryGridService.clearShapes()
      this.queryGridService.setURL()
    })

    this.queryGridService.resetToStart
      .subscribe( () => {
        //this.queryGridService.clearShapes();
        this.gridMappingService.gridLayers.clearLayers();
        this.mapService.drawnItems.clearLayers();
        //this.queryGridService.clearShapes()
        this.map.setView([this.startView.lat, this.startView.lng], this.startZoom)
        //this.queryGridService.setURL()
      })

    this.startView = this.map.getCenter()
    this.startZoom = this.map.getZoom()

    this.mapService.coordDisplay.addTo(this.map);
    this.mapService.drawnItems.addTo(this.map);
    this.mapService.scaleDisplay.addTo(this.map);
    this.mapService.gridDrawControl.addTo(this.map);
    this.gridMappingService.gridLayers.addTo(this.map);

    this.map.on('draw:created', (event: any) => { //  had to make event any in order to deal with typings
      const layer = event.layer
      this.mapService.drawnItems.addLayer(layer); //show rectangles
      const shapes = this.mapService.drawnItems.toGeoJSON()
      const feature = layer.toGeoJSON()
      console.log('added layer:', feature)
      this.updateGridsOnAdd(feature, shapes)
     });

    this.map.on('draw:deleted', (event: L.DrawEvents.Deleted) => {
      const layers = event.layers;
      let myNewShape = this.mapService.drawnItems;
      layers.eachLayer(function(layer: any) {
        const layer_id = layer._leaflet_id
        myNewShape.removeLayer(layer)
      });
      this.mapService.drawnItems = myNewShape
      const setURLBool = true
      const queryGrids = false
      this.gridMappingService.redrawGrids(this.map, setURLBool, queryGrids)
     });

     this.map.on('draw:edited', (event: L.DrawEvents.Edited) => {
       const layers = event.layers; //layers that have changed
       let myNewShape = this.mapService.drawnItems;
       layers.eachLayer(function(layer: any) {
         const layer_id = layer._leaflet_id
         myNewShape.removeLayer(layer_id)
         myNewShape.addLayer(layer)
       })
       this.mapService.drawnItems = myNewShape
       const setURLBool = true
       const queryGrids = false
       this.gridMappingService.redrawGrids(this.map, setURLBool, queryGrids)
     })

    this.invalidateSize();
  }

  private updateGridsOnAdd(feature, shapes): void {
    const broadcastLayer = false
    const setURLBool = true
    const queryGrids = false
    const bbox = this.queryGridService.getBBox(feature)
    const monthYear = this.queryGridService.getMonthYear()
    const pres = this.queryGridService.getPresLevel()
    const grid = this.queryGridService.getGrid()
    const compareGrid = this.queryGridService.getCompareGrid()
    const compare = this.queryGridService.getCompare()
    const displayGridParam = this.queryGridService.getDisplayGridParam()
    const gridParam = this.queryGridService.getGridParam()

    
    this.queryGridService.sendShapeMessage(shapes, broadcastLayer)
    this.gridMappingService.addGridSelectionFromFeatureToMap(bbox, this.map, monthYear, pres, grid, compareGrid, compare, displayGridParam, gridParam)
    this.gridMappingService.redrawGrids(this.map, setURLBool, queryGrids)
    this.queryGridService.updateColorbar.emit('new shape added')
  }

  ngOnDestroy() {
    this.map.off();
    this.map.remove();
  }

  private invalidateSize(this): void {
    if (this.map) {
      setTimeout(() => {
        this.map.invalidateSize(true);
      },100);
    }
  }
}