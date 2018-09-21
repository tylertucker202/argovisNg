import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable()
export class QueryService {

  @Output() change: EventEmitter<string> = new EventEmitter
  @Output() triggerPlatformDisplay: EventEmitter<string> = new EventEmitter
  @Output() clearLayers: EventEmitter<string> = new EventEmitter
  @Output() resetToStart: EventEmitter<string> = new EventEmitter

  private presRange: Number[];
  private dateRange: any;
  private latLngShapes: any;
  private includeRealtime: Boolean;


  public triggerPlatformShow(platform: string): void {
    this.triggerPlatformDisplay.emit(platform)
  }

  public triggerClearLayers(): void {
    this.clearLayers.emit()
  }

  public triggerResetToStart(): void {
    this.resetToStart.emit()
  }

  sendShapeMessage(drawnItems: any): void {
    const msg = 'shape';
    const data = drawnItems.toGeoJSON();
    const features = data.features;
    this.latLngShapes = features;
    this.change.emit(msg);
  }

  getShapes(): any {
    return this.latLngShapes;
  }

  sendPresMessage(presRange: Number[]): void {
    const msg = 'presRange';
    this.presRange = presRange;
    this.change.emit(msg);
  }

  getPresRange(): Number[] {
    return this.presRange;
  }

  sendDateMessage(dateRange: any): void {
    const msg = 'date';
    this.dateRange = dateRange;
    this.change.emit(msg);
  }

  getDates(): any {
    return this.dateRange;
  }

  sendToggleMsg(toggleChecked: Boolean): void {
    const msg = 'realtime'
    this.includeRealtime = toggleChecked
    this.change.emit(msg)
  }

  getToggle(): Boolean {
    return this.includeRealtime;
  }

  constructor() { }

}
