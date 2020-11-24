import { Injectable, EventEmitter, Output, Injector } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'
import { DateRange } from '../../../typeings/daterange';
import * as moment from 'moment';
import { MapState } from '../../../typeings/mapState';

@Injectable()
export class QueryService {

  @Output() change: EventEmitter<string> = new EventEmitter
  @Output() urlBuild: EventEmitter<string> = new EventEmitter
  @Output() triggerPlatformDisplay: EventEmitter<string> = new EventEmitter
  @Output() clear_layers: EventEmitter<string> = new EventEmitter
  @Output() resetToStart: EventEmitter<string> = new EventEmitter
  @Output() displayPlatform: EventEmitter<string> = new EventEmitter

  private presRange: [number, number] = [0, 2000]
  public selectionDateRange: DateRange = {startDate: this.format_date(moment().utc().subtract(14, 'days')),
                                          endDate: this.format_date(moment().utc()), label: 'initial date range'};
  private globalDisplayDate = moment().utc().subtract(2, 'days').format('YYYY-MM-DDTHH:mm:ss')
  public latLngShapes: number[][][]
  private includeRealtime = true
  private onlyBGC = false
  private onlyDeep = false
  private threeDayToggle = true
  private proj = 'WM'
  public route: ActivatedRoute
  public location: Location
  public router: Router
  constructor(public injector: Injector) { 
                                            this.router = injector.get(Router)
                                            this.location = injector.get(Location)
                                            this.route = injector.get(ActivatedRoute)
                                            this.router.urlUpdateStrategy = 'eager'
                                          }

  public reset_params(): void{
    const broadcastChange = false
    this.send_deep_toggle_msg(false, broadcastChange)
    this.send_bgc_toggle_msg(false, broadcastChange)
    this.send_realtime_msg(true, broadcastChange)
    const globalDisplayDate = this.format_date(moment().utc().subtract(2, 'days'));
    this.send_global_date(globalDisplayDate, broadcastChange)
    const presRange = [0, 2000] as [number, number]
    this.send_pres(presRange, broadcastChange)
    const clearOtherShapes = false
    let selectionDateRange: DateRange
    let sendThreeDayMsg: boolean
    sendThreeDayMsg = true
    selectionDateRange = {startDate: this.format_date(moment().utc().subtract(14, 'days')),
    endDate: this.format_date(moment().utc()), label: 'initial date range'};
    this.send_three_day_msg(sendThreeDayMsg, broadcastChange)
    this.send_selected_date(selectionDateRange, broadcastChange)
  }

  public get_shapes_from_features(features: GeoJSON.Feature): number[][][] {
    //const features = this.latLngShapes.features
    let shapes = []
    for(let idx in features){
      const feature = features[idx]
      //features.forEach( feature => {
        let coords = []
        feature.geometry.coordinates[0].forEach( (coord) => {
          const reverseCoord = [coord[1], coord[0]] // don't use reverse(), as it changes value in place
          coords.push(reverseCoord)
        })
        const polygonCoords = coords
        shapes.push(polygonCoords)
    };
    return shapes
  }

  public set_params_from_url(): void{
      let mapState: MapState
      this.route.queryParams.subscribe(params => {
        mapState = params
        Object.keys(mapState).forEach(key => {
          this.set_map_state(key, mapState[key])
        });
        this.urlBuild.emit('got state from map component')
      });
    }
  
  public format_date(date: moment.Moment): string {
    return date.format("YYYY-MM-DDTHH:mm:ss") + 'Z'
  }

  public set_url(): void {

    //this is reversing the order of this.latLngShapes()
    const presRangeString = JSON.stringify(this.get_pres_range())
    let shapesString = null
    const shapes = this.get_shapes()
    if (shapes) {
      shapesString = JSON.stringify(shapes)
    }
    const queryParams = {
                         'mapProj': this.get_proj(),
                         'presRange': presRangeString, 
                         'selectionStartDate': this.get_selection_dates().startDate,
                         'selectionEndDate': this.get_selection_dates().endDate,
                         'threeDayEndDate': this.get_global_display_date(),
                         'shapes': shapesString,
                         'includeRealtime': this.get_realtime_toggle(),
                         'onlyBGC': this.get_bgc_toggle(),
                         'onlyDeep': this.get_deep_toggle(),
                         'threeDayToggle': this.get_three_day_toggle(),
                        }
    this.router.navigate(
      [], 
      {
        relativeTo: this.route,
        queryParams: queryParams,
        //queryParamsHandling: "merge"
      });
  }

