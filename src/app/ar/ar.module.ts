import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeModule } from './../home/home.module';
import { ArComponent } from './ar.component'
import { MaterialModule } from '../material/material.module';

import "leaflet";
import "leaflet-draw";
import "proj4leaflet";
import { ArSidebarNavComponent } from './ar-sidebar-nav/ar-sidebar-nav.component';

@NgModule({
  declarations: [ ArComponent, ArSidebarNavComponent ],
  imports: [
    CommonModule,
    HomeModule,
    MaterialModule
  ],
  exports: [
    HomeModule
  ]
})
export class ArModule { }
