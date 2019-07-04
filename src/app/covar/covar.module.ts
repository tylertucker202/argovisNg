import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CovarComponent } from './covar.component';
import { MapCovarComponent } from './map-covar/map-covar.component';

@NgModule({
  declarations: [CovarComponent, MapCovarComponent],
  imports: [
    CommonModule
  ]
})
export class CovarModule { }
