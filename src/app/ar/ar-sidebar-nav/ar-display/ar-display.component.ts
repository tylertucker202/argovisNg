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
  private date: moment.Moment;
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
    this.date = this.arQueryService.get_ar_date()
    this.arFormDate = new FormControl( this.date.toDate() )
    this.hour = this.date.hour() 
    this.set_ar_shapes()
    this.arQueryService.resetToStart.subscribe( (msg: string) => {
      this.date = this.arQueryService.get_ar_date()
      this.arFormDate = new FormControl(this.date.toDate())
      this.hour = this.date.hour()
      this.set_ar_shapes()
    })
  }

  dateChanged(): void {
    this.arFormDate = new FormControl(this.date.toDate())
    this.arQueryService.send_ar_date(this.date)
    this.arQueryService.set_url()
    this.set_ar_shapes() //remove if you don't want to fire ar event
  }

  timeChange(hour: number): void {
    this.hour = hour
    this.date.hour(this.hour)
    this.dateChanged()
  }

  calendarDateChanged(calDate: Date): void {
    this.date = moment(calDate).hour(this.hour)
    this.dateChanged()
  }

  public incrementDay(increment: number): void {
    this.date = this.date.add(increment, 'd')
    this.dateChanged()
  }

  public incrementHour(increment: number): void {
    this.date = this.date.add(increment, 'h')
    this.dateChanged()
    this.hour = this.date.hour()
  }

  public set_ar_shapes(): void {
    this.arQueryService.sendThreeDayMsg(false, false)
    this.arQueryService.clear_layers.emit('ar shapes being drawn')
    this.arQueryService.arEvent.emit('ar shapes being drawn')
  }
    

}
