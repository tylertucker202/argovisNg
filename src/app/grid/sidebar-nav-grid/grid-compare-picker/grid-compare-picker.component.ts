import { Component, OnInit, Input } from '@angular/core';
import { QueryGridService } from '../../query-grid.service'
import { GridGroup } from '../../../../typeings/grids';
import { SelectGridService } from '../../select-grid.service';

@Component({
  selector: 'app-grid-compare-picker',
  templateUrl: './grid-compare-picker.component.html',
  styleUrls: ['./grid-compare-picker.component.css']
})
export class GridComparePickerComponent implements OnInit {

  constructor(private queryGridService: QueryGridService,
              private selectGridService: SelectGridService) { }

  private compareGrid: boolean
  private grid: string
  private param: string

  private availableGrids: GridGroup[]

  ngOnInit() {
    this.param = this.queryGridService.getParam()
    this.availableGrids = this.selectGridService.getAvailableGrids(this.param)
    this.compareGrid = this.queryGridService.getCompare()
    this.grid = this.queryGridService.getCompareGrid()

    this.queryGridService.change //updates selection upon change
    .subscribe(msg => {
       if (msg === 'param change'){
        this.param = this.queryGridService.getParam()
        this.availableGrids = this.selectGridService.getAvailableGrids(this.param)
       }
       if (msg === 'display grid param change' && this.compareGrid) {
        this.param = this.queryGridService.getParam()
        this.availableGrids = this.selectGridService.getAvailableGrids(this.param)
       }
      })

      this.queryGridService.resetToStart //updates selection upon change
      .subscribe(msg => {
        this.compareGrid = this.queryGridService.getCompare();
      })

  }

  compareGridToggle(checked: boolean): void {
    this.compareGrid = checked
    const broadcast = true
    this.queryGridService.sendCompare(this.compareGrid, broadcast);
  }

  private sendGrid(): void {
    const broadcastChange = true
    this.queryGridService.sendCompareGridMessage(this.grid, broadcastChange)
  }

  private selChange(grid: string ): void {
    this.grid = grid
    this.sendGrid();
  }

}
