import { Component, OnInit, Input } from '@angular/core';
import { QueryService } from '../query.service';

@Component({
  selector: 'app-shape-popup',
  templateUrl: './shape-popup.component.html',
  styleUrls: ['./shape-popup.component.css']
})
export class ShapePopupComponent implements OnInit {
  @Input() shape: any;
  constructor(private queryService: QueryService) { }

  ngOnInit() {
  }

  goToSelectionPage(includePresRange: boolean): void {
    let base = '/selection/profiles/page'
    let dates = this.queryService.getDates();
    let presRange = this.queryService.getPresRange();
    let includeRealtime = this.queryService.getToggle();

    let selectionPageUrl = base+'?startDate=' + dates.start + '&endDate=' + dates.end
    if (includePresRange) {
      selectionPageUrl += '&presRange='+JSON.stringify(presRange)
    }
    selectionPageUrl += '&shape='+JSON.stringify(this.shape)
    //'&includeRT='+JSON.stringify(includeRealtime);
    console.log('selection clicked');
    console.log(selectionPageUrl);
    window.open(selectionPageUrl,"_blank")
  }

}
