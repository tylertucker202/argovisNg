import { Injectable, Output, EventEmitter, Injector } from '@angular/core'
import { QueryService } from './../home/services/query.service'
import * as moment from 'moment'
import { DateRange } from './../../typeings/daterange'
import { MapState } from './../../typeings/mapState'
import { TcTrack } from '../models/tc-shape'
@Injectable({
  providedIn: 'root'
})
export class TcQueryService extends QueryService {

  @Output() tcEvent: EventEmitter<string> = new EventEmitter
  @Output() stormNameUpdate: EventEmitter<string> = new EventEmitter


  private tcStartDate = moment(new Date( 2018, 7, 15, 0, 0, 0, 0))
  private tcEndDate = moment(new Date( 2018, 7, 17, 0, 0, 0, 0))
  private tcTracks: number[][][]
  private profHourRange = [-18, 18] as [number, number]
  private globalStormToggle = true
  private stormYear: string

  public selectionDateRange = this.convert_hour_range_to_date_range(this.tcStartDate, this.tcEndDate, this.profHourRange, 'inital set date range')

  constructor( public injector: Injector ) { super(injector) }

  public reset_params(): void{
    console.log('tc reset params pressed')
    const broadcastChange = false
    this.send_deep_toggle_msg(false, broadcastChange)
    this.send_bgc_toggle_msg(false, broadcastChange)
    this.send_realtime_msg(true, broadcastChange)
    const tcStartDate = moment(new Date( 2018, 7, 15, 0, 0, 0, 0))
    const tcEndDate = moment(new Date( 2018, 7, 17, 0, 0, 0, 0))
    const profHourRange = [-18, 18] as [number, number]
    this.send_global_storms_msg(true, broadcastChange)
    const selectionDateRange = this.convert_hour_range_to_date_range(tcStartDate, tcEndDate, profHourRange)
    this.send_selected_date(selectionDateRange, broadcastChange)
    this.send_tc_start_date(tcStartDate, broadcastChange)
    this.send_tc_end_date(tcEndDate, broadcastChange)
    // this.send_prof_date_range(profHourRange)
  }

  public convert_hour_range_to_date_range(startDate: moment.Moment, endDate: moment.Moment, hourRange: [number, number], msg=''): DateRange {
    const dateRange: DateRange = {
      startDate: startDate.clone().add(hourRange[0], 'hours').format('YYYY-MM-DDTHH:mm:ss').replace(':', '%3A'),
      endDate: endDate.clone().add(hourRange[1], 'hours').format('YYYY-MM-DDTHH:mm:ss').replace(':', '%3A'),
      label: 'msg'
    };
    return dateRange
  }

  public trigger_reset_to_start(): void {
    this.reset_params()
    this.resetToStart.emit()
    this.set_url()
  }

  public send_storm_year(stormYear: string, broadcastChange=true): void {
    this.stormYear = stormYear
    this.send_global_storms_msg(false, false)
    if (broadcastChange) { this.tcEvent.emit(stormYear)}
  }

  public get_storm_year(): string {
    return this.stormYear
  }

  public set_selection_date_range(): void {
    const broadcastChange = false
    const startDate = this.format_date(this.tcStartDate.clone().add(this.profHourRange[0], 'h')) //make sure to clone and format date correctly
    const endDate = this.format_date(this.tcEndDate.clone().add(this.profHourRange[1], 'h'))
    const dateRange: DateRange = {startDate: startDate, endDate: endDate, label: ''}
    this.send_selected_date(dateRange, broadcastChange)
  }

  public round_shapes(shapes: number[][][]): number[][][] {
    shapes.forEach(shape => {
      shape.forEach( point => {
        point[0] = Math.round((point[0] + Number.EPSILON) * 100) / 100
        point[1] = Math.round((point[1] + Number.EPSILON) * 100) / 100
      })
    })
    return shapes
  }


  public set_url(): void {
    console.log('setting tc url')
    const profDateRangeString = JSON.stringify(this.profHourRange)
    const tcStartDateString = this.tcStartDate.format('YYYY-MM-DDTHH:mm:ss')
    const tcEndDateString = this.tcEndDate.format('YYYY-MM-DDTHH:mm:ss')
    let shapesString = null
     const shapes = this.get_shapes()
     if (shapes) {
       shapesString = JSON.stringify(shapes)
    }
    const queryParams = {
                         'includeRealtime': this.get_realtime_toggle(),
                         'stormYear': this.get_storm_year(),
                         'onlyBGC': this.get_bgc_toggle(),
                         'onlyDeep': this.get_deep_toggle(),
                         'profHourRange': profDateRangeString,
                         'tcStartDate': tcStartDateString,
                         'tcEndDate': tcEndDateString,
                         'selectionStartDate': this.get_selection_dates().startDate,
                         'selectionEndDate': this.get_selection_dates().endDate,
                         'globalStormToggle': this.get_global_storms_toggle(),
                         'shapes': shapesString
                        }
    this.router.navigate(
      [], 
      {
        relativeTo: this.route,
        queryParams: queryParams,
      });
  }

