import { Component, OnInit, Input } from '@angular/core';
import { QueryGridService } from '../../query-grid.service'
import { MeasGroup } from '../../../../typeings/grids';

@Component({
  selector: 'app-grid-compare-picker',
  templateUrl: './grid-compare-picker.component.html',
  styleUrls: ['./grid-compare-picker.component.css']
})
export class GridComparePickerComponent implements OnInit {

  constructor(private queryGridService: QueryGridService) { }

  private compareGrid: boolean
  private grid: string

  private availableGrids: MeasGroup[]

  ngOnInit() {
    this.availableGrids = this.queryGridService.allGrids
    this.compareGrid = this.queryGridService.getCompare()
    this.grid = this.queryGridService.getCompareGrid()
  }

  compareGridToggle(event: any): void {
    this.compareGrid = event.checked
    this.queryGridService.sendCompare(this.compareGrid);
  }

  private sendGrid(): void {
    const broadcastChange = true
    this.queryGridService.sendCompareGridMessage(this.grid, broadcastChange)
  } 
  private selChange(grid: any ): void {
    this.grid = grid.value
    this.sendGrid();
  }

}
