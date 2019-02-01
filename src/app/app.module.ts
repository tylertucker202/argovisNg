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

// home and its components
import { HomeComponent } from './home/home.component';
import { SidebarNavComponent } from './home/sidebar-nav/sidebar-nav.component';
import { DaterangepickerComponent } from './home/sidebar-nav/daterangepicker/daterangepicker.component';
import { MapService } from './home/services/map.service';
import { QueryService } from './home/services/query.service'
import { PointsService } from './home/services/points.service';
import { PopupCompileService } from './home/services/popup-compile.service';
import { MapComponent } from './home/map/map.component';
import { NouisliderModule } from 'ng2-nouislider';
import { DoubleSliderComponent } from './home/sidebar-nav/double-slider/double-slider.component';
import { ProfPopupComponent } from './home/prof-popup/prof-popup.component';
import { ShapePopupComponent } from './home/shape-popup/shape-popup.component';
import { DbOverviewComponent, BottomSheet } from './home/sidebar-nav/db-overview/db-overview.component';

import { AppRoutingModule } from './app-routing.module';

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
    HomeComponent,
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
    AppRoutingModule,
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
