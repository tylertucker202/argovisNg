import { Component, OnInit } from '@angular/core';
import { QueryProfviewService } from './query-profview.service'
// import { Promise } from 'rxjs'
@Component({
  selector: 'app-profview',
  templateUrl: './profview.component.html',
  styleUrls: ['./profview.component.css']
})
export class ProfviewComponent implements OnInit {
  public selectedIndex: number
  constructor(private queryProfviewService: QueryProfviewService) { }

  ngOnInit(): void {
    this.selectedIndex = this.queryProfviewService.selectedIndex //init will change soon

    this.queryProfviewService.urlParsed.subscribe( (msg: string) => {
      this.selectedIndex = this.queryProfviewService.selectedIndex
    } )
  }

  on_tab_click(index: number): void {
    this.selectedIndex = index
    this.queryProfviewService.selectedIndex = this.selectedIndex
    console.log(this.queryProfviewService.selectedIndex)
    this.queryProfviewService.set_url()
    this.queryProfviewService.urlParsed.emit('tab changed in url')
  }

}
