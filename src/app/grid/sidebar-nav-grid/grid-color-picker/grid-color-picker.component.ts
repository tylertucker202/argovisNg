import { Component, OnInit } from '@angular/core';
import { QueryGridService } from '../../query-grid.service';
import { ColorScaleGroup } from '../../../../typeings/grids';

@Component({
  selector: 'app-grid-color-picker',
  templateUrl: './grid-color-picker.component.html',
  styleUrls: ['./grid-color-picker.component.css']
})
export class GridColorPickerComponent implements OnInit {
  constructor(private queryGridService: QueryGridService) { }
  private availableColorscales: ColorScaleGroup[]
  private colorScale: string

  ngOnInit() {
    this.availableColorscales = [
      {viewValue: 'Yellow Orange Red', colorScale: 'YlOrRd'},
      {viewValue: 'Yellow Orange Brown', colorScale: 'YlOrBr'},
      {viewValue: 'Reds', colorScale: 'Reds'},
      {viewValue: 'Red Purple', colorScale: 'RdPu'},
      {viewValue: 'Purples', colorScale: 'Purples'},
      {viewValue: 'Purple to Red', colorScale: 'PuRd'},
      {viewValue: 'Purple Blue Green', colorScale: 'PuBuGn'},
      {viewValue: 'Orange to Red', colorScale: 'OrRd'},
      {viewValue: 'Oranges', colorScale: 'Oranges'},
      {viewValue: 'Greys', colorScale: 'Greys'},
      {viewValue: 'Greens', colorScale: 'Greens'},
      {viewValue: 'Green to Blue', colorScale: 'GnBu'},
      {viewValue: 'Blue to Purple', colorScale: 'BuPu'},
      {viewValue: 'Blue to Green', colorScale: 'BuGn'},
      {viewValue: 'Blues', colorScale: 'Blues'}
      
    ]

    this.colorScale = this.queryGridService.getColorScale()

    this.queryGridService.resetToStart
    .subscribe(msg => {
      this.colorScale = this.queryGridService.getColorScale()
    })
  }

  private changeColorScale(colorScale: string): void {
    const sendMessage = true
    this.colorScale = colorScale
    this.queryGridService.sendColorScaleMessage(this.colorScale, sendMessage)
  }

}
