import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  MatButtonModule,
  MatSlideToggleModule,
  MatDividerModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTooltipModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatBottomSheetModule,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import "leaflet";
import "leaflet-draw";
import { NouisliderModule } from 'ng2-nouislider';

import { GridComponent } from './grid.component';
import { MapComponent } from './map/map.component';
import { SidebarNavComponent } from './sidebar-nav/sidebar-nav.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MonthPickerComponent } from './sidebar-nav/month-picker/month-picker.component';
import { PresSliderComponent } from './sidebar-nav/pres-slider/pres-slider.component';

@NgModule({
  declarations: [
    GridComponent,
    MapComponent,
    SidebarNavComponent,
    MonthPickerComponent,
    PresSliderComponent
    ],
  imports: [
    NouisliderModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatBottomSheetModule,
  ],
})
export class GridModule { }
