import { Injectable, EventEmitter, Output } from '@angular/core';
import { MapProjDropdownMenuComponent } from '../sidebar-nav/map-proj-dropdown-menu/map-proj-dropdown-menu.component'
import { Subject, Observable }    from 'rxjs';

@Injectable()
export class MapProjectionService {
  myMapProj$: Observable<string>;
  private myMapProjSubject = new Subject<string>()

  mProj = 'Web Mercator';

  @Output() change: EventEmitter<string> = new EventEmitter();

  constructor() { 
    this.myMapProj$ = this.myMapProjSubject.asObservable()
  }
  setmProj(mProj) {
    this.mProj = mProj;
    this.change.emit(this.mProj);
  }

  getmProj() {
    return this.mProj;
  }
}
