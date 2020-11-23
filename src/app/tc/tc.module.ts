import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TcComponent } from './tc.component';
import { HomeModule } from './../home/home.module';
import { MaterialModule } from '../material/material.module';
import "leaflet";
import "leaflet-draw";
import "proj4leaflet";
import { TcMapComponent } from './tc-map/tc-map.component';
import { tcTrackPopupComponent } from './tc-shape-popup/tc-shape-popup.component';
import { TsSidebarNavComponent } from './tc-sidebar-nav/tc-sidebar-nav.component';
import { StormPopupComponent } from './storm-popup/storm-popup.component';
import { TcHourRangeComponent } from './tc-sidebar-nav/tc-hour-range/tc-hour-range.component';
import { TcDisplayComponent } from './tc-sidebar-nav/tc-display/tc-display.component';
import { StormSelectComponent } from './tc-sidebar-nav/storm-select/storm-select.component';
import { BufferPopupComponentComponent } from './buffer-popup-component/buffer-popup-component.component';



@NgModule({
  declarations: [TcComponent, TcMapComponent, tcTrackPopupComponent, TsSidebarNavComponent, StormPopupComponent, TcHourRangeComponent, TcDisplayComponent, StormSelectComponent, BufferPopupComponentComponent],
  imports: [
    CommonModule,
    HomeModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    HomeModule
  ]
})
export class TcModule { }
