import { Component, OnInit, Input } from '@angular/core';
import { QueryGridService } from '../../query-grid.service';
import { GridParamGroup, GridGroup, AvailableParams, ModelParam, GridMeta } from '../../../../typeings/grids';
import { SelectGridService } from '../../select-grid.service';

@Component({
  selector: 'app-grid-picker',
  templateUrl: './grid-picker.component.html',
  styleUrls: ['./grid-picker.component.css']
})
export class GridPickerComponent implements OnInit {
  constructor(private queryGridService: QueryGridService,
              private selectGridService: SelectGridService) { }

  private gridName: string
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
    this.gridName = this.queryGridService.getGridName()
    if (this.paramMode) {
      this.changeGridParams(this.gridName)
      this.gridParam = this.queryGridService.getGridParam()
    }

    this.queryGridService.resetToStart.subscribe(msg => {
      this.gridName = this.queryGridService.getGridName()
      this.changeGridParams(this.gridName)
      this.selectedParam = this.queryGridService.getParam()
      this.availableGrids = this.selectGridService.getAvailableGrids(this.selectedParam)

      this.gridParam = this.queryGridService.getGridParam()
    })

    this.queryGridService.change //updates selection upon change
    .subscribe(msg => {
      const paramMode = this.queryGridService.getParamMode()
      if (msg === 'display grid param change' && paramMode) {
        this.selectedParam = this.queryGridService.getParam()
        this.gridName = this.queryGridService.getGridName()
        this.gridParam = this.queryGridService.getGridParam()
        this.availableGrids = this.selectGridService.getAvailableGrids(this.selectedParam)
       }
      })
  }

  private sendGrid(): void {
    let broadcastChange = !this.paramMode
    this.selectGridService.getGridMeta(this.gridName).subscribe( (gridMetas: GridMeta[] )=> {
      //quietly check the pressure level and update pressure if invalid.
      if (!gridMetas[0].presLevels.includes(this.queryGridService.getPresLevel())) {
        this.queryGridService.sendPres(gridMetas[0].presLevels[0], false)
      }
      this.queryGridService.sendGrid(this.gridName, false)
      this.selectGridService.gridMetaChange.emit(gridMetas[0])

      //safe to update grid and broadcast change.
      this.queryGridService.sendGrid(this.gridName, broadcastChange)
    })
  } 

  private selChange(gridName: string ): void {
    this.gridName = gridName
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
      this.gridName = obj.grid
      this.gridParams = gridParams
    }
    else {
      this.gridParams = []
    }
  }

  private gridParamSelected(value: string): void {
    this.gridParam = value;
    const notifyChange = true
    this.queryGridService.sendGridParam(this.gridName, this.gridParam, notifyChange)
  }
}
