import { Component, OnInit } from '@angular/core';
import { QueryProfviewService } from './query-profview.service'
@Component({
  selector: 'app-profview',
  templateUrl: './profview.component.html',
  styleUrls: ['./profview.component.css']
})
export class ProfviewComponent implements OnInit {
  private topChart: string
  private bottomChart: string
  constructor(private profViewService: QueryProfviewService) { }

  ngOnInit(): void {
    this.topChart = this.profViewService.topChart
    this.bottomChart = this.profViewService.bottomChart
  }

}
