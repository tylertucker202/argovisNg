import { Injectable, Output, EventEmitter, Injector } from '@angular/core'
import { QueryService } from './../home/services/query.service'
import * as moment from 'moment'
import { DateRange } from './../../typeings/daterange'
import { MapState } from './../../typeings/mapState'
@Injectable({
  providedIn: 'root'
})
export class ArQueryService extends QueryService {

  @Output() arEvent: EventEmitter<number[][][]> = new EventEmitter

  private arDate = moment(new Date( 2010, 0, 1, 0, 0, 0, 0))
  private arShapes: number[][][]
  private arMode = true
  private arDateRange = [-18, 18]

  constructor( public injector: Injector ) { super(injector) }

  public resetParams(): void{
    console.log('reset params pressed')
    const broadcastChange = false
    this.sendDeepToggleMsg(false, broadcastChange)
    this.sendBGCToggleMsg(false, broadcastChange)
    this.sendRealtimeMsg(true, broadcastChange)
    this.sendThreeDayMsg(false, broadcastChange)
    const globalDisplayDate = moment().utc().subtract(2, 'days').format('YYYY-MM-DD')
    this.sendGlobalDate(globalDisplayDate, broadcastChange)
    const presRange = [0, 2000]
    this.sendPres(presRange, broadcastChange)
    const clearOtherShapes = false
    const arDate = moment(new Date( 2010, 0, 1, 0, 0, 0, 0))
    const arDateRange = [-18, 18]
    let selectionDateRange: DateRange
    const arMode = true
    selectionDateRange = {
                          startDate: arDate.add(arDateRange[0], 'hours').format('YYYY-MM-DD'),
                          endDate: arDate.add(arDateRange[1], 'hours').format('YYYY-MM-DD'),
                          label: 'initial arMode date range'
                        };
    this.sendSelectedDate(selectionDateRange, broadcastChange)
    this.sendArMode(arMode, broadcastChange, clearOtherShapes)
    this.sendArDate(arDate)
    this.sendArDateRange(arDateRange)
  }

  public triggerClearLayers(): void {
    this.clearLayers.emit()
  }

  public triggerResetToStart(): void {
    this.resetParams()
    this.resetToStart.emit()
    this.setURL()
  }

  public setURL(): void {

    const arDateRangeString = JSON.stringify(this.arDateRange)
    const arDateString = this.arDate.toISOString()
    let shapesString = null
     const shapes = this.getShapes()
     if (shapes) {
       shapesString = JSON.stringify(shapes)
    }
    const queryParams = {
                         'includeRealtime': this.getRealtimeToggle(),
                         'onlyBGC': this.getBGCToggle(),
                         'onlyDeep': this.getDeepToggle(),
                         'arMode': this.arMode,
                         'arDateRange': arDateRangeString,
                         'arDate': arDateString
                        }
    this.router.navigate(
      [], 
      {
        relativeTo: this.route,
        queryParams: queryParams,
      });
  }

  public getArDateRange(): number[] {
    return [...this.arDateRange]
  }

  public sendArDateRange(dateRange: number[], broadcastChange=true): void {
    this.arDateRange = dateRange
    if (broadcastChange) { this.change.emit('ar date range change') }
  }

  private formatDate(date: moment.Moment): string {
    return date.format("YYYY-MM-DDTHH:mm:ss") + 'Z'
  }

  public getArDateAsDateRange(): DateRange {
    const startDate = this.formatDate(this.arDate.clone().add(this.arDateRange[0], 'h'))
    const endDate = this.formatDate(this.arDate.clone().add(this.arDateRange[1], 'h'))
    const dateRange: DateRange = {startDate: startDate, endDate: endDate, label: ''}
    return dateRange
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
  public sendARShapes(data: number[][][], broadcastChange=true): void {
    let msg = 'ar shape'
    this.arShapes = data
    if (broadcastChange) { this.change.emit('ar shape change')}
  }

  public getArShapes(): number[][][] {
    return this.arShapes
  }

  public setParamsFromURL(msg='got state from map component'): void{
    let mapState: MapState
    this.route.queryParams.subscribe(params => {
      mapState = params
      Object.keys(mapState).forEach(key => {
        this.arSetMapState(key, mapState[key])
      });
      this.urlBuild.emit(msg)
    });
  }
 

  public arSetMapState(key: string, value: string): void {
    const notifyChange = false
    switch(key) {
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
      case 'arMode': {
        const arMode = JSON.parse(value)
        this.sendArMode(arMode, notifyChange)
      }
      case 'arDateRange': {
        const arDateRange = JSON.parse(value)
        this.sendArDateRange(arDateRange)
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
