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
  private presRangeToggle: boolean
  private bgcOnlyToggle: boolean
  private deepOnlyToggle: boolean
  private pageToggle: boolean
  private shapeButtonText: string
  private jsonButtonText: string
  constructor(private queryService: QueryService) { }

  ngOnInit() {
    this.color = 'primary';
    this.presRangeToggle = true
    this.bgcOnlyToggle = false
    this.deepOnlyToggle = false
    this.shapeButtonText = "To Selection Page"
    this.jsonButtonText = "Download JSON Data"
  }

  private presRangeChange(presRangeToggle: boolean): void {
    this.presRangeToggle = presRangeToggle;
  }

  private bgcOnlyChange(bgcOnlyToggle: boolean): void {
    this.bgcOnlyToggle = bgcOnlyToggle
  }

  private deepOnlyChange(deepOnlyToggle: boolean): void {
    this.deepOnlyToggle = deepOnlyToggle
  }

  private pageChange(pageToggle: boolean): void {
    this.pageToggle = pageToggle
  }

  private generateURL(goToPage: boolean): string {
    let url = '/selection/profiles'
    if (goToPage) {
      url += '/page'
    }
    let dates = this.queryService.getSelectionDates();
    url += '?startDate=' + dates.startDate + '&endDate=' + dates.endDate
    if (this.presRangeToggle) {
      const presRange = this.queryService.getPresRange();
      url += '&presRange='+JSON.stringify(presRange)
    }
    if (this.bgcOnlyToggle) {
      url += '&bgcOnly=true'
    }
    if (this.deepOnlyToggle) {
      url += '&deepOnly=true'
    }
    url += '&shape='+JSON.stringify(this.transformedShape)
    return url 
  }

  private goToSelectionPage(goToPage: boolean): void {
    const url = this.generateURL(goToPage)
    window.open(url,"_blank")
  }



}
