import { Injectable, EventEmitter, Output } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { MapState } from './../../typeings/mapState'
import * as moment from 'moment'
import {Moment} from 'moment'
import { FeatureCollection, Feature, Polygon } from 'geojson'

@Injectable()
export class QueryGridService {

  @Output() change: EventEmitter<string> = new EventEmitter
  @Output() update_colorbarEvent: EventEmitter<string> = new EventEmitter
  @Output() resetToStart: EventEmitter<string> = new EventEmitter
  @Output() clear_layers: EventEmitter<string> = new EventEmitter
  @Output() urlRead: EventEmitter<string> = new EventEmitter

  private presLevel = 10
  private date = moment('2012-01-01', 'YYYY-MM-DD').utc(false)
  private mapState: MapState
  private gridName = 'rgTempAnom'
  private param = 'tempAnomaly' //total anomaly or mean
  private gridParam: string
  private compareGrid: string
  private boundingBox = [[-40, -70, 0, -30]]
  public  startView = {lat: -30, lng: -15} as L.LatLng
  public startZoom = 3
  private compare = false
  private paramMode = false
  private interpolateBool = false
  private colorScale = 'balance'
  private inverseColorScale = false
  private gridDomain = [0, 1]

  constructor(private route: ActivatedRoute,
              private router: Router) { this.router.urlUpdateStrategy = 'eager' }

  public format_date(date: Moment): string {
    const dateString = date.format('YYYY-MM-DD')
    return(dateString)
  }

  public reset_params(): void{
    const broadcastChange = false
    const date = moment('2012-01-01', 'YYYY-MM-DD').utc(false)
    this.sendDate(date, broadcastChange)
    const presLevel = 10
    this.send_pres(presLevel, broadcastChange)
    this.colorScale = 'balance'
    this.inverseColorScale = false
    this.gridDomain = [0, 1]
    this.param = 'tempAnomaly'
    this.paramMode = false
    this.compare = false
    //this.clear_shapes()
    this.boundingBox = [[-30, 0, -70, -40]]
    this.set_url()
    this.resetToStart.emit('reset params pushed')
  }

  public send_pres(presLevel: number, broadcastChange=true): void {
    const msg = 'pres level change'
    this.presLevel = presLevel
    if (broadcastChange){ this.change.emit(msg) }
  }

  public getPresLevel(): number {
    return this.presLevel
  }

  public getGridDomain(): number[] {
    return [...this.gridDomain] //return immutable object
  }

  public sendGridDomain(lowerRange: number, upperRange: number , broadcastChange=true): void {
    const msg = 'grid range changed'
    const gridDomain = [lowerRange, upperRange]
    this.gridDomain = [+(gridDomain[0].toFixed(3)), +(gridDomain[1].toFixed(3))]
    this.set_url()
    if (broadcastChange) {this.change.emit(msg)}
  }

  public sendColorScale(colorScale: string, broadcastChange=true): void {
    let msg = 'color scale change'
    this.colorScale = colorScale
    if (broadcastChange) { this.change.emit(msg) }
  }

  public getColorScale(): string {
    return this.colorScale
  }

  public sendInverseColorScale(inverseColorScale: boolean, broadcastChange=true): void {
    let msg = 'color scale inverted'
    this.inverseColorScale = inverseColorScale
    if (broadcastChange) { this.change.emit(msg) }
  }

  public getInverseColorScale(): boolean {
    return this.inverseColorScale
  }
  public sendDate(date: Moment, broadcastChange=true, init=false): void {
    if (!date.isValid) { date = moment('2007-01-01', 'YYYY-MM-DD').utc(false) }
    this.date = date
    const msg = 'date changed'
    if (broadcastChange){ this.change.emit(msg) }
  }

  public getDate(): Moment {
    return this.date
  }

  public send_shape(bboxes: number[][], broadcastChange=true): void {
    let msg = 'shape change'
    this.boundingBox = bboxes
    if (broadcastChange){ this.change.emit(msg) }
  }

  public get_shapes(): number[][] {
    return this.boundingBox
  }

  public sendGrid(gridName: string, broadcastChange=true): void {
    let msg = 'grid change'
    this.gridName = gridName
    if (broadcastChange) { this.change.emit(msg) }
  }

  public getGridName(): string {
    return this.gridName
  }

