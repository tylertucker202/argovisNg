import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { ArShapeService } from '../../ar-shape.service'
import { ArQueryService } from '../../ar-query.service'
import { ArMapService } from './../../ar-map.service'
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
  
  constructor(private arService: ArShapeService,
              private arQueryService: ArQueryService,
              private arMapService: ArMapService,
              private notifierService: NotifierService ) { this.notifier = notifierService }
  private arDate: moment.Moment;
  private readonly notifier: NotifierService
  public arFormDate: FormControl
  
  public hour: number
  public MIN_DATE = new Date(2004, 0, 1, 0, 0, 0, 0)
  public MAX_DATE = new Date(2016, 12, 31, 0, 0, 0, 0)
  public hours: DropDownSelection[] = [
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
    this.arDate = this.arQueryService.getArDate()
    this.arFormDate = new FormControl( this.arDate.toDate() )
    this.hour = this.arDate.hour() 
    this.setArShapes()
    this.arQueryService.resetToStart.subscribe( (msg: string) => {
      this.arDate = this.arQueryService.getArDate()
      this.arFormDate = new FormControl(this.arDate.toDate())
      this.hour = this.arDate.hour()
      this.setArShapes()
    })
  }

  dateChanged(): void {
    this.arFormDate = new FormControl(this.arDate.toDate())
    this.arQueryService.sendArDate(this.arDate)
    this.arQueryService.setURL()
    this.setArShapes() //remove if you don't want to fire ar event
  }

  timeChange(hour: number): void {
    this.hour = hour
    this.arDate.hour(this.hour)
    this.dateChanged()
  }

  calendarDateChanged(calDate: Date): void {
    this.arDate = moment(calDate).hour(this.hour)
    this.dateChanged()
  }

  public incrementDay(increment: number): void {
    this.arDate = this.arDate.add(increment, 'd')
    this.dateChanged()
  }

  public incrementHour(increment: number): void {
    this.arDate = this.arDate.add(increment, 'h')
    this.dateChanged()
    this.hour = this.arDate.hour()
  }

  public setArShapes(): void {
    this.arQueryService.sendThreeDayMsg(false, false)
    this.arQueryService.clearLayers.emit('ar shapes being drawn')
    this.arQueryService.arEvent.emit('ar shapes being drawn')
  }
    

}
