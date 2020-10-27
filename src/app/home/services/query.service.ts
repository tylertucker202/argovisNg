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

  private presRange = [0, 2000]
  private selectionDateRange: DateRange = {startDate: moment().utc().subtract(14, 'days').format('YYYY-MM-DD'),
                                           endDate: moment().utc().format('YYYY-MM-DD')}
  private globalDisplayDate = moment().utc().subtract(2, 'days').format('YYYY-MM-DD')
  private latLngShapes: number[][][]
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
    this.sendDeepToggleMsg(false, broadcastChange)
    this.sendBGCToggleMsg(false, broadcastChange)
    this.sendRealtimeMsg(true, broadcastChange)
    const globalDisplayDate = moment().utc().subtract(2, 'days').format('YYYY-MM-DD');
    this.sendGlobalDate(globalDisplayDate, broadcastChange)
    const presRange = [0, 2000]
    this.sendPres(presRange, broadcastChange)
    const clearOtherShapes = false
    let selectionDateRange: DateRange
    let sendThreeDayMsg: boolean
    sendThreeDayMsg = true
    selectionDateRange = {startDate: moment().utc().subtract(14, 'days').format('YYYY-MM-DD'),
    endDate: moment().utc().format('YYYY-MM-DD'), label: 'initial date range'};
    this.sendThreeDayMsg(sendThreeDayMsg, broadcastChange)
    this.send_selected_date(selectionDateRange, broadcastChange)
  }

  public getShapesFromFeatures(features: GeoJSON.Feature): number[][][] {
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
  public set_url(): void {

    //this is reversing the order of this.latLngShapes()
    const presRangeString = JSON.stringify(this.getPresRange())
    let shapesString = null
    const shapes = this.get_shapes()
    if (shapes) {
      shapesString = JSON.stringify(shapes)
    }
    const queryParams = {
                         'mapProj': this.getProj(),
                         'presRange': presRangeString, 
                         'selectionStartDate': this.getSelectionDates().startDate,
                         'selectionEndDate': this.getSelectionDates().endDate,
                         'threeDayEndDate': this.getGlobalDisplayDate(),
                         'shapes': shapesString,
                         'includeRealtime': this.get_realtime_toggle(),
                         'onlyBGC': this.get_bgc_toggle(),
                         'onlyDeep': this.get_deep_toggle(),
                         'threeDayToggle': this.getThreeDayToggle(),
                        }
    this.router.navigate(
      [], 
      {
        relativeTo: this.route,
        queryParams: queryParams,
        //queryParamsHandling: "merge"
      });
  }

  public getURL(): string {
    return location.pathname
  }

  public triggerPlatformShow(platform: string): void {
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

  public triggerShowPlatform(platform: string): void {
    this.displayPlatform.emit(platform);
  }

  public sendShape(data: number[][][], broadcastChange=true, toggleThreeDayOff=true): void {
    let msg = 'shape'
    if (toggleThreeDayOff) {
      const broadcastThreeDayToggle = false
      this.sendThreeDayMsg(broadcastThreeDayToggle, broadcastThreeDayToggle)
    }
    this.latLngShapes = data;
    if (broadcastChange){ this.change.emit(msg) }
  }

  public sendProj(proj: string): void {
    const msg = 'proj changed';
    this.proj = proj;
    this.set_url()
    setTimeout(() => {  // need to wait for url to be set before reloading page.
      location.reload();
     } );
  }

  public setProj(proj: string): void {
    this.proj = proj
  }

  public getProj(): string {
    return this.proj;
  }

  public get_shapes(): number[][][] {
    return this.latLngShapes;
  }

  public clear_shapes(): void {
    this.latLngShapes = null;
  }

  public sendPres(presRange: number[], broadcastChange=true): void {
    const msg = 'presRange';
    this.presRange = presRange;
    if (broadcastChange){ this.change.emit(msg) }
  }

  public getPresRange(): number[] {
    return [...this.presRange];
  }

  public send_selected_date(selectionDateRange: DateRange, broadcastChange=true): void {
    const msg = 'selection date';
    this.selectionDateRange = selectionDateRange;
    if (broadcastChange){ this.change.emit(msg) }
  }

  public getSelectionDates(): DateRange {
    return this.selectionDateRange;
  }

  public sendGlobalDate(globalDisplayDate: string, broadcastChange=true): void {
    const msg = 'three day display date';
    this.globalDisplayDate = globalDisplayDate;
    if (broadcastChange){ this.change.emit(msg) }
  }

  public getGlobalDisplayDate(): string{
    return this.globalDisplayDate;
  }

  public sendRealtimeMsg(toggleChecked: boolean, broadcastChange=true): void {
    const msg = 'realtime'
    this.includeRealtime = toggleChecked
    if (broadcastChange){ this.change.emit(msg) }
  }

  public get_realtime_toggle(): boolean {
    return this.includeRealtime;
  }

  public sendThreeDayMsg(toggleChecked: boolean, broadcastChange=true): void {
    const msg = '3 day toggle'
    this.threeDayToggle = toggleChecked
    if (broadcastChange){ this.change.emit(msg) }
  }

  public getThreeDayToggle(): boolean {
    return this.threeDayToggle;
  }

  sendBGCToggleMsg(toggleChecked: boolean, broadcastChange=true): void {
    const msg = 'bgc only'
    this.onlyBGC = toggleChecked
    if (broadcastChange){ this.change.emit(msg) }
  }

  public get_bgc_toggle(): boolean {
    return this.onlyBGC
  }

  sendDeepToggleMsg(toggleChecked: boolean, broadcastChange=true): void {
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
        this.sendPres(presRange, notifyChange)
        break
      }
     default: {
        console.log('key not found. not doing anything: ', key)
        break;
    }
  }
}

}
