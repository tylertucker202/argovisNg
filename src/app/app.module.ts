import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { routes } from './app-routing.module';

import "leaflet";
import "leaflet-draw";
import "proj4leaflet";

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AboutArgovisComponent } from './navbar/about-argovis/about-argovis.component';
import { FaqComponent } from './navbar/faq/faq.component';
import { ApiTutComponent } from './navbar/api-tut/api-tut.component';
import { GriddedClimComponent } from './navbar/gridded-clim/gridded-clim.component';
import { SidebarNavComponent } from './sidebar-nav/sidebar-nav.component';
import { MapProjDropdownMenuComponent } from './sidebar-nav/map-proj-dropdown-menu/map-proj-dropdown-menu.component';
import { MapService } from './map.service';
import { PointsService } from './points.service';
import { MapComponent } from './map/map.component';
import { MapTabsComponent } from './map-tabs/map-tabs.component'

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AboutArgovisComponent,
    FaqComponent,
    ApiTutComponent,
    GriddedClimComponent,
    SidebarNavComponent,
    MapProjDropdownMenuComponent,
    MapComponent,
    MapTabsComponent
  ],
  imports: [
    BrowserModule,
    routes,
    NgbModule.forRoot(),
    HttpClientModule
  ],
  providers: [MapService, PointsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
