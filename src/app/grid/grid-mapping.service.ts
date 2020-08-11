import { HEX_COLOR_MAPS } from './../profview/colormap.parameters';
import { Injectable, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { FeatureCollection, Feature, Polygon } from 'geojson'
import { MapService } from './../home/services/map.service'
import { QueryGridService } from './query-grid.service'
import { RasterService } from './raster.service'
import { RasterGrid, RasterParam, Grid, GridCoords } from '../models/raster-grid'
import { NotifierService } from 'angular-notifier'
import { DOCUMENT } from '@angular/common'
import { Scale, Color } from 'chroma-js'
import * as chroma from 'chroma'
declare let chroma: any

import * as d3 from 'd3'; //needed for leaflet canvas layer
import * as L from "leaflet";
import { SelectGridService } from './select-grid.service';
import moment from 'moment';

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
              private selectGridService: SelectGridService,
              @Inject(DOCUMENT) private document: Document) { this.notifier = notifierService }

  public updateGrids(map: L.Map): void {
    //update grids with new colorscale and color domain, or interpolate
    const colorScale = this.queryGridService.getColorScale()
    let gridDomain = this.queryGridService.getGridDomain()

    const invertColorScale = this.queryGridService.getInverseColorScale()
    let c = this.rasterService.get_colorscale(colorScale, gridDomain, invertColorScale)
    console.log('colorscale: ', c, 'colorscale', HEX_COLOR_MAPS[colorScale.toLowerCase()])
    const interpolateBool = this.queryGridService.getInterplateBool()
    this.gridLayers.eachLayer((layer: L.ScalarLayer) => { //scalar layer based off of leaflet Layer
      layer.setColor(c)
      layer.options.interpolate = interpolateBool
      layer.needRedraw()
    })

    this.queryGridService.updateColorbarEvent.emit('redrawn grids')
    this.queryGridService.setURL(); //this should be the last thing
  }

  public drawGrids(map: L.Map, setURL=true, lockColorbarRange=false): void {
     //gets shapes, removes layers, redraws shapes and requeries database before setting the url.
    const broadcastChange = false
    this.gridLayers.clearLayers()
    const shapes = this.mapService.drawnItems.toGeoJSON()
    let bboxes = this.queryGridService.getBBoxes(shapes)
    this.queryGridService.sendShape(bboxes, broadcastChange)
    let features = this.queryGridService.getShapes()
    const gridName = this.queryGridService.getGridName()
    //check if grid exists on current grid selection. If not dont draw.
    this.generateGridSections(bboxes, map, gridName, lockColorbarRange)
    this.queryGridService.updateColorbarEvent.emit('new grid')
    if(setURL){
      this.queryGridService.setURL(); //this should be the last thing
    }
  }

  public getGridDisplayOption(compare: boolean, paramMode: boolean) {
    const gridOptionsMap = {
      'grid': (!compare && !paramMode),
      'compare grid': (compare && !paramMode), 
      'param': (!compare && paramMode),
      'compare params': (compare && paramMode)
    }
    return Object.keys(gridOptionsMap).find(key => gridOptionsMap[key] === true);
  }

  public singleGridHandler(latRange: [number, number], lonRange: [number, number],
                           datetime: moment.Moment, pres: number,
                           gridName: string, map: L.Map, lockColorbarRange: boolean) {
    if (this.selectGridService.isUniform(gridName) ){
      this.rasterService.getGridRaster(latRange, lonRange, datetime.format('DD-MM-YYYY'), pres, gridName)
      .subscribe( (rasterGrids: RasterGrid[]) => {
        if (rasterGrids.length == 0) {
          this.notifier.notify( 'warning', 'grid not found' )
        }
        else {
          this.generateRasterGrids(map, rasterGrids, lockColorbarRange)
        }
        },
        error => {
          this.notifier.notify( 'error', 'error in getting grid' )
        }
      )}
    else {
      this.rasterService.getNonUniformGrid(datetime.format('DD-MM-YYYY'), latRange, lonRange, pres, gridName)
      .subscribe( (grids: Grid[]) => {
        const delta = 1 //need to regrid non uniform grid with delta
        if (grids[0]) {
          if (gridName.includes('sparse')) {
            this.rasterService.getGridCoords(latRange, lonRange, gridName).subscribe( (gridCoords: GridCoords[]) => {
              const fullGrid = this.rasterService.desparseGrid(grids[0].data, gridCoords[0])
              grids[0].data = fullGrid
              const rasterGrids = this.rasterService.makeRasterFromGrid(grids[0], delta)
              this.generateRasterGrids(map, [rasterGrids], false)
            })
          }
          else {
            const rasterGrids = this.rasterService.makeRasterFromGrid(grids[0], delta)
            this.generateRasterGrids(map, [rasterGrids], false)
          }
        }
        else {
          this.notifier.notify('warning', 'grid not found')
        }
      },
      error => {
        this.notifier.notify('error', 'error in getting non uniform grid')
      })
    }
  }

  public addGridSection(bbox: number[], map: L.Map, 
                                          datetime: moment.Moment, pres: number, gridName: string, compareGrid: string, compare: boolean, paramMode: boolean,
                                          gridParam, lockColorbarRange: boolean) {
    let lonRange = [bbox[0], bbox[2]] as [number, number]
    const latRange = [bbox[1], bbox[3]] as [number, number]
    const translateShape = lonRange[0] < -180

    if (translateShape) {
      lonRange[0] += 360
      lonRange[1] += 360
    }

    const gridOption = this.getGridDisplayOption(compare, paramMode)
    switch (gridOption) {
      case 'grid':
        this.singleGridHandler(latRange, lonRange, datetime, pres, gridName, map, lockColorbarRange)
        break
      case 'compare grid':
        this.rasterService.getTwoGridRasterProfiles(latRange, lonRange, datetime.format('DD-MM-YYYY'), pres, gridName, compareGrid)
        .subscribe( (rasterGrids: [RasterGrid[], RasterGrid[]]) => {
          if (rasterGrids.length != 2) {
            this.notifier.notify( 'warning', 'Missing a grid' )
          }
          else {
            let dGrid = this.rasterService.makeDiffGrid(rasterGrids)
            this.generateRasterGrids(map, dGrid, lockColorbarRange)
          }
          },
          error => {
            this.notifier.notify( 'error', 'error in getting grid' )
          })
        break
      case 'param':
        this.rasterService.getParamRaster(latRange, lonRange, pres, gridName, gridParam).subscribe( (rasterParam: RasterParam[]) => {
          if (rasterParam.length == 0) {
            this.notifier.notify('warning', 'Missing a param')
          }
          else {
            this.generateRasterGrids(map, rasterParam, lockColorbarRange)
          }
          },
          error => {
            this.notifier.notify( 'error', 'error in getting grid' )
          })
        break
      case 'compare params':
        this.rasterService.getTwoParamRaster(latRange, lonRange, pres, gridName, gridParam, compareGrid).subscribe( (rasterParams: [RasterParam[], RasterParam[]]) => {
          if (rasterParams.length !=2 ) {
            this.notifier.notify('warning', 'Missing a param')
          }
          else {
            let dGrid = this.rasterService.makeDiffGrid(rasterParams)
            this.generateRasterGrids(map, dGrid, lockColorbarRange)
          }
          },
          error => {
            this.notifier.notify( 'error', 'error in getting grid' )
          })
      default:
        this.notifier.notify('error', 'control flow case not found') 
        break
    }
  }

  private generateGridSections(bboxes: number[][], map: L.Map, grid: string, lockColorbarRange: boolean): void {

    const interpolation = this.queryGridService.getInterplateBool()

    if (bboxes) {
      const date = this.queryGridService.getDate()
      const pres = this.queryGridService.getPresLevel()
      const compareGrid = this.queryGridService.getCompareGrid()
      const compare = this.queryGridService.getCompare()
  
      const paramMode = this.queryGridService.getParamMode()
      const gridParam = this.queryGridService.getGridParam()
      
      bboxes.forEach( (bbox: number[]) => {
        this.addGridSection(bbox, map, date, pres, grid, compareGrid, compare, paramMode, gridParam, lockColorbarRange)
      })
    }
  }

  public generateRasterGrids(map: L.Map, rasterGrids: RasterGrid[] | RasterParam[], lockColorbarRange: boolean): void {
    const colorScale = this.queryGridService.getColorScale()
    const interpolationBool = this.queryGridService.getInterplateBool()
    const invertColorScale = this.queryGridService.getInverseColorScale()
    for( let idx in rasterGrids){
      let grid = rasterGrids[idx];
      this.gridLayers = this.rasterService.addCanvasToGridLayer(grid, this.gridLayers, map, interpolationBool, colorScale, invertColorScale)
      this.gridLayers.eachLayer((layer: any) => {
        if (lockColorbarRange) {
          let gridDomain = this.queryGridService.getGridDomain()
          let c = this.rasterService.get_colorscale(colorScale, gridDomain, invertColorScale)
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
