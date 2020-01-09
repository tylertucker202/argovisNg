import { Component, OnInit, Input } from '@angular/core';
import { QueryService } from '../services/query.service';

@Component({
  selector: 'app-shape-popup',
  templateUrl: './shape-popup.component.html',
  styleUrls: ['./shape-popup.component.css']
})
export class ShapePopupComponent implements OnInit {
  @Input() shape: number[][][];
  @Input() transformedShape: number[][];
  @Input() message: string;
  private color: string;
  private arMode = false;
  constructor(private queryService: QueryService) { }

  ngOnInit() {
    this.color = 'primary';
    if (this.message ==='atmospheric river shape' ) {
      this.arMode = true;
    }
  }

  private goToSelectionPage(includePresRange: boolean): void {
    let base = '/selection/profiles/page'
    let dates = this.queryService.getSelectionDates();
    let presRange = this.queryService.getPresRange();

    let selectionPageUrl = base+'?startDate=' + dates.start + '&endDate=' + dates.end
    if (includePresRange) {
      selectionPageUrl += '&presRange='+JSON.stringify(presRange)
    }
    selectionPageUrl += '&shape='+JSON.stringify(this.transformedShape)
    //'&includeRT='+JSON.stringify(includeRealtime);
    window.open(selectionPageUrl,"_blank")
  }

  private queryARShape(): void {
    const broadcastChange = false
    const toggle3DayOff = false // should already be off
    this.queryService.sendShape(this.shape, broadcastChange, toggle3DayOff)
    this.queryService.arEvent.emit('trasfering ar shape to drawn shape')
  }

}
