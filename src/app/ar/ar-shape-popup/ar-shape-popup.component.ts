import { Component, OnInit, Input } from '@angular/core'
import { ArQueryService } from './../ar-query.service'

@Component({
  selector: 'app-ar-shape-popup',
  templateUrl: './ar-shape-popup.component.html',
  styleUrls: ['./ar-shape-popup.component.css']
})
export class ArShapePopupComponent implements OnInit {
  @Input() shape: number[][][]
  @Input() transformedShape: number[][]
  @Input() message: string
  @Input() shape_id: string
  private bgcOnlyToggle: boolean
  private deepOnlyToggle: boolean
 
  private color: string
  private jsonButtonText: string
  private shapeButtonText: string

  constructor( private arQueryService: ArQueryService ) { }
  
  ngOnInit(): void {
    this.color = 'primary';
    this.jsonButtonText = "Download JSON Data"
    this.bgcOnlyToggle = false
    this.deepOnlyToggle = false
    this.shapeButtonText = "To Selection Page"
    this.queryARShape()
  }

  private bgcOnlyChange(bgcOnlyToggle: boolean): void {
    this.bgcOnlyToggle = bgcOnlyToggle
  }

  private deepOnlyChange(deepOnlyToggle: boolean): void {
    this.deepOnlyToggle = deepOnlyToggle
  }

  private queryARShape(): void {
    const broadcastChange = true
    const toggle3DayOff = false // should already be off
    let shapes = this.arQueryService.getShapes()
    shapes? shapes.push(this.shape[0]) : shapes = this.shape

    this.arQueryService.sendShape(shapes, broadcastChange, toggle3DayOff)
    this.arQueryService.arEvent.emit(this.shape)
  }

  private generateURL(goToPage: boolean): string {
    let url = '/selection/profiles'
    if (goToPage) {
      url += '/page'
    }
    let dates = this.arQueryService.getSelectionDates();
    url += '?startDate=' + dates.startDate + '&endDate=' + dates.endDate
    if (this.bgcOnlyToggle) {
      url += '&bgcOnly=true'
    }
    if (this.deepOnlyToggle) {
      url += '&deepOnly=true'
    }
    url += '&shape='+JSON.stringify(this.transformedShape)
    return url 
  }

  private generateHomepageURL(): string {
    let url = '/ng/home?'
    const dateRange = this.arQueryService.getArDateAsDateRange()
    url += '&selectionStartDate=' + dateRange.startDate + '&selectionEndDate=' + dateRange.endDate
    url += '&includeRealtime=' + JSON.stringify(this.arQueryService.getRealtimeToggle()) +
     '&onlyBGC=' + JSON.stringify(this.arQueryService.getBGCToggle()) + 
     '&onlyDeep=' + JSON.stringify(this.arQueryService.getDeepToggle()) + '&threeDayToggle=false'
    const shapeString = JSON.stringify(this.shape)
    url += '&shapes=' + shapeString
     return url
  }

  private goToSelectionPage(goToPage: boolean): void {
    const url = this.generateURL(goToPage)
    window.open(url,"_blank")
  }

  private goToShapeJson(): void {
    const windowURL = '/arShapes/findByID?_id=' + this.shape_id
    window.open(windowURL,"_blank")
  } 

  private goToHomePage(): void {
    const url = this.generateHomepageURL()
    window.open(url, "_blank")
  }
}
