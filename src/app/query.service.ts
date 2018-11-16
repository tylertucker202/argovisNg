import { Injectable, EventEmitter, Output } from '@angular/core';
import { GeoJsonObject } from 'geojson';
import { DateRange } from '../typeings/daterange';

@Injectable()
export class QueryService {

  @Output() change: EventEmitter<string> = new EventEmitter
  @Output() triggerPlatformDisplay: EventEmitter<string> = new EventEmitter
  @Output() clearLayers: EventEmitter<string> = new EventEmitter
  @Output() resetToStart: EventEmitter<string> = new EventEmitter
  @Output() displayPlatform: EventEmitter<string> = new EventEmitter

  private presRange: Number[];
  private selectionDateRange: any;
  private displayDate: string;
  private latLngShapes: GeoJSON.FeatureCollection | any;
  private includeRealtime: Boolean;
  private onlyBGC: Boolean;


  public triggerPlatformShow(platform: string): void {
    this.triggerPlatformDisplay.emit(platform)
  }

  public triggerClearLayers(): void {
    this.clearLayers.emit()
  }

  public triggerResetToStart(): void {
    this.resetToStart.emit()
  }

  public triggerShowPlatform(platform: string): void {
    this.displayPlatform.emit(platform);
  }

  public sendShapeMessage(data: GeoJSON.FeatureCollection | any): void { //really a GeoJSON.Feature[] object, but for testing purposes, need to make it an any
    const msg = 'shape';
    this.latLngShapes = data.features;
    this.change.emit(msg);
  }

  public getShapes(): any {
    return this.latLngShapes;
  }

  public clearShapes(): void {
    this.latLngShapes = null;
  }

  public sendPresMessage(presRange: Number[]): void {
    const msg = 'presRange';
    this.presRange = presRange;
    this.change.emit(msg);
  }

  public getPresRange(): Number[] {
    return this.presRange;
  }

  public sendSelectedDateMessage(selectionDateRange: DateRange): void {
    const msg = 'selection date';
    this.selectionDateRange = selectionDateRange;
    this.change.emit(msg);
  }

  public getSelectionDates(): any {
    return this.selectionDateRange;
  }

  public sendDisplayDateMessage(displayDate: string): void {
    const msg = 'display date';
    this.displayDate = displayDate;
    this.change.emit(msg);
  }

  public getDisplayDate(): any {
    return this.displayDate;
  }

  public sendToggleMsg(toggleChecked: Boolean): void {
    const msg = 'realtime'
    this.includeRealtime = toggleChecked
    this.change.emit(msg)
  }

  public getRealtimeToggle(): Boolean {
    return this.includeRealtime;
  }

  sendBGCToggleMsg(toggleChecked: Boolean): void {
    const msg = 'bgc only'
    this.onlyBGC = toggleChecked
    this.change.emit(msg)
  }

  public getBGCToggle(): Boolean {
    return this.onlyBGC
  }
  
  constructor() { }

}
