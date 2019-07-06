import { Injectable, EventEmitter, Output } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'


import * as _moment from 'moment';
import {Moment} from 'moment';
import { indexDebugNode } from '@angular/core/src/debug/debug_node';
const moment = _moment;

export interface GridRange {
  latMin: number,
  latMax: number,
  lonMin: number,
  lonMax: number,
}

@Injectable()
export class QueryGridService {

  @Output() change: EventEmitter<string> = new EventEmitter
  @Output() resetToStart: EventEmitter<string> = new EventEmitter
  @Output() clearLayers: EventEmitter<string> = new EventEmitter
  @Output() urlBuild: EventEmitter<string> = new EventEmitter

  private presLevel = 10;
  private monthYear = moment('01-2010', 'MM-YYYY')
  //private latLngShapes: number[][][];
  private latLngShapes: GeoJSON.FeatureCollection;

  constructor(private route: ActivatedRoute,
    private location: Location,
    private router: Router) { this.router.urlUpdateStrategy = 'eager' }

  public formatMonthYear(monthYear: Moment): string {
    const monthYearString = monthYear.format('MM-YYYY')
    return(monthYearString)
  }

  public resetParams(): void{
    const broadcastChange = false
    const monthYear = moment('01-2010', 'MM-YYYY')
    this.sendMonthYearMessage(monthYear, broadcastChange)
    const presLevel = 10;
    this.sendPresMessage(presLevel, broadcastChange)
  }

  public sendPresMessage(presLevel: number, broadcastChange=true): void {
    const msg = 'pres level change';
    this.presLevel = presLevel;
    if (broadcastChange){ this.change.emit(msg) }
  }

  public getPresLevel(): number {
    return this.presLevel;
  }

  public sendMonthYearMessage(monthYear: Moment, broadcastChange=true): void {
    const msg = 'month year change';
    this.monthYear = monthYear;
    if (broadcastChange){ this.change.emit(msg) }
  }

  public getMonthYear(): Moment {
    return this.monthYear;
  }

  public sendShapeMessage(features: GeoJSON.FeatureCollection, broadcastChange=true): void {
    let msg = 'shape change';
    this.latLngShapes = features;
    if (broadcastChange){ this.change.emit(msg) }
  }

  public getShapes(): GeoJSON.FeatureCollection {
    return this.latLngShapes;
  }

  public triggerResetToStart(): void {
    this.resetParams()
    this.resetToStart.emit()
    this.setURL()
  }

  public triggerClearLayers(): void {
    this.clearLayers.emit()
  }

  public setURL(): void {

    const presLevelString = JSON.stringify(this.presLevel)
    let shapesString = null
    let bboxes: number[][]
    if (this.latLngShapes) {
      bboxes = this.getBBoxes(this.latLngShapes)
      console.log(bboxes)
      shapesString = JSON.stringify(bboxes)
    }
    const monthYearString = this.formatMonthYear(this.monthYear)
    const queryParams = {
                         'presLevel': presLevelString, 
                         'monthYear': monthYearString,
                         'shapes': shapesString,
                        }
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: queryParams,
      });
  }

  public getBBoxes(fc: GeoJSON.FeatureCollection) {
    let bboxes = []
    const features = fc.features
    for (let idx in features) {
      const feature = features[idx];
      var geom: any
      geom = feature.geometry
      const coords = geom.coordinates.reduce(function(dump,part) {
        return dump.concat(part);
      }, [])
      let bbox = [ Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY,
        Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY,];

      bbox = coords.reduce(function(prev,coord) {
        return [
          Math.min(coord[0], prev[0]),
          Math.min(coord[1], prev[1]),
          Math.max(coord[0], prev[2]),
          Math.max(coord[1], prev[3])
        ];
      }, bbox);
      bboxes = bboxes.concat([bbox])
    }
    return bboxes
  }

  public setMapState(this, key: string, value: string): void {
    const notifyChange = false
    switch(key) {
      case 'monthYear': {
        const monthYear = moment(value, 'MM-YYYY')
        this.sendMonthYearMessage(monthYear, notifyChange)
        break;
      }
      case 'shapes': {
        const arrays = JSON.parse(value)
        this.sendShapeMessage(arrays, notifyChange)
        break;
      }
      case 'presLevel': {
        const presLevel = JSON.parse(value)
        this.sendPresMessage(presLevel, notifyChange)
        break;
      }
      default: {
        console.log('key not found. not doing anything')
        break;
    }
  }
}

}