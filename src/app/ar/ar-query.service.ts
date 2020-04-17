import { Injectable, Output, EventEmitter, Injector } from '@angular/core';
import { QueryService } from './../home/services/query.service'
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'
import * as moment from 'moment';
import { DateRange } from './../../typeings/daterange'
@Injectable({
  providedIn: 'root'
})
export class ArQueryService extends QueryService {

  @Output() arEvent: EventEmitter<string> = new EventEmitter


  private arDate = moment(new Date( 2010, 0, 1, 0, 0, 0, 0))
  private arShapes: number[][][]
  private arMode = false
  private arDateRange = [-18, 18]

  constructor( public injector: Injector ) { super(injector) }

  public checkArModule(route: ActivatedRoute): void {
    if (route.data) {
      route.data.subscribe(v => {
          const broadcastChange = false
          const clearOtherShapes = false
          const selectionDateRange: DateRange = {startDate: this.arDate.add(this.arDateRange[0], 'hours').format('YYYY-MM-DD'),
          endDate: this.arDate.add(this.arDateRange[1], 'hours').format('YYYY-MM-DD'), label: 'initial arMode date range'};
          this.sendSelectedDate(selectionDateRange, broadcastChange)
          this.sendArMode(true, broadcastChange, clearOtherShapes) 
      })
    }
  }

  public resetParams(): void{
    const broadcastChange = false
    this.sendDeepToggleMsg(false, broadcastChange)
    this.sendBGCToggleMsg(false, broadcastChange)
    this.sendRealtimeMsg(true, broadcastChange)
    const globalDisplayDate = moment().utc().subtract(2, 'days').format('YYYY-MM-DD');
    this.sendGlobalDate(globalDisplayDate, broadcastChange)
    const presRange = [0, 2000]
    this.sendPres(presRange, broadcastChange)
    const clearOtherShapes = false
    const arDate = moment(new Date( 2010, 0, 1, 0, 0, 0, 0))
    const arDateRange = [-18, 18]
    let selectionDateRange: DateRange
    let sendThreeDayMsg: boolean
    const arMode = true
    sendThreeDayMsg = false
    selectionDateRange = {startDate: arDate.add(arDateRange[0], 'hours').format('YYYY-MM-DD'),
    endDate: arDate.add(arDateRange[1], 'hours').format('YYYY-MM-DD'), label: 'initial arMode date range'};
    this.sendThreeDayMsg(sendThreeDayMsg, broadcastChange)
    this.sendSelectedDate(selectionDateRange, broadcastChange)
    this.sendArMode(arMode, broadcastChange, clearOtherShapes)
    this.sendArDate(arDate)
    this.sendArDateRange(arDateRange)
  }

  public setURL(): void {

    //this is reversing the order of this.latLngShapes()
    const presRangeString = JSON.stringify(this.getPresRange())
    const arDateRangeString = JSON.stringify(this.arDateRange)
    const arDateString = this.arDate.toISOString()
    let shapesString = null
    const shapes = this.getShapes()
    if (shapes) {
      shapesString = JSON.stringify(shapes)
    }
    const queryParams = {
                         'mapProj': this.getProj(),
                         'presRange': presRangeString, 
                         'selectionStartDate': this.getSelectionDates().startDate,
                         'selectionEndDate': this.getSelectionDates().endDate,
                         'threeDayEndDate': this.getThreeDayToggle(),
                         'shapes': shapesString,
                         'includeRealtime': this.getRealtimeToggle(),
                         'onlyBGC': this.getBGCToggle(),
                         'onlyDeep': this.getDeepToggle(),
                         'threeDayToggle': this.getThreeDayToggle(),
                         'arMode': this.arMode,
                         'arDateRange': arDateRangeString,
                         'arDate': arDateString
                        }
    this.router.navigate(
      [], 
      {
        relativeTo: this.route,
        queryParams: queryParams,
        //queryParamsHandling: "merge"
      });
  }

  public getArDateRange(): number[] {
    return [...this.arDateRange]
  }

  public sendArDateRange(dateRange: number[]): void {
    this.arDateRange = dateRange
  }

  public sendArMode(arMode: boolean, broadcastChange=false, clearOtherShapes=true) {
    const msg = 'arMode'
    this.arMode = arMode;
    if (clearOtherShapes) { this.clearLayers.emit('ar more activated') }
    if (broadcastChange) { this.change.emit(msg) }
  }

  public getArMode(): boolean {
    return this.arMode
  }

  public sendArDate(date: moment.Moment): void {
    this.arDate = date
  }

  public getArDate(): moment.Moment {
    return this.arDate
  }
  public sendARShapes(data: number[][][]): void {
    let msg = 'ar shape'
    this.arShapes = data
  }

  public getARShapse(): number[][][] {
    return this.arShapes
  }

  public setMapState(this, key: string, value: string): void {
    const notifyChange = false
    switch(key) {
      case 'mapProj': {
        this.setProj(value)
        break
      }
      case 'includeRealtime': {
        const includeRealtime = JSON.parse(value)
        this.sendRealtimeMsg(includeRealtime, notifyChange)
        break
      }
      case 'onlyBGC': {
        const onlyBGC = JSON.parse(value)
        this.sendBGCToggleMsg(onlyBGC, notifyChange)
        break
      }
      case 'onlyDeep': {
        const onlyDeep = JSON.parse(value)
        this.sendDeepToggleMsg(onlyDeep, notifyChange)
        break;
      }
      case 'threeDayToggle': {
        const threeDayToggle = JSON.parse(value)
        this.sendThreeDayMsg(threeDayToggle, notifyChange)
        break
      }
      case 'threeDayEndDate': {
        const globalDisplayDate = value
        this.sendGlobalDate(globalDisplayDate, notifyChange)
        break
      }
      case 'shapes': {
        const arrays = JSON.parse(value)
        const toggleThreeDayOff = false
        this.sendShape(arrays, notifyChange, toggleThreeDayOff)
        break
      }
      case 'selectionStartDate': {
        const stateDateRange = {startDate: value, endDate: this.selectionDateRange.endDate}
        this.sendSelectedDate(stateDateRange, notifyChange)
        break
      }
      case 'selectionEndDate': {
        const stateDateRange = {startDate: this.selectionDateRange.startDate, endDate: value}
        this.sendSelectedDate(stateDateRange, notifyChange)
        break
      }
      case 'presRange': {
        const presRange = JSON.parse(value)
        this.sendPres(presRange, notifyChange)
        break
      }
      case 'arMode': {
        const arMode = JSON.parse(value)
        const clearOtherShapes = false
        this.sendArMode(arMode, notifyChange, clearOtherShapes)
        break
      }
      case 'arDateRange': {
        const arDateRange = JSON.parse(value)
        this.sendArDateRange(arDateRange, notifyChange)
        break
      }
      case 'arDate': {
        const arDate = moment(value)
        this.sendArDate(arDate)
        break
      }
      default: {
        console.log('key not found. not doing anything: ', key)
        break;
    }
  }
}

}
