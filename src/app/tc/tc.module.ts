import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TcComponent } from './tc.component';
import { HomeModule } from './../home/home.module';
import { MaterialModule } from '../material/material.module';
import "leaflet";
import "leaflet-draw";
import "proj4leaflet";
import { TcMapComponent } from './tc-map/tc-map.component';
import { TcShapePopupComponent } from './tc-shape-popup/tc-shape-popup.component';
import { TsSidebarNavComponent } from './tc-sidebar-nav/tc-sidebar-nav.component';



@NgModule({
  declarations: [TcComponent, TcMapComponent, TcShapePopupComponent, TsSidebarNavComponent],
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
