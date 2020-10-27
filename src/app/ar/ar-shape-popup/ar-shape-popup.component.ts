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
  public bgcOnlyToggle: boolean
  public deepOnlyToggle: boolean
 
  public color: string
  public jsonButtonText: string
  public shapeButtonText: string

  constructor( private arQueryService: ArQueryService ) { }
  
  ngOnInit(): void {
    this.color = 'primary';
    this.jsonButtonText = "Download JSON Data"
    this.bgcOnlyToggle = false
    this.deepOnlyToggle = false
    this.shapeButtonText = "To Selection Page"
    this.queryARShape()
  }

  public bgcOnlyChange(bgcOnlyToggle: boolean): void {
    this.bgcOnlyToggle = bgcOnlyToggle
  }

  public deepOnlyChange(deepOnlyToggle: boolean): void {
    this.deepOnlyToggle = deepOnlyToggle
  }

  public queryARShape(): void {
    const broadcastChange = true
    const toggle3DayOff = false // should already be off
    let shapes = this.arQueryService.get_shapes()
    shapes? shapes.push(this.shape[0]) : shapes = this.shape

    this.arQueryService.sendShape(shapes, broadcastChange, toggle3DayOff)
  }

  public generateURL(goToPage: boolean): string {
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

  public generateHomepageURL(): string {
    let url = '/ng/home?'
    const dateRange = this.arQueryService.get_ar_dateAsDateRange()
    url += '&selectionStartDate=' + dateRange.startDate + '&selectionEndDate=' + dateRange.endDate
    url += '&includeRealtime=' + JSON.stringify(this.arQueryService.get_realtime_toggle()) +
     '&onlyBGC=' + JSON.stringify(this.arQueryService.get_bgc_toggle()) + 
     '&onlyDeep=' + JSON.stringify(this.arQueryService.get_deep_toggle()) + '&threeDayToggle=false'
    const shapeString = JSON.stringify(this.shape)
    url += '&shapes=' + shapeString
     return url
  }

  public goToSelectionPage(goToPage: boolean): void {
    const url = this.generateURL(goToPage)
    window.open(url,"_blank")
  }

  public goToShapeJson(): void {
    const windowURL = '/arShapes/findByID?_id=' + this.shape_id
    window.open(windowURL,"_blank")
  } 

  public goToHomePage(): void {
    const url = this.generateHomepageURL()
    window.open(url, "_blank")
  }
}
