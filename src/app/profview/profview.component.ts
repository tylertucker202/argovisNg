import { Component, OnInit } from '@angular/core';
import { QueryProfviewService } from './query-profview.service'
@Component({
  selector: 'app-profview',
  templateUrl: './profview.component.html',
  styleUrls: ['./profview.component.css']
})
export class ProfviewComponent implements OnInit {
  public selectedIndex: number = 0
  constructor(private queryProfviewService: QueryProfviewService) { }

  ngOnInit(): void {
    this.queryProfviewService.urlParsed.subscribe( (msg: string) => {
      this.selectedIndex = this.queryProfviewService.selectedIndex
    } )
  }

}
