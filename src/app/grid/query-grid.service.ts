import { Injectable, EventEmitter, Output } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'


import * as _moment from 'moment';
import {Moment} from 'moment';
const moment = _moment;

@Injectable()
export class QueryGridService {

  @Output() change: EventEmitter<string> = new EventEmitter
  @Output() resetToStart: EventEmitter<string> = new EventEmitter
  @Output() clearLayers: EventEmitter<string> = new EventEmitter
  @Output() urlBuild: EventEmitter<string> = new EventEmitter

  private presLevel = 10;
  private monthYear = moment('2010-01', 'YYYY-MM')
  private latLngShapes: number[][][];

  constructor(private route: ActivatedRoute,
    private location: Location,
    private router: Router) { this.router.urlUpdateStrategy = 'eager' }

  public formatMonthYear(monthYear: Moment): string {
    const monthYearString = monthYear.format('YYYY-MM')
    return(monthYearString)
  }

  public resetParams(): void{
    const broadcastChange = false
    const monthYear = moment('2010-01', 'YYYY-MM')
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

  public sendShapeMessage(shapes: number[][][], broadcastChange=true): void {
    let msg = 'shape change';
    this.latLngShapes = shapes;
    if (broadcastChange){ this.change.emit(msg) }
  }

  public getShapes(): number[][][] {
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
    if (this.latLngShapes) {
      shapesString = JSON.stringify(this.latLngShapes)
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

  public setMapState(this, key: string, value: string): void {
    const notifyChange = false
    switch(key) {
      case 'monthYear': {
        const monthYear = moment(value, 'YYYY-MM')
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
