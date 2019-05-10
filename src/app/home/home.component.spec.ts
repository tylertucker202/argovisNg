import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';

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
import { Daterangepicker } from 'ng2-daterangepicker'
import "leaflet";
import "leaflet-draw";
import "proj4leaflet";
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// home and its components
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
import { NotifierModule, NotifierOptions } from 'angular-notifier';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        SidebarNavComponent,
        DaterangepickerComponent,
        MapComponent,
        DoubleSliderComponent,
        ProfPopupComponent,
        BottomSheet,
        ShapePopupComponent,
        DbOverviewComponent,],
      imports: [
        HttpClientModule,
        BrowserAnimationsModule,
        Daterangepicker,
        NouisliderModule,
        FormsModule,
        ReactiveFormsModule,
        NotifierModule,
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
        Daterangepicker,
        RouterTestingModule
      ],
      providers: [
        MapService,
        PointsService,
        QueryService,
        PopupCompileService
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
