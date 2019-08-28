import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import "leaflet";
import "leaflet-draw";
import { NouisliderModule } from 'ng2-nouislider';

import { GridComponent } from './grid.component';
import { MapGridComponent } from './map-grid/map-grid.component';
import { SidebarNavGridComponent } from './sidebar-nav-grid/sidebar-nav-grid.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonthPickerComponent } from './sidebar-nav-grid/month-picker/month-picker.component';
import { PresSliderComponent } from './sidebar-nav-grid/pres-slider/pres-slider.component';
import { QueryGridService } from './query-grid.service';
import { GridPickerComponent } from './sidebar-nav-grid/grid-picker/grid-picker.component';

@NgModule({
  declarations: [
    GridComponent,
    MapGridComponent,
    SidebarNavGridComponent,
    MonthPickerComponent,
    PresSliderComponent,
    GridPickerComponent
    ],
  providers: [
    QueryGridService,
  ],
  imports: [
    MaterialModule,
    NouisliderModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
})
export class GridModule { }
