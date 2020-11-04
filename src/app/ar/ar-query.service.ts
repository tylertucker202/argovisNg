import { Injectable, Output, EventEmitter, Injector } from '@angular/core'
import { QueryService } from './../home/services/query.service'
import * as moment from 'moment'
import { DateRange } from './../../typeings/daterange'
import { MapState } from './../../typeings/mapState'
import { ARShape } from '../models/ar-shape'
@Injectable({
  providedIn: 'root'
})
export class ArQueryService extends QueryService {

  @Output() arEvent: EventEmitter<string> = new EventEmitter

  private arDate = moment(new Date( 2010, 0, 1, 0, 0, 0, 0))
  private arShapes: number[][][]
  private arHourRange = [-18, 18]
  private displayGlobally = true

  constructor( public injector: Injector ) { super(injector) }

  public reset_params(): void{
    console.log('reset params pressed')
    const broadcastChange = false
    this.sendDeepToggleMsg(false, broadcastChange)
    this.sendBGCToggleMsg(false, broadcastChange)
    this.sendRealtimeMsg(true, broadcastChange)
    const arDate = moment(new Date( 2010, 0, 1, 0, 0, 0, 0))
    const arHourRange = [-18, 18]
    this.send_display_globally(true, broadcastChange)
    const selectionDateRange: DateRange = {
                          startDate: arDate.add(arHourRange[0], 'hours').format('YYYY-MM-DD'),
                          endDate: arDate.add(arHourRange[1], 'hours').format('YYYY-MM-DD'),
                          label: 'initial arMode date range'
                        };
    this.send_selected_date(selectionDateRange, broadcastChange)
    this.send_ar_date(arDate)
    this.send_ar_date_range(arHourRange)
  }

  public trigger_reset_to_start(): void {
    this.reset_params()
    this.resetToStart.emit()
    this.set_url()
  }

  public set_selection_date_range(): void {
    const broadcastChange = false
    const startDate = this.format_date(this.arDate.clone().add(this.arHourRange[0], 'h')) //make sure to clone and format date correctly
    const endDate = this.format_date(this.arDate.clone().add(this.arHourRange[1], 'h'))
    const dateRange: DateRange = {startDate: startDate, endDate: endDate, label: ''}
    this.send_selected_date(dateRange, broadcastChange)
  }


  public set_url(): void {

    const arDateRangeString = JSON.stringify(this.arHourRange)
    const arDateString = this.arDate.format('YYYY-MM-DDTHH')
    let shapesString = null
     const shapes = this.get_shapes()
     if (shapes) {
       shapesString = JSON.stringify(shapes)
    }
    const queryParams = {
                         'includeRealtime': this.get_realtime_toggle(),
                         'onlyBGC': this.get_bgc_toggle(),
                         'onlyDeep': this.get_deep_toggle(),
                         'arHourRange': arDateRangeString,
                         'arDate': arDateString,
                         'displayGlobally': this.get_display_globally()
                        }
    this.router.navigate(
      [], 
      {
        relativeTo: this.route,
        queryParams: queryParams,
      });
  }

  public get_display_globally(): boolean {
    return this.displayGlobally
  }

  public send_display_globally(displayGlobally: boolean, broadcastChange=true): void {
    this.displayGlobally = displayGlobally
    if (broadcastChange) { this.change.emit('displayGlobally changed')}
  }

  public get_ar_date_range(): number[] {
    return [...this.arHourRange]
  }

  public send_ar_date_range(dateRange: number[], broadcastChange=true): void {
    this.arHourRange = dateRange
    if (broadcastChange) { this.change.emit('ar date range change') }
  }

  public format_date(date: moment.Moment): string {
    return date.format("YYYY-MM-DDTHH:mm:ss") + 'Z'
  }

  public get_ar_date_as_date_range(): DateRange {
    const startDate = this.format_date(this.arDate.clone().add(this.arHourRange[0], 'h'))
    const endDate = this.format_date(this.arDate.clone().add(this.arHourRange[1], 'h'))
    const dateRange: DateRange = {startDate: startDate, endDate: endDate, label: ''}
    return dateRange
  }
 
  public send_ar_date(date: moment.Moment): void {
    this.arDate = date
  }

  public get_ar_date(): moment.Moment {
    return this.arDate
  }
  public send_ar_shapes(data: number[][][], broadcastChange=true): void {
    let msg = 'ar shape'
    this.arShapes = data
    if (broadcastChange) { this.change.emit('ar shape change')}
  }

  public get_ar_shapes(): number[][][] {
    return this.arShapes
  }

  public set_params_from_url(msg='got state from map component'): void{
    let mapState: MapState
    this.route.queryParams.subscribe(params => {
      mapState = params
      Object.keys(mapState).forEach(key => {
        this.ar_set_map_state(key, mapState[key])
      });
      this.urlBuild.emit(msg)
    });
  }
 

  public ar_set_map_state(key: string, value: string): void {
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
        this.send_display_globally(displayGlobally, notifyChange)
        break;

      }
      case 'arHourRange': {
        const arHourRange = JSON.parse(value)
        this.send_ar_date_range(arHourRange)
        break
      }
      case 'arDate': {
        const arDate = moment(value)
        this.send_ar_date(arDate)
        break
      }
      default: {
        console.log('key not found. not doing anything: ', key)
        break;
    }
  }
}

}