  public sendGridParam(grid: string, gridParam: string, broadcastChange=true): void {
    let msg = 'grid param change'
    this.gridName = grid
    this.gridParam = gridParam
    if (broadcastChange) { this.change.emit(msg) }
  }

  public getGridParam(): string {
    return this.gridParam
  }

  public sendProperty(param: string, broadcastChange=true): void {
    let msg = 'param change'
    this.param = param
    if (broadcastChange) { this.change.emit(msg) }
  }

  public getProperty(): string {
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

  public clear_shapes(): void {
    this.boundingBox = null
  }

  public getInterplateBool(): boolean {
    return this.interpolateBool
  }

  public sendInterpolateBool(interpolateBool: boolean, broadcastChange=true): void {
    const msg = 'interpolateBool toggled'
    this.interpolateBool = interpolateBool
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

  public trigger_reset_to_start(): void {
    this.reset_params()
    this.resetToStart.emit()
    this.set_url()
  }

  public trigger_clear_layers(): void {
    this.clear_layers.emit()
  }

  public getBBoxes(fc: FeatureCollection<Polygon>): number[][]{
    let bboxes = []
    fc.features.forEach((feature: Feature<Polygon>) => {
      const bbox = this.getBBox(feature)
      bboxes.push(bbox)
    })
    return bboxes
  }

  public set_url(): void {

    const presLevelString = JSON.stringify(this.presLevel)
    const gridDomainStr = JSON.stringify(this.gridDomain)
    let shapesString = null
    let bboxes: number[][]
    if (this.boundingBox) {
      bboxes = this.boundingBox
      shapesString = JSON.stringify(bboxes)
    }
    const interpolateBool = JSON.stringify(this.getInterplateBool())
    const inverseColorScale = JSON.stringify(this.getInverseColorScale())
    const dateString = this.format_date(this.date)
    let queryParams = {
                         'presLevel': presLevelString, 
                         'date': dateString,
                         'shapes': shapesString,
                         'gridName': this.gridName,
                         'interpolateBool': interpolateBool,
                         'colorScale': this.colorScale,
                         'inverseColorScale': inverseColorScale,
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

  public set_params_from_url(msg: string): void {
    this.route.queryParams.subscribe(params => {
      this.mapState = params
      Object.keys(this.mapState).forEach((key) => {
        this.set_map_state(key, this.mapState[key])
      })
      //wait a few for the other components to load
      console.log('emitting url read message')
      setTimeout(() => {
        this.urlRead.emit(msg)
      },100);
    })
  }

  private set_map_state(this, key: string, value: string): void {
    const notifyChange = false
    switch(key) {
      case 'colorScale': {
        const colorScale = value
        this.sendColorScale(colorScale, notifyChange)
        break
      }
      case 'inverseColorScale': {
        const inverseColorScale = JSON.parse(value)
        this.sendInverseColorScale(inverseColorScale, notifyChange)
      }
      case 'paramMode': {
        const paramMode = JSON.parse(value)
        this.sendParamMode(paramMode, notifyChange)
        break
      }
      case 'gridParam': {
        const param = value
        const grid = 'ksSpaceTempTrend' //default grid if param but no grid
        this.sendGridParam(grid, param, notifyChange)
        break
      }
      case 'param': {
        const param = value
        this.sendProperty(param, notifyChange)
        break
      }
      case 'date': {
        const date = moment(value, 'YYYY-MM-DD').utc()
        const init = true
        if (date.isValid)  { this.sendDate(date, notifyChange, true) }
        break
      }
      case 'gridName': {
        const gridName = value
        this.sendGrid(gridName, notifyChange)
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
        this.send_shape(arrays, notifyChange)
        break
      }
      case 'interpolateBool': {
        const interpolateBool = JSON.parse(value)
        this.sendInterpolateBool(interpolateBool, notifyChange)
        break
      }
      case 'presLevel': {
        const presLevel = JSON.parse(value)
        this.send_pres(presLevel, notifyChange)
        break
      }
      case 'gridDomain': {
        const gridDomain = JSON.parse(value)
        this.sendGridDomain(gridDomain[0], gridDomain[1], notifyChange)
        break
      }
      default: {
        console.log('key not found. not doing anything', key, value)
        break
    }
  }
}

}
