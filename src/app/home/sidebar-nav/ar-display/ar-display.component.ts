import { Component, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
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

  constructor(public dialogRef: MatDialogRef<ArDisplayComponent>, 
              private arService: ArServiceService,
              private queryService: QueryService,
              private mapService: MapService ) { }
  private datetime: moment.Moment;
  private arDate = new FormControl( new Date( 2010, 0, 1, 0, 0, 0, 0) ) 
  
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
    this.datetime = moment(this.arDate.value)
    this.hour = 0
  }

  dateChanged(date: Date): void {
    this.arDate = new FormControl(moment(date))
  }

  timeChange(hour: number): void {
    this.hour = hour
  }

  private incrementDay(increment: number): void {
    this.datetime = this.datetime.add(increment, 'd')
    this.arDate = new FormControl( this.datetime.toDate() )
  }

  private incrementHour(increment: number): void {
    this.datetime = this.datetime.add(increment, 'h')
    this.arDate = new FormControl( this.datetime.toDate() )
    this.hour = this.datetime.hour()
  }

  private onNoClick(): void {
    this.dialogRef.close();
  }

  private setArShapesAndDate(): void {
    console.log('getting shapes')
    console.log('this is the datetime', this.datetime)
    const dateString = this.datetime.format("YYYY-MM-DDTHH:mm:ss") + 'Z'
    console.log('this is the datetime string', dateString)
    const arShapes = this.arService.getArShapes(dateString)
    //const arShapes = this.arService.getMockShape(this.datetime)
    arShapes.subscribe((arShapes: ARShape[]) => {
      if (arShapes.length == 0) {
      }
      else {
        console.log('setting date range')
        this.setDateRange()
        this.setArShape(arShapes)
        const startDate = this.datetime.add(-1.5, 'h').toISOString()
        const endDate = this.datetime.add(1.5, 'h').toISOString()
        const dateRange: DateRange = {start: startDate, end: endDate, label: ''}
        this.queryService.sendSelectedDate(dateRange)
        console.log('setting stuff')
        this.dialogRef.close();
      }
    })
  }

  private setDateRange(): void {
    const broadcastChange = false
    const startDate = this.datetime.add(-1.5, 'h').toISOString()
    const endDate = this.datetime.add(1.5, 'h').toISOString()
    const dateRange: DateRange = {start: startDate, end: endDate, label: ''}
    this.queryService.sendSelectedDate(dateRange, broadcastChange)
  }

  private setArShape(arShapes: ARShape[]) {
    let shapeArrays = []
    for(let idx=0; idx<arShapes.length; idx++){
      let sa = arShapes[idx].geoLocation.coordinates
      sa = this.arService.swapCoords(sa)
      shapeArrays.push(sa)
      console.log(sa.length)
    }

    const shapeFeatureGroup = this.mapService.convertArrayToFeatureGroup(shapeArrays)
    shapeFeatureGroup.eachLayer( layer => {
      const polygon = layer
      this.mapService.popupWindowCreation(polygon, this.mapService.drawnItems)
    })
    const broadcastChange = true
    const toggleThreeDayOff = true
    //this.queryService.sendShape(shapeArrays, broadcastChange, toggleThreeDayOff)
  }
}
