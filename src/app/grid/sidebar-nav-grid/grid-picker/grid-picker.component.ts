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
    console.log(this.availableParams)
    this.grid = this.queryGridService.getGrid()

    this.queryGridService.resetToStart.subscribe(msg => {
      this.grid = this.queryGridService.getGrid()
    })
  }

  private sendGrid(): void {
    const broadcastChange = true
    this.queryGridService.sendGridMessage(this.grid, broadcastChange)
  } 

  private selChange(grid: any ): void {
    this.grid = grid.value
    console.log(this.grid)
    this.sendGrid();
  }

  private changeParams(gridName: string): void {
    const obj = this.availableParams.find(o => o.grid === gridName);
    this.grid = obj.grid
    this.params = obj.params;
  }

  private paramSelected(value: string): void {
    console.log(this.grid, value)
    this.param = value;
    this.queryGridService.sendGridParamMessage(this.grid, this.param)
  }
}
