import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TopToolbarService {

  constructor() { }
  @Output() drawerToggle: EventEmitter<boolean> = new EventEmitter
}
