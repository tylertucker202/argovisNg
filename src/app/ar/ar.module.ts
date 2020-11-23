import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeModule } from './../home/home.module';
import { ArComponent } from './ar.component'
import { MaterialModule } from '../material/material.module';
import { ArHourRangeComponent } from './ar-sidebar-nav/ar-hour-range/ar-hour-range.component'
import { ArDisplayComponent } from './ar-sidebar-nav/ar-display/ar-display.component'
import "leaflet";
import "leaflet-draw";
import "proj4leaflet";
import { ArSidebarNavComponent } from './ar-sidebar-nav/ar-sidebar-nav.component';
import { ArShapePopupComponent } from './ar-shape-popup/ar-shape-popup.component';
import { ArMapComponent } from './ar-map/ar-map.component';

@NgModule({
  declarations: [ 
    ArComponent,
    ArSidebarNavComponent,
    ArHourRangeComponent,
    ArDisplayComponent,
    ArShapePopupComponent,
    ArMapComponent
  ],
  imports: [
    CommonModule,
    HomeModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    ArDisplayComponent
  ],
  exports: [
    HomeModule,
  ]
})
export class ArModule { }
