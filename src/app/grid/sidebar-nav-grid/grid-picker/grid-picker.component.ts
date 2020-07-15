import { Component, OnInit, Input } from '@angular/core';
import { QueryGridService } from '../../query-grid.service';
import { GridParamGroup, GridGroup, AvailableParams, ModelParam } from '../../../../typeings/grids';
import { SelectGridService } from '../../select-grid.service';

@Component({
  selector: 'app-grid-picker',
  templateUrl: './grid-picker.component.html',
  styleUrls: ['./grid-picker.component.css']
})
export class GridPickerComponent implements OnInit {
  constructor(private queryGridService: QueryGridService,
              private selectGridService: SelectGridService) { }

  private grid: string
  private selectedParam: string
  private gridParam: string
  private gridParams: ModelParam[]
  private availableGrids: GridGroup[]
  private availableGridParams: GridParamGroup[]
  private availableParams: AvailableParams[]
  @Input() paramMode: boolean

  ngOnInit() {
    this.selectedParam = this.queryGridService.getParam()
    this.availableGrids = this.selectGridService.getAvailableGrids(this.selectedParam)
    this.availableParams = this.selectGridService.params
    this.availableGridParams = this.selectGridService.ksParams
    this.grid = this.queryGridService.getGridName()
    if (this.paramMode) {
      this.changeGridParams(this.grid)
      this.gridParam = this.queryGridService.getGridParam()
    }

    this.queryGridService.resetToStart.subscribe(msg => {
      this.grid = this.queryGridService.getGridName()
      this.changeGridParams(this.grid)
      this.selectedParam = this.queryGridService.getParam()
      this.availableGrids = this.selectGridService.getAvailableGrids(this.selectedParam)

      this.gridParam = this.queryGridService.getGridParam()
    })

    this.queryGridService.change //updates selection upon change
    .subscribe(msg => {
      const paramMode = this.queryGridService.getParamMode()
      if (msg === 'display grid param change' && paramMode) {
        this.selectedParam = this.queryGridService.getParam()
        this.grid = this.queryGridService.getGridName()
        this.gridParam = this.queryGridService.getGridParam()
        this.availableGrids = this.selectGridService.getAvailableGrids(this.selectedParam)
       }
      })
  }

  private sendGrid(): void {
    let broadcastChange
    if (this.paramMode) { broadcastChange = false }
    else { broadcastChange = true }
    this.queryGridService.sendGrid(this.grid, broadcastChange)
  } 

  private selChange(gridName: string ): void {
    this.grid = gridName
    this.changeGridParams(gridName)
    this.sendGrid();
  }

  private changeParams(param: string): void {
    this.selectedParam = param
    this.availableGrids = this.selectGridService.getAvailableGrids(this.selectedParam)
    this.queryGridService.sendParam(this.selectedParam)

  }

  private changeGridParams(gridName: string): void {
    const obj = this.availableGridParams.find(o => o.grid === gridName);
    if (obj){
      const gridParams = obj.params
      this.grid = obj.grid
      this.gridParams = gridParams
    }
    else {
      this.gridParams = []
    }
  }

  private gridParamSelected(value: string): void {
    this.gridParam = value;
    const notifyChange = true
    this.queryGridService.sendGridParam(this.grid, this.gridParam, notifyChange)
  }
}
