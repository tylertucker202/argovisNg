import { Component, OnInit, Input } from '@angular/core'
import { ArQueryService } from './../ar-query.service'
import { map } from 'leaflet'

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
  private color: string
  private jsonButtonText: string

  constructor( public arQueryService: ArQueryService) { }
  
  ngOnInit(): void {
    this.color = 'primary';
    this.jsonButtonText = "Download JSON Data"
  }
  private queryARShape(): void {
    const broadcastChange = false
    const toggle3DayOff = false // should already be off
    this.arQueryService.sendShape(this.shape, broadcastChange, toggle3DayOff)
    this.arQueryService.arEvent.emit(this.shape)
  }

  private goToSelectionPage(): void {
    const windowURL = '/arShapes/findByID?_id=' + this.shape_id
    window.open(windowURL,"_blank")
  } 

  private goToHomePage(): void {
    let url = '/ng/home?'
    const dateRange = this.arQueryService.getArDateAsDateRange()
    url += '&selectionStartDate=' + dateRange.startDate + '&selectionEndDate=' + dateRange.endDate
    url += '&includeRealtime=' + JSON.stringify(this.arQueryService.getRealtimeToggle()) +
     '&onlyBGC=' + JSON.stringify(this.arQueryService.getBGCToggle()) + 
     '&onlyDeep=' + JSON.stringify(this.arQueryService.getDeepToggle()) + '&threeDayToggle=false'
    const shapeString = JSON.stringify(this.shape)
    url += '&shapes=' + shapeString
    window.open(url, "_blank")
  }
}
