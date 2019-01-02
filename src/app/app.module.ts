import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Daterangepicker } from 'ng2-daterangepicker'
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NotifierModule, NotifierOptions } from 'angular-notifier';

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
import "proj4leaflet";

import { AppComponent } from './app.component';
import { SidebarNavComponent } from './sidebar-nav/sidebar-nav.component';
import { DaterangepickerComponent } from './sidebar-nav/daterangepicker/daterangepicker.component';
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

const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'right',
			distance: 12
		},
		vertical: {
			position: 'top',
			distance: 12,
			gap: 10
		}
	},
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  declarations: [
    AppComponent,
    SidebarNavComponent,
    DaterangepickerComponent,
    MapComponent,
    DoubleSliderComponent,
    ProfPopupComponent,
    BottomSheet,
    ShapePopupComponent,
    DbOverviewComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    Daterangepicker,
    NouisliderModule,
    FormsModule,
    ReactiveFormsModule,
    NotifierModule.withConfig(customNotifierOptions),
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
  providers: [
    MapService,
    PointsService,
    QueryService,
    PopupCompileService
  ],
  entryComponents: [
    ProfPopupComponent, 
    ShapePopupComponent, 
    BottomSheet
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
