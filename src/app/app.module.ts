import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { routes } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AboutArgovisComponent } from './navbar/about-argovis/about-argovis.component';
import { FaqComponent } from './navbar/faq/faq.component';
import { ApiTutComponent } from './navbar/api-tut/api-tut.component';
import { GriddedClimComponent } from './navbar/gridded-clim/gridded-clim.component';
import { SidebarNavComponent } from './sidebar-nav/sidebar-nav.component';
import { LeafletMapComponent } from './leaflet-map/leaflet-map.component';
import { MapProjDropdownMenuComponent } from './sidebar-nav/map-proj-dropdown-menu/map-proj-dropdown-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AboutArgovisComponent,
    FaqComponent,
    ApiTutComponent,
    GriddedClimComponent,
    SidebarNavComponent,
    LeafletMapComponent,
    MapProjDropdownMenuComponent
  ],
  imports: [
    BrowserModule,
    routes,
    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot(),
    NgbModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
