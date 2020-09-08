import { Component, OnInit, OnDestroy, Inject, ApplicationRef } from '@angular/core'
import { MapService } from '../../home/services/map.service'
import { QueryGridService } from '../query-grid.service'
import { GridMappingService } from '../grid-mapping.service'
import { RasterService } from '../raster.service'
import { SelectGridService } from '../select-grid.service'

import { RasterGrid, Grid } from '../../models/raster-grid'
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
    this.queryGridService.setParamsFromURL('setting params from map component init')

    //setup map
    this.proj = 'WM'
    if ( this.proj === 'WM' ){
      this.wrapCoordinates = true
    }
    const gridMap = true
    this.map = this.mapService.generateMap(this.proj, gridMap)
    this.startView = this.queryGridService.startView
    this.startZoom = this.queryGridService.startZoom
    this.map.setView(this.startView, this.startZoom)
    this.mapService.drawnItems.addTo(this.map)

    this.initGrids()

    this.queryGridService.change
      .subscribe(msg => {
        console.log('msg: ', msg)
        const param = this.queryGridService.getProperty()
        const grid = this.queryGridService.getGridName()

        this.map.closePopup()
        const updateURL = true
        const lockColorbarRange = false //update colorbar
        if (this.isNewGrid(msg)) {
          const gridAvailable = this.selectGridService.checkIfGridAvailable(grid, param)
          // console.log('new grids to be queried. gridAvailable?', gridAvailable, 'grid', grid, 'param', param)
          gridAvailable ? this.gridMappingService.drawGrids(this.map, updateURL, lockColorbarRange) : this.gridMappingService.gridLayers.clearLayers()
        }
        else { //cosmetic changes
          this.gridMappingService.updateGrids(this.map) //redraws shape with updated change
        }
        })

    // this.rasterService.getMockGridRaster()
    // .subscribe( (rasterGrids: RasterGrid[]) => {
    //   if (rasterGrids.length == 0) {
    //     console.log('warning: no grid')
    //   }
    //   else {
    //     console.log('adding mock grid', rasterGrids[0])
    //     this.gridMappingService.generateRasterGrids(this.map, rasterGrids, false)
    //   }
    //   },
    //   error => {
    //     console.log('error in getting mock raster grid' )
    //   })

    // this.rasterService.getMockGrid()
    // .subscribe( (grid: Grid[]) => {
    //     const t0 = performance.now();
    //     console.log('getting sose mock grid')
    //     const delta = .25 //need to regrid non uniform grid with delta
    //     const rasterGrids = this.rasterService.makeRasterFromGrid(grid[0], delta)
    //     const t1 = performance.now();
    //     console.log(`Call to regridding took ${t1 - t0} milliseconds.`);
    //     // console.log('regridded Raster:', rasterGrids)
    //     this.gridMappingService.generateRasterGrids(this.map, [rasterGrids], false)
    //   }, 
    //   error => {
    //     console.log('error in getting mock grid')
    //   }
    // )

    this.queryGridService.clearLayers
    .subscribe( () => {
      this.map.closePopup()
      this.gridMappingService.gridLayers.clearLayers()
      this.mapService.drawnItems.clearLayers()
      this.queryGridService.clearShapes()
      this.queryGridService.setURL()
    })

    this.queryGridService.resetToStart
      .subscribe( () => {
        this.map.closePopup()
        this.gridMappingService.gridLayers.clearLayers()
        this.mapService.drawnItems.clearLayers()
        this.map.setView(this.startView, this.startZoom)
        this.initGrids()
      })

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

  private isNewGrid(msg: string): boolean {
    //this checks if change merits a complete redraw (true), or just update some cosmetic changes (false)
    const redrawItems = [ 'grid change', 'pres level change', 'param change',
                          'grid param change', 'display grid param change',
                          'compare grid toggled', 'compare grid change',
                          'date changed']
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
    //const bbox = this.queryGridService.getBBox(feature)
    const date = this.queryGridService.getDate()
    const pres = this.queryGridService.getPresLevel()
    const grid = this.queryGridService.getGridName()
    const compareGrid = this.queryGridService.getCompareGrid()
    const compare = this.queryGridService.getCompare()
    const paramMode = this.queryGridService.getParamMode()
    const gridParam = this.queryGridService.getGridParam()
    const lockColorbarRange = false

    if (bboxes[0][0] < -180) {
      const wrappedBbox = [[bboxes[0][0], bboxes[0][1], -180, bboxes[0][3]], [-180, bboxes[0][1], bboxes[0][2], bboxes[0][3]]]
      bboxes = wrappedBbox
    }

    
    this.queryGridService.sendShape(bboxes, broadcastLayer)
    bboxes.forEach( (bbox: number[]) => {
      this.gridMappingService.addGridSection(bbox, this.map, date, pres, grid, compareGrid, compare, paramMode, gridParam, lockColorbarRange)
    })
    this.gridMappingService.updateGrids(this.map)
    this.queryGridService.updateColorbarEvent.emit('new shape added')
  }

  ngOnDestroy() {
    this.map.off();
    this.map.remove();
  }

  public invalidateSize(this): void {
    if (this.map) {
      setTimeout(() => {
        this.map.invalidateSize(true);
      },100);
    }
  }
}