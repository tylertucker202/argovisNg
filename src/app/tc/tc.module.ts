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



@NgModule({
  declarations: [TcComponent, TcMapComponent, tcTrackPopupComponent, TsSidebarNavComponent, StormPopupComponent],
  imports: [
    CommonModule,
    HomeModule,
    MaterialModule,
  ],
  exports: [
    HomeModule
  ]
})
export class TcModule { }
