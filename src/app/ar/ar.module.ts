import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeModule } from './../home/home.module';
import { ArComponent } from './ar.component'
import { MaterialModule } from '../material/material.module';
import { ArDateRangeComponent } from './ar-sidebar-nav/ar-date-range/ar-date-range.component'
import { ArDisplayComponent } from './ar-sidebar-nav/ar-display/ar-display.component'
import "leaflet";
import "leaflet-draw";
import "proj4leaflet";
import { ArSidebarNavComponent } from './ar-sidebar-nav/ar-sidebar-nav.component';

@NgModule({
  declarations: [ 
    ArComponent,
    ArSidebarNavComponent,
    ArDateRangeComponent,
    ArDisplayComponent
  ],
  imports: [
    CommonModule,
    HomeModule,
    MaterialModule
  ],
  entryComponents: [
    ArDisplayComponent
  ],
  exports: [
    HomeModule
  ]
})
export class ArModule { }
