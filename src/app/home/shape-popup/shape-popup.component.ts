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
  @Input() shape_id: string
  private color: string
  private arMode = false
  private presRangeToggle: boolean
  private pageToggle: boolean
  private shapeButtonText: string
  private jsonButtonText: string
  constructor(private queryService: QueryService) { }

  ngOnInit() {
    this.color = 'primary';
    this.presRangeToggle = true
    this.updateShapeButtonText()
    this.updateJSONButtonText()
    if (this.message ==='atmospheric river shape' ) {
      this.arMode = true
    }
  }

  private presRangeChange(presRangeToggle: boolean): void {
    this.presRangeToggle = presRangeToggle;
    this.updateShapeButtonText()
    this.updateJSONButtonText()
  }

  private pageChange(pageToggle: boolean): void {
    this.pageToggle = pageToggle
    this.updateShapeButtonText()
    this.updateJSONButtonText()
  }

  private updateShapeButtonText(): void {
    let shapeButtonText = "To Selection Page"
    //if (this.presRangeToggle) { shapeButtonText += ' with pressure query' }
    this.shapeButtonText  = shapeButtonText
  }

  private updateJSONButtonText(): void {
    let jsonButtonText = 'Download JSON Data'
    //if (this.presRangeToggle) { jsonButtonText += ' with pressure query'}
    this.jsonButtonText = jsonButtonText
  }

  private goToSelectionPage(goToPage: boolean): void {

    let windowURL: string
    if (this.arMode) {
      windowURL = '/arShapes/findByID?_id=' + this.shape_id
    }
    else {
      windowURL = '/selection/profiles'
      if (goToPage) {
        windowURL += '/page'
      }
      let dates = this.queryService.getSelectionDates();
      windowURL += '?startDate=' + dates.startDate + '&endDate=' + dates.endDate
      if (this.presRangeToggle) {
        const presRange = this.queryService.getPresRange();
        windowURL += '&presRange='+JSON.stringify(presRange)
      }
      windowURL += '&shape='+JSON.stringify(this.transformedShape) 
    }

    window.open(windowURL,"_blank")
  }

  private queryARShape(): void {
    const broadcastChange = false
    const toggle3DayOff = false // should already be off
    this.queryService.sendShape(this.shape, broadcastChange, toggle3DayOff)
    this.queryService.arEvent.emit('trasfering ar shape to drawn shape')
  }

}
