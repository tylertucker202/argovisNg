import { Component, OnInit, Input } from '@angular/core'
import { QueryService } from '../services/query.service'

@Component({
  selector: 'app-shape-popup',
  templateUrl: './shape-popup.component.html',
  styleUrls: ['./shape-popup.component.css']
})
export class ShapePopupComponent implements OnInit {
  @Input() shape: number[][][]
  @Input() transformedShape: number[][]
  @Input() message: string
  private color: string
  private arMode = false
  private presRangeToggle: boolean
  private pageToggle: boolean
  private buttonText: string
  constructor(private queryService: QueryService) { }

  ngOnInit() {
    this.color = 'primary';
    this.presRangeToggle = true
    this.pageToggle = true
    this.updateButtonText()
    if (this.message ==='atmospheric river shape' ) {
      this.arMode = true
    }
  }

  private presRangeChange(presRangeToggle: boolean): void {
    this.presRangeToggle = presRangeToggle;
    this.updateButtonText()
  }

  private pageChange(pageToggle: boolean): void {
    this.pageToggle = pageToggle
    this.updateButtonText()
  }

  private updateButtonText(): void {
    let buttonText
    this.pageToggle ? buttonText = 'To Selection Page': buttonText = 'Download JSON Data'
    if (this.presRangeToggle) { buttonText += ' with pressure query' }
    this.buttonText  = buttonText
  }

  private goToSelectionPage(): void {

    let base = '/selection/profiles'
    if (this.pageChange) {
      base += '/page'
    }
    let dates = this.queryService.getSelectionDates();
    let presRange = this.queryService.getPresRange();

    let selectionPageUrl = base+'?startDate=' + dates.start + '&endDate=' + dates.end
    if (this.presRangeToggle) {
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
