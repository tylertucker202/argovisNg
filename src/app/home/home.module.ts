import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

import "leaflet";
import "leaflet-draw";
import "proj4leaflet";

// home and its components
import { HomeComponent } from './home.component';
import { SidebarNavComponent } from './sidebar-nav/sidebar-nav.component';
import { SelectionDatePicker } from './sidebar-nav/selectiondatepicker/selectiondatepicker.component';
import { MapService } from './services/map.service';
import { QueryService } from './services/query.service'
import { PointsService } from './services/points.service';
import { PopupCompileService } from './services/popup-compile.service';
import { MapComponent } from './map/map.component';
import { NouisliderModule } from 'ng2-nouislider';
import { DoubleSliderComponent } from './sidebar-nav/double-slider/double-slider.component';
import { ProfPopupComponent } from './prof-popup/prof-popup.component';
import { ShapePopupComponent } from './shape-popup/shape-popup.component';
import { DbOverviewComponent, BottomSheet } from './sidebar-nav/db-overview/db-overview.component';
import { HelpBottomSheetComponent, HelpBottomSheet } from './sidebar-nav/help-bottom-sheet/help-bottom-sheet.component';
import { ArDisplayComponent } from './sidebar-nav/ar-display/ar-display.component';
import { ArDateRangeComponent } from './sidebar-nav/ar-date-range/ar-date-range.component';

@NgModule({
  declarations: [
    HomeComponent,
    SidebarNavComponent,
    SelectionDatePicker,
    MapComponent,
    DoubleSliderComponent,
    ProfPopupComponent,
    BottomSheet,
    ShapePopupComponent,
    DbOverviewComponent,
    HelpBottomSheetComponent,
    HelpBottomSheet,
    ArDisplayComponent,
    ArDateRangeComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NouisliderModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDaterangepickerMd.forRoot(),
    MaterialModule,
  ],
  providers: [
    MapService,
    PointsService,
    QueryService,
    PopupCompileService
  ],
  entryComponents: [
    ProfPopupComponent, 
    ShapePopupComponent, 
    BottomSheet, 
    HelpBottomSheet,
    ArDisplayComponent
  ],
})
export class HomeModule { }
