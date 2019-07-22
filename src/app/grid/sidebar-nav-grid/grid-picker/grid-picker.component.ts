import { Component, OnInit } from '@angular/core';
import { QueryGridService } from '../../query-grid.service';

export interface Grids {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-grid-picker',
  templateUrl: './grid-picker.component.html',
  styleUrls: ['./grid-picker.component.css']
})
export class GridPickerComponent implements OnInit {
  constructor(private queryGridService: QueryGridService) { }

  private grid: string;
  private grids: Grids[] = [
    {value: 'rg', viewValue: 'Roemmich-Gilson' },
    {value: 'kuusela' , viewValue: 'Kuusela-Stein'  },
  ];

  ngOnInit() { 
    this.grid = this.queryGridService.getGrid()

    this.queryGridService.resetToStart.subscribe((msg) => {
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
}
