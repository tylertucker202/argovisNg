import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
import { GridModule } from './grid/grid.module';
import { CovarModule } from './covar/covar.module';
import { ProfviewModule } from './profview/profview.module';
import { ArModule } from './ar/ar.module';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TopToolbarComponent } from './top-toolbar/top-toolbar.component';

import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { JsonldComponent } from './jsonld/jsonld.component';

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
    TopToolbarComponent,
    JsonldComponent
  ],
  imports: [
    MaterialModule,
    AppRoutingModule,
    HomeModule,
    GridModule,
    CovarModule,
    ArModule,
    ProfviewModule,
    BrowserModule,
    BrowserAnimationsModule,
    NotifierModule.withConfig(customNotifierOptions),
  ],
  exports: [
    MaterialModule,
    AppRoutingModule,
    HomeModule,
    GridModule,
    CovarModule,
    ArModule,
    ProfviewModule,
    BrowserModule,
    BrowserAnimationsModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
