import { Component, OnInit, Input } from '@angular/core';
import { QueryGridService } from '../../query-grid.service';
import { MeasGroup } from '../../../../typeings/grids';

@Component({
  selector: 'app-grid-picker',
  templateUrl: './grid-picker.component.html',
  styleUrls: ['./grid-picker.component.css']
})
export class GridPickerComponent implements OnInit {
  constructor(private queryGridService: QueryGridService) { }

  private grid: string;
  private params: string[];
  private param: string;
  private availableGrids: MeasGroup[]
  private availableParams: MeasGroup[] | any
  @Input() displayGridParam: boolean

  ngOnInit() {
    this.availableGrids = this.queryGridService.allGrids
    this.availableParams = this.queryGridService.allGridParams[0].producers[0].grids
    this.grid = this.queryGridService.getGrid()
    this.changeParams(this.grid)
    this.param = this.queryGridService.getGridParam()
    console.log('grid and param set:', this.grid, this.param)

    this.queryGridService.resetToStart.subscribe(msg => {
      this.grid = this.queryGridService.getGrid()
      this.changeParams(this.grid)
      this.param = this.queryGridService.getGridParam()
    })
  }

  private sendGrid(): void {
    let broadcastChange
    if (this.displayGridParam) { broadcastChange = true }
    else { broadcastChange = false }
    this.queryGridService.sendGridMessage(this.grid, broadcastChange)
  } 

  private selChange(grid: string ): void {
    this.grid = grid
    this.sendGrid();
  }

  private changeParams(gridName: string): void {
    const obj = this.availableParams.find(o => o.grid === gridName);
    this.grid = obj.grid
    this.params = obj.params;
  }

  private paramSelected(value: string): void {
    console.log('paramSelected event:', this.grid, value)
    this.param = value;
    const notifyChange = true
    this.queryGridService.sendGridParamMessage(this.grid, this.param, notifyChange)
  }
}
