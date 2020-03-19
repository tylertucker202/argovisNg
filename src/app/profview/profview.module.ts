import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfviewComponent } from './profview.component';
import { TableComponent } from './table/table.component';
import { MaterialModule } from '../material/material.module';
import { ColorChartComponent } from './color-chart/color-chart.component';


import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
 
PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [ProfviewComponent, TableComponent, ColorChartComponent],
  imports: [
    CommonModule,
    MaterialModule,
    PlotlyModule
  ]
})
export class ProfviewModule { }
