import { Component, OnInit, OnDestroy, Inject, ApplicationRef } from '@angular/core'
import { MapService } from '../../home/services/map.service'
import { QueryGridService } from '../query-grid.service'
import { GridMappingService } from '../grid-mapping.service'
import { RasterService } from '../raster.service'
import { SelectGridService } from '../select-grid.service'

import * as L from "leaflet";

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
              private gridMappingService: GridMappingService,
              private selectGridService: SelectGridService) {}

  ngOnInit() {

    this.mapService.init(this.appRef);

    this.shapeOptions = {  color: '#983fb2',
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
    const gridMap = true
    this.map = this.mapService.generateMap(this.proj, gridMap);
    const startView = {lat: 0, lng: 0};
    const startZoom = 3
    this.map.setView(startView, startZoom)
    this.mapService.drawnItems.addTo(this.map)

    this.initGrids()

    this.queryGridService.change
      .subscribe(msg => {
        console.log('msg: ', msg)
        const param = this.queryGridService.getParam()
        const grid = this.queryGridService.getGrid()

        this.map.closePopup()
        const updateURL = true
        const lockRange = false //update colorbar
        const redrawGridBool = this.checkIfRedraw(msg) // redraw grids or just update cosmetic items?
        if (redrawGridBool) {
          const gridAvailable = this.selectGridService.checkIfGridAvailable(grid, param)
          gridAvailable ? this.gridMappingService.drawGrids(this.map, updateURL, lockRange) : this.gridMappingService.gridLayers.clearLayers()
        }
        else {
          this.gridMappingService.updateGrids(this.map) //redraws shape with updated change
        }
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
      this.map.closePopup()
      this.gridMappingService.gridLayers.clearLayers();
      this.mapService.drawnItems.clearLayers();
      this.queryGridService.clearShapes()
      this.queryGridService.setURL()
    })

    this.queryGridService.resetToStart
      .subscribe( () => {
        this.map.closePopup()
        this.gridMappingService.gridLayers.clearLayers();
        this.mapService.drawnItems.clearLayers();
        this.map.setView([this.startView.lat, this.startView.lng], this.startZoom)
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
      this.mapService.drawnItems.clearLayers() // allow only one drawn item at a time.
      this.gridMappingService.gridLayers.clearLayers() // remove grid layers too.
      this.mapService.drawnItems.addLayer(layer); //show rectangles
      const shapes = this.mapService.drawnItems.toGeoJSON()
      const feature = layer.toGeoJSON()
      const bboxes = this.queryGridService.getBBoxes(shapes)
      this.updateGridsOnAdd(feature, bboxes)
     });

    this.map.on('draw:deleted', (event: L.DrawEvents.Deleted) => {
      this.queryGridService.clearLayers.emit('deleted event')
     });

    this.map.on('draw:edited', (event: L.DrawEvents.Edited) => {
      this.gridMappingService.gridLayers.clearLayers() // remove grid layers too.
      this.mapService.drawnItems = this.getNewDrawnItems(event.layers)

      const shapes = this.mapService.drawnItems.toGeoJSON()
      shapes.features.forEach(feature => {
      const bbox = this.queryGridService.getBBox(feature)
      this.updateGridsOnAdd(feature, [bbox])
      });
    });

    this.invalidateSize();
  }

  private checkIfRedraw(msg: string): boolean {
    //this checks if change merits a complete redraw (true), or just update some cosmetic changes (false)
    const redrawItems = [ 'grid change', 'pres level change', 'param change',
                          'grid param change', 'display grid param change',
                          'compare grid toggled', 'compare grid change',
                          'month year change']
    const redrawGridBool = redrawItems.includes(msg)
    return redrawGridBool
  }

  private getNewDrawnItems(layers: L.LayerGroup): L.FeatureGroup {

    let myNewShape = this.mapService.drawnItems;
    layers.eachLayer(function(layer: L.Layer| any) { //todo get layer id
      const layer_id = layer._leaflet_id
      myNewShape.removeLayer(layer_id)
      myNewShape.addLayer(layer)
    });
    return myNewShape
}

  private initGrids(): void{ 
    let bboxes = this.queryGridService.getShapes()
    if (bboxes) {
      this.mapService.drawnItems.addLayer(this.makeRectanlge(bboxes))
      this.gridMappingService.drawGrids(this.map, false, false) //todo: add shape is set twice
    }
  }

  private makeRectanlge(bbox: number[][]): L.Rectangle {
    const bounds = L.latLngBounds([bbox[0][1], bbox[0][0]], [bbox[0][3], bbox[0][2]]);
    const rect = L.rectangle(bounds, this.shapeOptions)
    return rect
  }


  private updateGridsOnAdd(feature, bboxes: number[][]): void {
    const broadcastLayer = false
    const bbox = this.queryGridService.getBBox(feature)
    const monthYear = this.queryGridService.getMonthYear()
    const pres = this.queryGridService.getPresLevel()
    const grid = this.queryGridService.getGrid()
    const compareGrid = this.queryGridService.getCompareGrid()
    const compare = this.queryGridService.getCompare()
    const paramMode = this.queryGridService.getParamMode()
    const gridParam = this.queryGridService.getGridParam()
    const lockRange = false

    
    this.queryGridService.sendShape(bboxes, broadcastLayer)
    this.gridMappingService.addGridSection(bbox, this.map, monthYear, pres, grid, compareGrid, compare, paramMode, gridParam, lockRange)
    this.gridMappingService.updateGrids(this.map)
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