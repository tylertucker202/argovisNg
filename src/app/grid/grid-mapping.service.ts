import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { FeatureCollection, Feature, Polygon } from 'geojson'
import { MapService } from './../home/services/map.service'
import { QueryGridService } from './query-grid.service'
import { RasterService } from './raster.service'
import { RasterGrid, RasterParam } from './../home/models/raster-grid'
import * as chroma from 'chroma'
declare let chroma: any

import * as d3 from 'd3'; //needed for leaflet canvas layer
import * as L from "leaflet";

@Injectable({
  providedIn: 'root'
})
export class GridMappingService {

  public gridLayers = L.layerGroup();

  constructor(private queryGridService: QueryGridService,
              private rasterService: RasterService,
              public mapService: MapService) { }

  public updateGrids(map: L.Map): void {
    //gets shapes, removes layers, redraws shapes and requeries database before setting the url.
    const broadcastChange = false
    const colorScale = this.queryGridService.getColorScale()
    const gridDomain = this.queryGridService.getGridDomain()
    const c = chroma.scale(colorScale).domain(gridDomain);
    this.gridLayers.eachLayer((layer: any) => {
      layer.setColor(c)
    })

    this.queryGridService.updateColorbar.emit('redrawn grids')
    this.queryGridService.setURL(); //this should be the last thing
  }

  public drawGrids(map: L.Map, setURL=true): void {
    const broadcastChange = false
    const lockRange = true
    this.gridLayers.clearLayers();
    const shapes = this.mapService.drawnItems.toGeoJSON()
    this.queryGridService.sendShape(shapes, broadcastChange)
    let features = this.queryGridService.getShapes()
    this.generateGridSections(features, map, lockRange);
    if(setURL){
      this.queryGridService.setURL(); //this should be the last thing
    }       
  }

  public addGridSection(bbox: number[], map: L.Map, 
                                          monthYear, pres, grid, compareGrid, compare, paramMode,
                                          gridParam, lockRange: boolean) {
    const lonRange = [bbox[0], bbox[2]]
    const latRange = [bbox[1], bbox[3]]

    if (compare && !paramMode) {
      this.rasterService.getTwoGridRasterProfiles(latRange, lonRange, monthYear.format('MM-YYYY'), pres, grid, compareGrid)
      .subscribe( (rasterGrids: [RasterGrid[], RasterGrid[]]) => {
        if (rasterGrids.length != 2) {
          console.log('warning missing: a grid')
        }
        else {
          let dGrid = this.rasterService.makeDiffGrid(rasterGrids)
          this.generateRasterGrids(map, dGrid, lockRange)
        }
        },
        error => {
          console.log('error in getting grid', error )
        })
    }
    else if (!compare && paramMode) {
      this.rasterService.getParamRaster(latRange, lonRange, pres, grid, gridParam).subscribe( (rasterParam: RasterParam[]) => {
        if (rasterParam.length == 0) {
          console.log('warning missing: a param')
        }
        else {
          this.generateRasterGrids(map, rasterParam, lockRange)
        }
        },
        error => {
          console.log('error in getting grid', error )
        })
    }
    else if (compare && paramMode) {
      this.rasterService.getTwoParamRaster(latRange, lonRange, pres, grid, gridParam, compareGrid).subscribe( (rasterParams: [RasterParam[], RasterParam[]]) => {
        if (rasterParams.length !=2 ) {
          console.log('warning missing: a param')
        }
        else {
          let dGrid = this.rasterService.makeDiffGrid(rasterParams)
          this.generateRasterGrids(map, dGrid, lockRange)
        }
        },
        error => {
          console.log('error in getting grid', error )
        })
    }
    else {
      this.rasterService.getGridRaster(latRange, lonRange, monthYear.format('MM-YYYY'), pres, grid)
      .subscribe( (rasterGrids: RasterGrid[]) => {
        if (rasterGrids.length == 0) {
          console.log('warning: no grid')
        }
        else {
          this.generateRasterGrids(map, rasterGrids, lockRange)
        }
        },
        error => {
          console.log('error in getting grid', error )
        })
    }
  }

  private generateGridSections(features: FeatureCollection<any>, map: L.Map, lockRange: boolean): void {

    const globalGrid = this.queryGridService.getGlobalGrid()
    let bboxes = this.queryGridService.getBBoxes(features)
    if (globalGrid) {
      bboxes = [ [-180, -90, 180, 90] ]
    }
    if (bboxes) {
      const monthYear = this.queryGridService.getMonthYear()
      const pres = this.queryGridService.getPresLevel()
      const grid = this.queryGridService.getGrid()
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
    const globalGrid = this.queryGridService.getGlobalGrid()
    for( let idx in rasterGrids){
      let grid = rasterGrids[idx];

      this.gridLayers = this.rasterService.addCanvasToGridLayer(grid, this.gridLayers, map, globalGrid, colorScale)


      this.gridLayers.eachLayer((layer: any) => {
        if (lockRange) {
          const gridDomain = this.queryGridService.getGridDomain()
          const c = chroma.scale(colorScale).domain(gridDomain);
          layer.setColor(c)
        }
        else {
          const range = layer._field.range
          this.queryGridService.sendGridDomain(range, false, true)
        }
      })
      }
      this.gridLayers.addTo(map)
  }
}
