import { Component, OnInit, Input } from '@angular/core';
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
    this.arQueryService.arEvent.emit('trasfering ar shape to drawn shape')
  }

  private goToSelectionPage(goToPage: boolean): void {
    const windowURL = '/arShapes/findByID?_id=' + this.shape_id

    window.open(windowURL,"_blank")
  } 
}
