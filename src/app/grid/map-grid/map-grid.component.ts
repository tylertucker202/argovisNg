import { Component, OnInit, OnDestroy, ApplicationRef } from '@angular/core';
import { MapService } from '../../home/services/map.service';
import { QueryGridService } from '../query-grid.service';
import { RasterService } from '../raster.service';
import { RasterGrid } from '../../home/models/raster-grid'
import { ActivatedRoute } from '@angular/router'

import * as d3 from 'd3'; //needed for leaflet canvas layer
import * as L from "leaflet";

@Component({
  selector: 'app-map-grid',
  templateUrl: './map-grid.component.html',
  styleUrls: ['./map-grid.component.css']
})

export class MapGridComponent implements OnInit, OnDestroy {
  public map: L.Map;
  public gridLayers = L.layerGroup();
  public startView: L.LatLng;
  public startZoom: number;
  public graticule: any;
  private wrapCoordinates: boolean;
  public proj: string;
  public shapeOptions: any;
  
  constructor(private appRef: ApplicationRef,
              public mapService: MapService,
              public rasterService: RasterService,
              private queryGridService: QueryGridService){ }

  ngOnInit() {

    this.mapService.init(this.appRef);

    this.mapService.shapeOptions = {  color: '#983fb2',
                                      weight: 4, 
                                      fill: false,
                                      opacity: .5,
                                      }

    //setup map
    this.proj = 'WM'
    if ( this.proj === 'WM' ){
      this.wrapCoordinates = true
    }
    this.map = this.mapService.generateMap(this.proj);

    //set state from url
    this.queryGridService.subscribeToMapState()
    const shapeArray = this.queryGridService.convertShapesToArray()
    if (shapeArray.length > 0) {
      const initShapes = this.mapService.convertArrayToFeatureGroup(shapeArray)
      this.mapService.drawnItems.addLayer(initShapes)
      this.redrawShapes(false) // runs after map state is set
    }

    this.queryGridService.change
      .subscribe(msg => {
         console.log('query changed: ' + msg);
         this.redrawShapes() //redraws shape with updated change
        })

    this.rasterService.getMockGridRaster()
    .subscribe( (rasterGrids: RasterGrid[]) => {
      if (rasterGrids.length == 0) {
        console.log('warning: no grid')
      }
      else {
        console.log('adding mock grid')
        this.addRasterGridsToMap(rasterGrids)
      }
      },
      error => {
        console.log('error in getting mock profiles' )
      })

    this.queryGridService.clearLayers
    .subscribe( () => {
      this.gridLayers.clearLayers();
      this.mapService.drawnItems.clearLayers();
      this.queryGridService.clearShapes()
      this.queryGridService.setURL()
    })

    this.queryGridService.resetToStart
      .subscribe( () => {
        //this.queryGridService.clearShapes();
        this.gridLayers.clearLayers();
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
    this.gridLayers.addTo(this.map);

    this.map.on('draw:created', (event: any) => { //  had to make event any in order to deal with typings
      const layer = event.layer
      this.mapService.drawnItems.addLayer(layer); //show rectangles
      const shapes = this.mapService.drawnItems.toGeoJSON()
      const broadcastLayer = true
      this.queryGridService.sendShapeMessage(shapes, broadcastLayer)
     });

    this.map.on('draw:deleted', (event: L.DrawEvents.Deleted) => {
      const layers = event.layers;
      let myNewShape = this.mapService.drawnItems;
      layers.eachLayer(function(layer: any) {
        const layer_id = layer._leaflet_id
        myNewShape.removeLayer(layer)
      });
      this.mapService.drawnItems = myNewShape

      this.redrawShapes()
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
       this.redrawShapes() //may be a bit heavy handed, as it requeries db query.
     })

    this.invalidateSize();

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

  private redrawShapes(setUrl=true): void {
    //gets shapes, removes layers, redraws shapes and requeries database before setting the url.
    const shapes = this.mapService.drawnItems.toGeoJSON()
    this.gridLayers.clearLayers();
    const broadcastLayer = false
    this.queryGridService.sendShapeMessage(shapes, broadcastLayer)
    this.gridSelectionOnMap();
    if(setUrl){
      this.queryGridService.setURL(); //this should be the last thing
    }
  }

  gridSelectionOnMap(): void {

    let fc = this.queryGridService.getShapes()
    const monthYear = this.queryGridService.getMonthYear()
    const pres = this.queryGridService.getPresLevel()
    const grid = this.queryGridService.getGrid()
    const globalGrid = this.queryGridService.getGlobalGrid()

    if (fc) {
      let bboxes = this.queryGridService.getBBoxes(fc)
      if (globalGrid) {
        bboxes = [ [-180, -90, 180, 90] ]
      }
      bboxes.forEach( (bbox) => {
        const lonRange = [bbox[0], bbox[2]]
        const latRange = [bbox[1], bbox[3]]
        this.rasterService.getGridRasterProfiles(latRange, lonRange, monthYear.format('MM-YYYY'), pres, grid)
        .subscribe( (rasterGrids: RasterGrid[]) => {
          if (rasterGrids.length == 0) {
            console.log('warning: no grid')
          }
          else {
            this.addRasterGridsToMap(rasterGrids)
          }
          },
          error => {
            console.log('error in getting grid' )
          })
      })
    }

  }

  public addRasterGridsToMap(rasterGrids: RasterGrid[]): void {

    for( let idx in rasterGrids){
      let grid = rasterGrids[idx];
      //this.rasterService.addGeoRasterToGridLayer(grid, this.gridLayers, this.map)
      this.rasterService.addCanvasToGridLayer(grid, this.gridLayers, this.map)
    }

  }
}