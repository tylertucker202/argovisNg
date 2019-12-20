import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { FeatureCollection, Feature, Polygon } from 'geojson'
import { MapService } from './../home/services/map.service'
import { QueryGridService } from './query-grid.service'
import { RasterService } from './raster.service'
import { RasterGrid, RasterParam } from './../home/models/raster-grid'


import * as d3 from 'd3'; //needed for leaflet canvas layer
import * as L from "leaflet";

@Injectable({
  providedIn: 'root'
})
export class GridMappingService {

  public gridLayers = L.layerGroup();

  constructor(private queryGridService: QueryGridService,
              private rasterService: RasterService,
              public mapService: MapService,) { }

  private updateGridRangeFromLayers(): void {
    let gridRanges = []
    this.gridLayers.eachLayer((layer: any) => {
      const gridRange = layer._field.range
      gridRanges = gridRanges.concat(gridRange)
    })

    const broadcastChange = false
    if (gridRanges.length > 0) {
      const newGridRange = [Math.min(...gridRanges), Math.max(...gridRanges)]
      this.queryGridService.sendGridRange(newGridRange, broadcastChange)
      console.log('new grid range:', newGridRange, gridRanges)
    }
  }

  private updateGridRange(layerGridRange: number[], updateColorBar=false): number[] {
    let gridRange = this.queryGridService.getGridRange()
    const minG = gridRange[0]
    const maxG = gridRange[1]

    const newMinG =  Math.min(...[minG, layerGridRange[0] ] )
    const newMaxG = Math.max(...[maxG, layerGridRange[1] ] )

    if (minG != newMinG || maxG != newMaxG) {
      const broadcastChange = false
      gridRange = [newMinG, newMaxG]
      this.queryGridService.sendGridRange(gridRange, broadcastChange, updateColorBar)
    }
    return(gridRange)
    
  }

  private updateGrids(map: L.Map): void {
    let newGridLayers = new L.LayerGroup()
    const colorScale = this.queryGridService.getColorScale()
    const gridRange = this.queryGridService.getGridRange()
    const globalGrid = this.queryGridService.getGlobalGrid()
    this.gridLayers.eachLayer((layer: any) => {
      //console.log('making new layer', layer)
      const layerGridRange = layer._field.range
      const gridRange = this.updateGridRange(layerGridRange)
      const grid = this.rasterService.buildGridFromLayer(layer)
      newGridLayers = this.rasterService.addCanvasToGridLayer(grid, newGridLayers, map, globalGrid, colorScale, gridRange)
    })
    this.gridLayers.clearLayers()
    this.gridLayers = newGridLayers
    this.gridLayers.addTo(map)
  }

  public redrawGrids(map: L.Map, setUrl=true, queryGrids=true): void {
    //gets shapes, removes layers, redraws shapes and requeries database before setting the url.
    console.log('redrawing grids')
    const broadcastChange = false
    
    if (queryGrids) {
      this.gridLayers.clearLayers();
      const shapes = this.mapService.drawnItems.toGeoJSON()
      this.queryGridService.sendShapeMessage(shapes, broadcastChange)
      let features = this.queryGridService.getShapes()
      this.addGridSelectionToMap(features, map);
      this.updateGridRangeFromLayers()
    }
    else {
      this.updateGrids(map)
    }
    this.queryGridService.updateColorbar.emit('redrawn grids')

    if(setUrl){
      this.queryGridService.setURL(); //this should be the last thing
    }
  }

  public addGridSelectionFromFeatureToMap(bbox: number[], map: L.Map, 
                                          monthYear, pres, grid, compareGrid, compare, displayGridParam,
                                          gridParam) {
    const lonRange = [bbox[0], bbox[2]]
    const latRange = [bbox[1], bbox[3]]

    if (compare && !displayGridParam) {
      this.rasterService.getTwoGridRasterProfiles(latRange, lonRange, monthYear.format('MM-YYYY'), pres, grid, compareGrid)
      .subscribe( (rasterGrids: [RasterGrid[], RasterGrid[]]) => {
        if (rasterGrids.length != 2) {
          console.log('warning missing: a grid')
        }
        else {
          let dGrid = this.rasterService.makeDiffGrid(rasterGrids)
          this.addRasterGridsToMap(map, dGrid)
        }
        },
        error => {
          console.log('error in getting grid', error )
        })
    }
    else if (!compare && displayGridParam) {
      console.log('gridParam mode active plotting: ', gridParam, ' for grid: ', grid)
      this.rasterService.getParamRaster(latRange, lonRange, pres, grid, gridParam).subscribe( (rasterParam: RasterParam[]) => {
        if (rasterParam.length == 0) {
          console.log('warning missing: a param')
        }
        else {
          this.addRasterGridsToMap(map, rasterParam)
        }
        },
        error => {
          console.log('error in getting grid', error )
        })
    }
    else if (compare && displayGridParam) {
      console.log('gridParam mode with compare plotting: ', gridParam, ' for grid: ', grid)
      this.rasterService.getTwoParamRaster(latRange, lonRange, pres, grid, gridParam, compareGrid).subscribe( (rasterParams: [RasterParam[], RasterParam[]]) => {
        if (rasterParams.length !=2 ) {
          console.log('warning missing: a param')
        }
        else {
          let dGrid = this.rasterService.makeDiffGrid(rasterParams)
          this.addRasterGridsToMap(map, dGrid)
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
          this.addRasterGridsToMap(map, rasterGrids)
        }
        },
        error => {
          console.log('error in getting grid', error )
        })
    }
  }

  public addGridSelectionToMap(features: FeatureCollection<any>, map: L.Map): void {

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
  
      const displayGridParam = this.queryGridService.getDisplayGridParam()
      const gridParam = this.queryGridService.getGridParam()
      
      bboxes.forEach( (bbox: number[]) => {
        this.addGridSelectionFromFeatureToMap(bbox, map, monthYear, pres, grid, compareGrid, compare, displayGridParam, gridParam)
      })
    }
  }

  public addRasterGridsToMap(map: L.Map, rasterGrids: RasterGrid[] | RasterParam[]): void {
    const colorScale = this.queryGridService.getColorScale()
    const gridRange = this.queryGridService.getGridRange()
    const globalGrid = this.queryGridService.getGlobalGrid()
    for( let idx in rasterGrids){
      let grid = rasterGrids[idx];
      this.gridLayers = this.rasterService.addCanvasToGridLayer(grid, this.gridLayers, map, globalGrid, colorScale, gridRange)
      this.gridLayers.addTo(map)
    }
  }
}
