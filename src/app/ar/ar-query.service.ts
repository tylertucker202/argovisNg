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
  private arDateRange = [-18, 18]
  private displayGlobally = true

  constructor( public injector: Injector ) { super(injector) }

  public resetParams(): void{
    console.log('reset params pressed')
    const broadcastChange = false
    this.sendDeepToggleMsg(false, broadcastChange)
    this.sendBGCToggleMsg(false, broadcastChange)
    this.sendRealtimeMsg(true, broadcastChange)

    // const presRange = [0, 2000]
    // this.sendPres(presRange, broadcastChange)
    const arDate = moment(new Date( 2010, 0, 1, 0, 0, 0, 0))
    const arDateRange = [-18, 18]
    let selectionDateRange: DateRange
    this.sendDisplayGlobally(true, broadcastChange)
    selectionDateRange = {
                          startDate: arDate.add(arDateRange[0], 'hours').format('YYYY-MM-DD'),
                          endDate: arDate.add(arDateRange[1], 'hours').format('YYYY-MM-DD'),
                          label: 'initial arMode date range'
                        };
    this.sendSelectedDate(selectionDateRange, broadcastChange)
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
    const arDateString = this.arDate.format('YYYY-MM-DDTHH')
    let shapesString = null
     const shapes = this.getShapes()
     if (shapes) {
       shapesString = JSON.stringify(shapes)
    }
    const queryParams = {
                         'includeRealtime': this.getRealtimeToggle(),
                         'onlyBGC': this.getBGCToggle(),
                         'onlyDeep': this.getDeepToggle(),
                         'arDateRange': arDateRangeString,
                         'arDate': arDateString,
                         'displayGlobally': this.getDisplayGlobally()
                        }
    this.router.navigate(
      [], 
      {
        relativeTo: this.route,
        queryParams: queryParams,
      });
  }

  public getDisplayGlobally(): boolean {
    return this.displayGlobally
  }

  public sendDisplayGlobally(displayGlobally: boolean, broadcastChange=true): void {
    this.displayGlobally = displayGlobally
    if (broadcastChange) { this.change.emit('displayGlobally changed')}
  }

  public getArDateRange(): number[] {
    return [...this.arDateRange]
  }

  public sendArDateRange(dateRange: number[], broadcastChange=true): void {
    this.arDateRange = dateRange
    if (broadcastChange) { this.change.emit('ar date range change') }
  }

  public formatDate(date: moment.Moment): string {
    return date.format("YYYY-MM-DDTHH:mm:ss") + 'Z'
  }

  public getArDateAsDateRange(): DateRange {
    const startDate = this.formatDate(this.arDate.clone().add(this.arDateRange[0], 'h'))
    const endDate = this.formatDate(this.arDate.clone().add(this.arDateRange[1], 'h'))
    const dateRange: DateRange = {startDate: startDate, endDate: endDate, label: ''}
    return dateRange
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
      case 'displayGlobally': {
        const displayGlobally = JSON.parse(value)
        this.sendDisplayGlobally(displayGlobally, notifyChange)
        break;

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