  public trigger_platform_show_event(platform: string): void {
    this.triggerPlatformDisplay.emit(platform)
  }

  public trigger_clear_layers(): void {
    this.clear_layers.emit()
  }

  public trigger_reset_to_start(): void {
    this.reset_params()
    this.resetToStart.emit()
    this.set_url()
  }

  public trigger_show_platform(platform: string): void {
    this.displayPlatform.emit(platform);
  }

  public send_shape(data: number[][][], broadcastChange=true, toggleThreeDayOff=true): void {
    let msg = 'shape'
    if (toggleThreeDayOff) {
      const broadcastThreeDayToggle = false
      this.send_three_day_msg(broadcastThreeDayToggle, broadcastThreeDayToggle)
    }
    this.latLngShapes = data;
    if (broadcastChange){ this.change.emit(msg) }
  }

  public send_proj(proj: string): void {
    const msg = 'proj changed';
    this.proj = proj;
    this.set_url()
    setTimeout(() => {  // need to wait for url to be set before reloading page.
      location.reload();
     } );
  }

  public set_proj(proj: string): void {
    this.proj = proj
  }

  public get_proj(): string {
    return this.proj;
  }

  public get_shapes(): number[][][] {
    return this.latLngShapes;
  }

  public clear_shapes(): void {
    this.latLngShapes = null;
  }

  public send_pres(presRange: [number, number], broadcastChange=true): void {
    const msg = 'presRange';
    this.presRange = presRange;
    if (broadcastChange){ this.change.emit(msg) }
  }

  public get_pres_range(): [number, number] {
    return [...this.presRange] as [number, number];
  }

  public send_selected_date(selectionDateRange: DateRange, broadcastChange=true): void {
    const msg = 'selection date';
    this.selectionDateRange = selectionDateRange;
    if (broadcastChange){ this.change.emit(msg) }
  }

  public get_selection_dates(): DateRange {
    return this.selectionDateRange;
  }

  public send_global_date(globalDisplayDate: string, broadcastChange=true): void {
    const msg = 'three day display date';
    this.globalDisplayDate = globalDisplayDate;
    if (broadcastChange){ this.change.emit(msg) }
  }

  public get_global_display_date(): string{
    return this.globalDisplayDate;
  }

  public send_realtime_msg(toggleChecked: boolean, broadcastChange=true): void {
    const msg = 'realtime'
    this.includeRealtime = toggleChecked
    if (broadcastChange){ this.change.emit(msg) }
  }

  public get_realtime_toggle(): boolean {
    return this.includeRealtime;
  }

  public send_three_day_msg(toggleChecked: boolean, broadcastChange=true): void {
    const msg = '3 day toggle'
    this.threeDayToggle = toggleChecked
    if (broadcastChange){ this.change.emit(msg) }
  }

  public get_three_day_toggle(): boolean {
    return this.threeDayToggle;
  }

  public send_bgc_toggle_msg(toggleChecked: boolean, broadcastChange=true): void {
    const msg = 'bgc only'
    this.onlyBGC = toggleChecked
    if (broadcastChange){ this.change.emit(msg) }
  }

  public get_bgc_toggle(): boolean {
    return this.onlyBGC
  }

  public send_deep_toggle_msg(toggleChecked: boolean, broadcastChange=true): void {
    const msg = 'deep only'
    this.onlyDeep = toggleChecked
    if (broadcastChange){ this.change.emit(msg) }
  }

  public get_deep_toggle(): boolean {
    return this.onlyDeep
  }

  public set_map_state(this, key: string, value: string): void {
    const notifyChange = false
    switch(key) {
      case 'mapProj': {
        this.set_proj(value)
        break
      }
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
        break;
      }
      case 'threeDayToggle': {
        const threeDayToggle = JSON.parse(value)
        this.send_three_day_msg(threeDayToggle, notifyChange)
        break
      }
      case 'threeDayEndDate': {
        const globalDisplayDate = value
        this.send_global_date(globalDisplayDate, notifyChange)
        break
      }
      case 'shapes': {
        const arrays = JSON.parse(value)
        const toggleThreeDayOff = false
        this.send_shape(arrays, notifyChange, toggleThreeDayOff)
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
      case 'presRange': {
        const presRange = JSON.parse(value)
        this.send_pres(presRange, notifyChange)
        break
      }
     default: {
        console.log('key not found. not doing anything: ', key)
        break;
    }
  }
}

}
