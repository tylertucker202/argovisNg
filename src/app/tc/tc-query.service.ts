import { Injectable, Output, EventEmitter, Injector } from '@angular/core'
import { QueryService } from './../home/services/query.service'
import * as moment from 'moment'
import { DateRange } from './../../typeings/daterange'
import { MapState } from './../../typeings/mapState'
import { TcTrack } from '../models/tc-shape'
@Injectable({
  providedIn: 'root'
})
export class TcQueryService extends QueryService{

  @Output() tcEvent: EventEmitter<string> = new EventEmitter

  private tcStartDate = moment(new Date( 2010, 0, 1, 0, 0, 0, 0))
  private tcEndDate = moment(new Date( 2010, 0, 15, 0, 0, 0, 0))
  private tcTracks: number[][][]
  private profHourRange = [-18, 18]
  private displayGlobally = true

  constructor( public injector: Injector ) { super(injector) }

  public reset_params(): void{
    console.log('reset params pressed')
    const broadcastChange = false
    this.sendDeepToggleMsg(false, broadcastChange)
    this.sendBGCToggleMsg(false, broadcastChange)
    this.sendRealtimeMsg(true, broadcastChange)
    const tcStartDate = moment(new Date( 2010, 0, 1, 0, 0, 0, 0))
    const tcEndDate = moment(new Date( 2010, 0, 15, 0, 0, 0, 0))
    const profHourRange = [-18, 18]
    this.send_display_globally(true, broadcastChange)
    const selectionDateRange: DateRange = {
                          startDate: tcStartDate.add(profHourRange[0], 'hours').format('YYYY-MM-DD'),
                          endDate: tcEndDate.add(profHourRange[1], 'hours').format('YYYY-MM-DD'),
                          label: 'initial profile query date range'
                        };
    this.send_selected_date(selectionDateRange, broadcastChange)
    this.send_tc_start_date(tcStartDate)
    this.send_tc_end_date(tcEndDate)
    // this.send_prof_date_range(profHourRange)
  }

  public trigger_reset_to_start(): void {
    this.reset_params()
    this.resetToStart.emit()
    this.set_url()
  }

  public set_selection_date_range(): void {
    const broadcastChange = false
    const startDate = this.format_date(this.tcStartDate.clone().add(this.profHourRange[0], 'h')) //make sure to clone and format date correctly
    const endDate = this.format_date(this.tcEndDate.clone().add(this.profHourRange[1], 'h'))
    const dateRange: DateRange = {startDate: startDate, endDate: endDate, label: ''}
    this.send_selected_date(dateRange, broadcastChange)
  }


  public set_url(): void {

    const profDateRangeString = JSON.stringify(this.profHourRange)
    const tcStartDateString = this.tcStartDate.format('YYYY-MM-DDTHH')
    const tcEndDateString = this.tcEndDate.format('YYYY-MM-DDTHH')
    let shapesString = null
     const shapes = this.get_shapes()
     if (shapes) {
       shapesString = JSON.stringify(shapes)
    }
    const queryParams = {
                         'includeRealtime': this.get_realtime_toggle(),
                         'onlyBGC': this.get_bgc_toggle(),
                         'onlyDeep': this.get_deep_toggle(),
                         'profHourRange': profDateRangeString,
                         'tcStartDate': tcStartDateString,
                         'tcEndDate': tcEndDateString,
                         'displayGlobally': this.get_display_globally(),
                         'shapes': shapesString
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

  public send_prof_date_range(sliderRange: [number, number], broadcastChange=true): void {
    const selectionDateRange: DateRange = {
      startDate: this.tcStartDate.add(sliderRange[0], 'hours').format('YYYY-MM-DD'),
      endDate: this.tcEndDate.add(sliderRange[1], 'hours').format('YYYY-MM-DD'),
      label: 'initial profile query date range'
    };
this.send_selected_date(selectionDateRange, broadcastChange)
  }

  public get_tc_date_range(): [moment.Moment, moment.Moment] {
    return [this.tcStartDate, this.tcEndDate]
  }

  public send_tc_start_date(date: moment.Moment, broadcastChange=true): void {
    this.tcStartDate = date
    if (broadcastChange) { this.change.emit('tcStartDate changed')}
  }

  public send_tc_end_date(date: moment.Moment, broadcastChange=true): void {
    this.tcEndDate = date
    if (broadcastChange) { this.change.emit('tcEndDate changed')}
  }

  public get_prof_date_range(): number[] {
    return [...this.profHourRange]
  }

  // public send_prof_date_range(dateRange: number[], broadcastChange=true): void {
  //   this.profHourRange = dateRange
  //   if (broadcastChange) { this.change.emit('prof date range change') }
  // }

  public format_date(date: moment.Moment): string {
    return date.format("YYYY-MM-DDTHH:mm:ss") + 'Z'
  }

  public get_tc_date_as_date_range(): DateRange {
    const startDate = this.format_date(this.tcStartDate.clone())
    const endDate = this.format_date(this.tcEndDate.clone())
    const dateRange: DateRange = {startDate: startDate, endDate: endDate, label: ''}
    return dateRange
  }
 
  public send_tc_tracks(data: number[][][], broadcastChange=true): void {
    this.tcTracks = data
    if (broadcastChange) { this.change.emit('tc track change')}
  }

  public get_tc_tracks(): number[][][] {
    return this.tcTracks
  }

  public set_params_from_url(msg='got state from map component'): void{
    let mapState: MapState
    this.route.queryParams.subscribe(params => {
      mapState = params
      Object.keys(mapState).forEach(key => {
        this.tc_set_map_state(key, mapState[key])
      });
      this.urlBuild.emit(msg)
    });
  }
 

  public tc_set_map_state(key: string, value: string): void {
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
      case 'profHourRange': {
        const tcHourRange = JSON.parse(value)
        this.send_prof_date_range(tcHourRange)
        break
      }
      case 'tcStartDate': {
        const tcDate = moment(value)
        this.send_tc_start_date(tcDate)
        break
      }
      case 'tcEndDate': {
        const tcDate = moment(value)
        this.send_tc_end_date(tcDate)
        break
      }
      case 'shapes': {
        const arrays = JSON.parse(value)
        const toggleThreeDayOff = false
        this.send_shape(arrays, notifyChange, toggleThreeDayOff)
        break
      }
      default: {
        console.log('key not found. not doing anything: ', key)
        break;
    }
  }
}
}
