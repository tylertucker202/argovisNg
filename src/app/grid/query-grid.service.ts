import { Injectable, EventEmitter, Output } from '@angular/core'
import { Location } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { MapState } from './../../typeings/mapState'
import { SelectGridService} from './select-grid.service'

import * as moment from 'moment'
import {Moment} from 'moment'
import { FeatureCollection, Feature, Polygon, Geometry } from 'geojson'

@Injectable()
export class QueryGridService {

  @Output() change: EventEmitter<string> = new EventEmitter
  @Output() updateColorbar: EventEmitter<string> = new EventEmitter
  @Output() resetToStart: EventEmitter<string> = new EventEmitter
  @Output() clearLayers: EventEmitter<string> = new EventEmitter
  @Output() urlBuild: EventEmitter<string> = new EventEmitter

  private presLevel = 10
  private monthYear = moment('01-2007', 'MM-YYYY').utc(false)
  private mapState: MapState
  private grid = 'rgTempAnom'
  private param = 'total'
  private gridParam: string
  private compareGrid: string
  private latLngShapes: FeatureCollection<Polygon>
  private compare = false
  private paramMode = false
  private globalGrid = false
  private colorScale = 'OrRd'
  private gridDomain = [0, 1]

  constructor(private route: ActivatedRoute,
              private location: Location,
              private router: Router) { this.router.urlUpdateStrategy = 'eager' }

  public formatMonthYear(monthYear: Moment): string {
    const monthYearString = monthYear.format('MM-YYYY')
    return(monthYearString)
  }

  public resetParams(): void{
    const broadcastChange = false
    const monthYear = moment('01-2007', 'MM-YYYY').utc(false)
    this.sendmonthYear(monthYear, broadcastChange)
    const presLevel = 10
    this.sendPres(presLevel, broadcastChange)
    this.colorScale = 'OrRd'
    this.gridDomain = [0, 1]
    this.param = 'total'
    this.paramMode = false
    this.compare = false
    this.clearShapes()
    this.setURL()
    this.resetToStart.emit('reset params pushed')
  }

  public sendPres(presLevel: number, broadcastChange=true): void {
    const msg = 'pres level change'
    this.presLevel = presLevel
    if (broadcastChange){ this.change.emit(msg) }
  }

  public getPresLevel(): number {
    return this.presLevel
  }

  public getGridDomain(): number[] {
    return this.gridDomain
  }

  public sendGridDomain(gridDomain: number[], broadcastChange=true, updateColorBar=true): void {
    const msg = 'grid range changed'
    this.gridDomain = [+(gridDomain[0].toFixed(3)), +(gridDomain[1].toFixed(3))]
    this.setURL()
    if (updateColorBar) { this.updateColorbar.emit(msg) }
    else if (broadcastChange) {this.change.emit(msg)}
  }

  public sendColorScale(colorScale: string, broadcastChange=true): void {
    let msg = 'color scale change'
    this.colorScale = colorScale
    if (broadcastChange) { this.change.emit(msg) }
  }

  public getColorScale(): string {
    return this.colorScale
  }

  public sendmonthYear(monthYear: Moment, broadcastChange=true): void {
    const msg = 'month year change'
    if (!monthYear.isValid) {
      monthYear = moment('01-2007', 'MM-YYYY').utc(false)
    }
    this.monthYear = monthYear
    if (broadcastChange){ this.change.emit(msg) }
  }

  public getMonthYear(): Moment {
    return this.monthYear
  }

  public sendShape(features: FeatureCollection<Polygon>, broadcastChange=true): void {
    let msg = 'shape change'
    this.latLngShapes = features
    if (broadcastChange){ this.change.emit(msg) }
  }

  public getShapes(): FeatureCollection<Polygon> {
    return this.latLngShapes
  }

  public sendGrid(grid: string, broadcastChange=true): void {
    let msg = 'grid change'
    this.grid = grid
    if (broadcastChange) { this.change.emit(msg) }
  }

  public getGrid(): string {
    return this.grid
  }

  public sendGridParam(grid: string, gridParam: string, broadcastChange=true): void {
    let msg = 'grid param change'
    this.grid = grid
    this.gridParam = gridParam
    if (broadcastChange) { this.change.emit(msg) }
  }

  public getGridParam(): string {
    return this.gridParam
  }

  public sendParam(param: string, broadcastChange=true): void {
    let msg = 'param change'
    this.param = param
    if (broadcastChange) { this.change.emit(msg) }
  }

  public getParam(): string {
    return this.param
  }

  public sendCompareGrid(grid: string, broadcastChange=true): void {
    let msg = 'compare grid change'
    this.compareGrid = grid
    if (broadcastChange) { this.change.emit(msg) }
  }

  public getCompareGrid(): string {
    return this.compareGrid
  }

  public sendParamMode(paramMode: boolean, broadcastChange=true): void {
    let msg = 'display grid param change'
    this.paramMode = paramMode
    if (broadcastChange) { this.change.emit(msg) }
  }

  public getParamMode(): boolean {
    return this.paramMode
  }

  public clearShapes(): void {
    this.latLngShapes = null
  }

  public getGlobalGrid(): boolean {
    return this.globalGrid
  }

  public sendGlobalGrid(globalGrid: boolean, broadcastChange=true): void {
    const msg = 'global grid toggle'
    this.globalGrid = globalGrid
    if (broadcastChange) { this.change.emit(msg)}
  }

  public sendCompare(compareToggle: boolean, broadcastChange=true): void {
    const msg = 'compare grid toggled'
    this.compare = compareToggle
    if (broadcastChange) { this.change.emit(msg)}
  }

