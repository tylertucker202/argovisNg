import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { ArServiceService } from './../../services/ar-service.service'
import { QueryService } from './../../services/query.service'
import { MapService } from './../../services/map.service'
import { ARShape } from './../../models/ar-shape'
import { DateRange } from './../../../../typeings/daterange'


import * as moment from 'moment';

export interface DropDownSelection {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-ar-display',
  templateUrl: './ar-display.component.html',
  styleUrls: ['./ar-display.component.css']
})
export class ArDisplayComponent implements OnInit {

  constructor(private arService: ArServiceService,
              private queryService: QueryService,
              private mapService: MapService ) { }
  private arDate: moment.Moment;
  private arFormDate = new FormControl( new Date( 2010, 0, 1, 0, 0, 0, 0) ) 
  
  private hour: number
  private MIN_DATE = new Date(2007, 0, 1, 0, 0, 0, 0)
  private MAX_DATE = new Date(2016, 12, 31, 0, 0, 0, 0)
  private hours: DropDownSelection[] = [
    {value: 0, viewValue: '0:00'},
    {value: 3, viewValue: '3:00'},
    {value: 6, viewValue: '6:00'},
    {value: 9, viewValue: '9:00'},
    {value: 12, viewValue: '12:00'},
    {value: 15, viewValue: '15:00'},
    {value: 18, viewValue: '18:00'},
    {value: 21, viewValue: '21:00'},
  ];

  ngOnInit() { 
    this.arDate = moment(this.arFormDate.value)
    this.queryService.sendArDate(this.arDate)
    this.hour = 0
    if(this.queryService.arModule) { this.setArShapesAndDate() } //set shapes up on map.
    this.queryService.resetToStart.subscribe( (msg: string) => {
      this.arDate = this.queryService.getArDate()
      this.arFormDate = new FormControl(this.arDate.toDate())
      this.hour = this.arDate.hour()
      if (this.queryService.arModule) { this.setArShapesAndDate() }
    })
  }

  dateChanged(): void {
    this.arFormDate = new FormControl(this.arDate.toDate())
    this.queryService.sendArDate(this.arDate)
    this.queryService.setURL()
  }

  timeChange(hour: number): void {
    this.hour = hour
  }

  private incrementDay(increment: number): void {
    this.arDate = this.arDate.add(increment, 'd')
    this.dateChanged()
  }

  private incrementHour(increment: number): void {
    this.arDate = this.arDate.add(increment, 'h')
    this.dateChanged()
    this.hour = this.arDate.hour()
  }

  private formatDate(date: moment.Moment): string {
    return date.format("YYYY-MM-DDTHH:mm:ss") + 'Z'
  }

  public setArShapesAndDate(): void {
    this.queryService.sendThreeDayMsg(false, false)
    this.queryService.clearLayers.emit('ar shape button pressed')

    const dateString = this.formatDate(this.arDate)
    
    const arShapes = this.arService.getArShapes(dateString)
    const arDateRange = this.queryService.getArDateRange()
    arShapes.subscribe((arShapes: ARShape[]) => {
      if (arShapes.length !== 0) {
        this.setDateRange(arDateRange)
        this.setArShape(arShapes)
      }
    })
  }

  private setDateRange(arDateRange: number[]): void {
    const broadcastChange = false
    const startDate = this.formatDate(this.arDate.clone().add(arDateRange[0], 'h')) //make sure to clone and format date correctly
    const endDate = this.formatDate(this.arDate.clone().add(arDateRange[1], 'h'))
    const dateRange: DateRange = {startDate: startDate, endDate: endDate, label: ''}
    this.queryService.sendSelectedDate(dateRange, broadcastChange)
  }

  private setArShape(arShapes: ARShape[]) {
    let shapeArrays = []
    let shape_ids = []
    for(let idx=0; idx<arShapes.length; idx++){
      let sa = arShapes[idx].geoLocation.coordinates
      sa = this.arService.swapCoords(sa)
      const shape_id = arShapes[idx]._id
      shape_ids.push(shape_id)
      shapeArrays.push(sa)
    }

    const shapeFeatureGroup = this.mapService.convertArrayToFeatureGroup(shapeArrays, this.mapService.arShapeOptions)
    const shapeType = 'atmospheric river shape'

    let shapes = []
    let idx = 0
    shapeFeatureGroup.eachLayer( (layer: unknown) => {
      const polygon = layer as L.Polygon
      shapes.push([shape_ids[idx], polygon])
      idx += 1
    })
    for(let idx=0; idx<shapes.length; idx++){
      const shape_id = shapes[idx][0]
      const polygon = shapes[idx][1] as L.Polygon
      this.mapService.popupWindowCreation(polygon, this.mapService.arShapeItems, shapeType, shape_id)
    }
    this.queryService.sendARShapes(shapeArrays)
  }
}
