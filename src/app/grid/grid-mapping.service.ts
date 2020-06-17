import { Injectable, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { FeatureCollection, Feature, Polygon } from 'geojson'
import { MapService } from './../home/services/map.service'
import { QueryGridService } from './query-grid.service'
import { RasterService } from './raster.service'
import { RasterGrid, RasterParam } from './../home/models/raster-grid'
import { NotifierService } from 'angular-notifier'
import { DOCUMENT } from '@angular/common'
import { Scale, Color } from 'chroma-js'
import * as chroma from 'chroma'
declare let chroma: any

import * as d3 from 'd3'; //needed for leaflet canvas layer
import * as L from "leaflet";

@Injectable({
  providedIn: 'root'
})
export class GridMappingService {

  public gridLayers = L.layerGroup();
  private readonly notifier: NotifierService

  constructor(private queryGridService: QueryGridService,
              private rasterService: RasterService,
              public mapService: MapService,
              private notifierService: NotifierService,
              @Inject(DOCUMENT) private document: Document) { this.notifier = notifierService }

  public updateGrids(map: L.Map): void {
    //update grids with new colorscale and color domain, or interpolate
    const colorScale = this.queryGridService.getColorScale()
    let gridDomain = this.queryGridService.getGridDomain()

    const invertColorScale = this.queryGridService.getInverseColorScale()
    let c: Scale<Color>
    if (invertColorScale) { c = chroma.scale(colorScale).domain(gridDomain.reverse()) }
    else { c = chroma.scale(colorScale).domain(gridDomain) }
    const interpolateBool = this.queryGridService.getInterplateBool()
    this.gridLayers.eachLayer((layer: L.ScalarLayer) => { //scalar layer based off of leaflet Layer
      layer.setColor(c)
      layer.options.interpolate = interpolateBool
      layer.needRedraw()
    })

    this.queryGridService.updateColorbar.emit('redrawn grids')
    this.queryGridService.setURL(); //this should be the last thing
  }

  public drawGrids(map: L.Map, setURL=true, lockRange=false): void {
     //gets shapes, removes layers, redraws shapes and requeries database before setting the url.
    const broadcastChange = false
    this.gridLayers.clearLayers()
    const shapes = this.mapService.drawnItems.toGeoJSON()
    let bboxes = this.queryGridService.getBBoxes(shapes)
    this.queryGridService.sendShape(bboxes, broadcastChange)
    let features = this.queryGridService.getShapes()
    const grid = this.queryGridService.getGrid()
    //check if grid exists on current grid selection. If not dont draw.
    this.generateGridSections(bboxes, map, grid, lockRange)
    this.queryGridService.updateColorbar.emit('new grid')
    if(setURL){
      this.queryGridService.setURL(); //this should be the last thing
    }
  }

  public addGridSection(bbox: number[], map: L.Map, 
                                          datetime, pres, grid, compareGrid, compare, paramMode,
                                          gridParam, lockRange: boolean) {
    let lonRange = [bbox[0], bbox[2]]
    const latRange = [bbox[1], bbox[3]]
    const translateShape = lonRange[0] < -180

    if (translateShape) {
      lonRange[0] += 360
      lonRange[1] += 360
    }

    if (compare && !paramMode) {
      this.rasterService.getTwoGridRasterProfiles(latRange, lonRange, datetime.format('MM-YYYY'), pres, grid, compareGrid)
      .subscribe( (rasterGrids: [RasterGrid[], RasterGrid[]]) => {
        if (rasterGrids.length != 2) {
          this.notifier.notify( 'warning', 'Missing a grid' )
        }
        else {
          let dGrid = this.rasterService.makeDiffGrid(rasterGrids)
          this.generateRasterGrids(map, dGrid, lockRange)
        }
        },
        error => {
          this.notifier.notify( 'error', 'error in getting grid' )
        })
    }
    else if (!compare && paramMode) {
      this.rasterService.getParamRaster(latRange, lonRange, pres, grid, gridParam).subscribe( (rasterParam: RasterParam[]) => {
        if (rasterParam.length == 0) {
          this.notifier.notify('warning', 'Missing a param')
        }
        else {
          this.generateRasterGrids(map, rasterParam, lockRange)
        }
        },
        error => {
          this.notifier.notify( 'error', 'error in getting grid' )
        })
    }
    else if (compare && paramMode) {
      this.rasterService.getTwoParamRaster(latRange, lonRange, pres, grid, gridParam, compareGrid).subscribe( (rasterParams: [RasterParam[], RasterParam[]]) => {
        if (rasterParams.length !=2 ) {
          this.notifier.notify('warning', 'Missing a param')
        }
        else {
          let dGrid = this.rasterService.makeDiffGrid(rasterParams)
          this.generateRasterGrids(map, dGrid, lockRange)
        }
        },
        error => {
          this.notifier.notify( 'error', 'error in getting grid' )
        })
    }
    else {
      this.rasterService.getGridRaster(latRange, lonRange, datetime.format('MM-YYYY'), pres, grid)
      .subscribe( (rasterGrids: RasterGrid[]) => {
        if (rasterGrids.length == 0) {
          this.notifier.notify( 'warning', 'grid not found' )
        }
        else {
          this.generateRasterGrids(map, rasterGrids, lockRange)
        }
        },
        error => {
          this.notifier.notify( 'error', 'error in getting grid' )
        })
    }
  }

  private generateGridSections(bboxes: number[][], map: L.Map, grid: string, lockRange: boolean): void {

    const interpolation = this.queryGridService.getInterplateBool()

    if (bboxes) {
      const monthYear = this.queryGridService.getMonthYear()
      const pres = this.queryGridService.getPresLevel()
      const compareGrid = this.queryGridService.getCompareGrid()
      const compare = this.queryGridService.getCompare()
  
      const paramMode = this.queryGridService.getParamMode()
      const gridParam = this.queryGridService.getGridParam()
      
      bboxes.forEach( (bbox: number[]) => {
        this.addGridSection(bbox, map, monthYear, pres, grid, compareGrid, compare, paramMode, gridParam, lockRange)
      })
    }
  }

  public generateRasterGrids(map: L.Map, rasterGrids: RasterGrid[] | RasterParam[], lockRange: boolean): void {
    const colorScale = this.queryGridService.getColorScale()
    const interpolationBool = this.queryGridService.getInterplateBool()
    const invertColorScale = this.queryGridService.getInverseColorScale()
    for( let idx in rasterGrids){
      let grid = rasterGrids[idx];
      this.gridLayers = this.rasterService.addCanvasToGridLayer(grid, this.gridLayers, map, interpolationBool, colorScale, invertColorScale)
      this.gridLayers.eachLayer((layer: any) => {
        if (lockRange) {
          let gridDomain = this.queryGridService.getGridDomain()
          let c: Scale<Color>
          if(invertColorScale) {c = chroma.scale(colorScale).domain(gridDomain.reverse()) }
          else { c = chroma.scale(colorScale).domain(gridDomain) }
          layer.setColor(c)
        }
        else {
          const range = layer._field.range.slice().sort()
          this.queryGridService.sendGridDomain(range[0], range[1], true)
        }
      })
      }
      this.gridLayers.addTo(map)
  }
}
