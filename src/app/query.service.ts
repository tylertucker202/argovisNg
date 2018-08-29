import { Injectable, EventEmitter, Output } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class QueryService {

  @Output() change: EventEmitter<string> = new EventEmitter

  private presRange: Number[];
  private dateRange: any;
  private latLngShapes: any;
  private includeRealtime: Boolean;

  sendShapeMessage(drawnItems: any): void {
    const msg = 'shape Changed';
    const data = drawnItems.toGeoJSON();
    const features = data.features;
    this.latLngShapes = features
    this.change.emit(msg);
  }

  getShapes(): any {
    return this.latLngShapes;
  }

  sendPresMessage(presRange: Number[]): void {
    const msg = 'presRange Changed';
    this.presRange = presRange;
    this.change.emit(msg);
  }

  getPresRange(): Number[] {
    return this.presRange;
  }

  sendDateMessage(dateRange: any): void {
    const msg = 'date Changed';
    this.dateRange = dateRange;
    this.change.emit(msg);
  }

  getDates(): any {
    return this.dateRange;
  }

  sendToggleMsg(toggleChecked: Boolean): void {
    const msg = 'realtime Changed'
    console.log(toggleChecked)
    this.includeRealtime = toggleChecked
    this.change.emit(msg)
  }

  getToggle(): Boolean {
    return this.includeRealtime;
  }

  constructor() { }

}
