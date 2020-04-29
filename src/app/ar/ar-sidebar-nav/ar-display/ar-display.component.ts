import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { ArServiceService } from '../../ar-service.service'
import { ArQueryService } from '../../ar-query.service'
import { ArMapService } from './../../ar-map.service'
import { ARShape } from '../../../home/models/ar-shape'
import { DateRange } from '../../../../typeings/daterange'
import { NotifierService } from 'angular-notifier'

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
              private arQueryService: ArQueryService,
              private arMapService: ArMapService,
              private notifierService: NotifierService ) { this.notifier = notifierService }
  private arDate: moment.Moment;
  private readonly notifier: NotifierService
  private arFormDate = new FormControl( new Date( 2010, 0, 1, 0, 0, 0, 0) ) 
  
  private hour: number
  private MIN_DATE = new Date(2004, 0, 1, 0, 0, 0, 0)
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
    this.arQueryService.sendArDate(this.arDate)
    this.hour = 0
    this.setArShapesAndDate()
    this.arQueryService.resetToStart.subscribe( (msg: string) => {
      this.arDate = this.arQueryService.getArDate()
      this.arFormDate = new FormControl(this.arDate.toDate())
      this.hour = this.arDate.hour()
      this.setArShapesAndDate()
    })
  }

  dateChanged(): void {
    this.arFormDate = new FormControl(this.arDate.toDate())
    this.arQueryService.sendArDate(this.arDate)
    this.arQueryService.setURL()
    this.setArShapesAndDate() //remove if you don't want to fire ar event
  }

  timeChange(hour: number): void {
    this.hour = hour
  }

  calendarDateChanged(calDate: any): void {
    this.arDate = moment(calDate)
    this.dateChanged()
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

  private setArShapesAndDate(): void {
    this.arQueryService.sendThreeDayMsg(false, false)
    this.arQueryService.clearLayers.emit('ar shape button pressed')

    const dateString = this.arQueryService.formatDate(this.arDate)
    
    const arShapes = this.arService.getArShapes(dateString)
    const arHourRange = this.arQueryService.getArDateRange()
    arShapes.subscribe((arShapes: ARShape[]) => {
      if (arShapes.length !== 0) {
        this.setDateRange(arHourRange)
        this.setArShape(arShapes)
      }
      else {
          this.notifier.notify( 'warning', 'no ar shapes found for date selected' )
      }
    })
  }

  private setDateRange(arHourRange: number[]): void {
    const broadcastChange = false
    const startDate = this.arQueryService.formatDate(this.arDate.clone().add(arHourRange[0], 'h')) //make sure to clone and format date correctly
    const endDate = this.arQueryService.formatDate(this.arDate.clone().add(arHourRange[1], 'h'))
    const dateRange: DateRange = {startDate: startDate, endDate: endDate, label: ''}
    this.arQueryService.sendSelectedDate(dateRange, broadcastChange)
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

    const shapeFeatureGroup = this.arMapService.convertArrayToFeatureGroup(shapeArrays, this.arMapService.arShapeOptions)
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
      this.arMapService.arPopupWindowCreation(polygon, this.arMapService.arShapeItems, shapeType, shape_id)
    }
    this.arQueryService.sendARShapes(shapeArrays)
  }
}