  public getCompare(): boolean {
    return this.compare
  }

  public getShapeArray(fc: FeatureCollection<Polygon>): number[][][] {
    let shapeArray = []
    fc.features.forEach( (feature) => {
      let latLngArray = []
      const coordinates = feature.geometry.coordinates[0]
      coordinates.forEach( (coord) => {
        const latLng = [coord[1], coord[0]]
        latLngArray.push(latLng)
      })
      shapeArray.push(latLngArray)
    })
    return shapeArray
  }

  public triggerResetToStart(): void {
    this.resetParams()
    this.resetToStart.emit()
    this.setURL()
  }

  public triggerClearLayers(): void {
    this.clearLayers.emit()
  }

  public getBBoxes(fc: FeatureCollection<Polygon>): number[][]{
    let bboxes = []
    fc.features.forEach((feature: Feature<Polygon>) => {
      const bbox = this.getBBox(feature)
      bboxes.push(bbox)
    })
    return bboxes
  }

  public setURL(): void {

    const presLevelString = JSON.stringify(this.presLevel)
    const gridDomainStr = JSON.stringify(this.gridDomain)
    let shapesString = null
    let bboxes: number[][]
    if (this.latLngShapes) {
      bboxes = this.getBBoxes(this.latLngShapes)
      shapesString = JSON.stringify(bboxes)
    }
    const globalGrid = JSON.stringify(this.getGlobalGrid())
    const monthYearString = this.formatMonthYear(this.monthYear)
    let queryParams = {
                         'presLevel': presLevelString, 
                         'monthYear': monthYearString,
                         'shapes': shapesString,
                         'grid': this.grid,
                         'displayGlobalGrid': globalGrid,
                         'colorScale': this.colorScale,
                         'paramMode': this.paramMode,
                         'gridParam': this.gridParam,
                         'param': this.param,
                         'gridDomain': gridDomainStr
                        }
    if (this.compare) {
      queryParams['compareGrid'] = this.compareGrid
    }
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: queryParams,
      })
  }

  public getBBox(feature: Feature<Polygon>): number[] {
    var geom: Polygon
    geom = feature.geometry
    const coords = geom.coordinates.reduce(function(dump,part) {
      return dump.concat(part)
    }, [])
    let bbox = [ Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY,]

    bbox = coords.reduce(function(prev,coord) {
      return [
        Math.min(coord[0], prev[0]),
        Math.min(coord[1], prev[1]),
        Math.max(coord[0], prev[2]),
        Math.max(coord[1], prev[3])
      ]
    }, bbox)
    
    return bbox
  }

  //todo: cast as Feature and FeatureCollection types
  private convertShapeToFeatureCollection(shapes: number[][]): FeatureCollection<Polygon> {

    let fc: FeatureCollection<Polygon> = { type: 'FeatureCollection',
    features: [] 
    }

    shapes.forEach( (shape) => {
      let feature: Feature<Polygon> = {type: "Feature", geometry: null, properties: null}
      
      let geom: Polygon = { type: 'Polygon', coordinates: [] }
      const ll = [shape[0], shape[1]]
      const ur = [shape[2], shape[3]]
      const ul = [ll[0], ur[1]]
      const lr = [ur[0], ll[1]]
      const coordinates = [ll, ul, ur, lr, ll]
      geom.coordinates = [coordinates]
      feature.geometry = geom
      fc.features.push(feature)
    })

    return(fc)
  }

  public setParamsFromURL(): void {
    this.route.queryParams.subscribe(params => {
      this.mapState = params
      Object.keys(this.mapState).forEach((key) => {
        this.setMapState(key, this.mapState[key])
      })
      this.urlBuild.emit('got state from map component')
    })
  }

  public setMapState(this, key: string, value: string): void {
    const notifyChange = false
    switch(key) {
      case 'colorScale': {
        const colorScale = value
        this.sendColorScale(colorScale, notifyChange)
        break
      }
      case 'paramMode': {
        const paramMode = JSON.parse(value)
        this.sendParamMode(paramMode, notifyChange)
        break
      }
      case 'gridParam': {
        const param = value
        //const grid = this.getGrid()
        const grid = 'ksSpaceTempTrend' //default grid if param but no grid
        this.sendGridParam(grid, param, notifyChange)
        break
      }
      case 'param': {
        const param = value
        this.sendParam(param, notifyChange)
        break
      }
      case 'monthYear': {
        const monthYear = moment(value, 'MM-YYYY').utc()
        if (monthYear.isValid)  { this.sendmonthYear(monthYear, notifyChange) }
        break
      }
      case 'grid': {
        const grid = value
        this.sendGrid(grid, notifyChange)
        break
      }
      case 'compareGrid': {
        const grid = value
        this.compare = true
        this.sendCompareGrid(grid, notifyChange)
        break
      }
      case 'shapes': {
        const arrays = JSON.parse(value)
        const fc = this.convertShapeToFeatureCollection(arrays)
        this.sendShape(fc, notifyChange)
        break
      }
      case 'displayGlobalGrid': {
        const globalGrid = JSON.parse(value)
        this.sendGlobalGrid(globalGrid, notifyChange)
        break
      }
      case 'presLevel': {
        const presLevel = JSON.parse(value)
        this.sendPres(presLevel, notifyChange)
        break
      }
      case 'gridDomain': {
        const gridDomain = JSON.parse(value)
        this.sendGridDomain(gridDomain, notifyChange)
        break
      }
      default: {
        console.log('key not found. not doing anything', key, value)
        break
    }
  }
}

}
