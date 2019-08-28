import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CovarComponent } from './covar.component';
import { MapCovarComponent } from './map-covar/map-covar.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ControlComponent } from './control/control.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [CovarComponent, MapCovarComponent, ControlComponent],
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
  ]
})
export class CovarModule { }