  public send_prof_date_range(sliderRange: [number, number], broadcastChange=true, msg=''): void {
    this.profHourRange = sliderRange
    this.selectionDateRange = this.convert_hour_range_to_date_range(this.tcStartDate, this.tcEndDate, sliderRange, msg)
    if (broadcastChange) { this.change.emit('prof date range changed')}
  }

  public get_tc_date_range(): [moment.Moment, moment.Moment] {
    return [this.tcStartDate, this.tcEndDate]
  }

  public send_tc_shape(data: number[][][], broadcastChange=true, msg='tcShape Drawn'): void {
    this.latLngShapes = data;
    console.log('tc shapes: ', this.latLngShapes)
    if (msg){ this.change.emit(msg) }
  }

  public get_prof_date_range(): DateRange {
    const tcDateRange = this.get_tc_date_range();
    const hourRange = this.get_prof_hour_range() as [number, number]
    const dates = this.convert_hour_range_to_date_range(tcDateRange[0], tcDateRange[1], hourRange, 'shape from buffer')
    return dates
  }

  public send_tc_start_date(date: moment.Moment, broadcastChange=true): void {
    this.tcStartDate = date
    this.send_global_storms_msg(true, false)
    if (broadcastChange) { this.change.emit('tcStartDate changed')}
  }

  public send_tc_end_date(date: moment.Moment, broadcastChange=true): void {
    this.tcEndDate = date
    this.send_global_storms_msg(true, false)
    if (broadcastChange) { this.change.emit('tcEndDate changed')}
  }

  public set_prof_hour_range(sliderRange: [number, number], broadcastChange=true): void {
    this.profHourRange = [...sliderRange] as [number, number]
    if (broadcastChange) { this.change.emit('slider range changed')}
  }

  public get_prof_hour_range(): [number, number] | number[] {
    return [...this.profHourRange]
  }

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

  public get_global_storms_toggle(): boolean {
    return this.globalStormToggle
  }

  public send_global_storms_msg(globalStormToggle: boolean, broadcastChange=true): void {
    this.globalStormToggle = globalStormToggle
    if (broadcastChange) { 
      
      if (globalStormToggle) {
        this.change.emit('global storms emit')}
      else {
        this.tcEvent.emit('showing storm only')
      }
    }
  }

  public set_params_from_url(msg='got state from map component'): void {
    // let mapState: MapState
    this.route.queryParams.subscribe(params => {
      let mapState = params
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
        this.send_realtime_msg(includeRealtime, notifyChange)
        break
      }
      case 'onlyBGC': {
        const onlyBGC = JSON.parse(value)
        this.send_bgc_toggle_msg(onlyBGC, notifyChange)
        break
      }
      case 'onlyDeep': {
        const onlyDeep = JSON.parse(value)
        this.send_deep_toggle_msg(onlyDeep, notifyChange)
        break
      }
      case 'globalStormToggle': {
        const globalStormToggle = JSON.parse(value)
        this.send_global_storms_msg(globalStormToggle, notifyChange)
        break
      }
      case 'stormYear': {
        this.send_storm_year(value, notifyChange)
        break
      }
      case 'profHourRange': {
        const tcHourRange = JSON.parse(value)
        this.send_prof_date_range(tcHourRange, notifyChange)
        break
      }
      case 'tcStartDate': {
        const tcDate = moment(value)
        this.send_tc_start_date(tcDate, notifyChange)
        break
      }
      case 'tcEndDate': {
        const tcDate = moment(value)
        this.send_tc_end_date(tcDate, notifyChange)
        break
      }
      case 'selectionStartDate': {
        const stateDateRange = {startDate: value, endDate: this.selectionDateRange.endDate}
        this.send_selected_date(stateDateRange, notifyChange)
        break
      }
      case 'selectionEndDate': {
        const stateDateRange = {startDate: this.selectionDateRange.startDate, endDate: value}
        this.send_selected_date(stateDateRange, notifyChange)
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
        break
    }
  }
}
}
