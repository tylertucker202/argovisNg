import { TcTrackService } from './../../tc-track.service';
import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { TcQueryService } from '../../tc-query.service'
import { TcMapService } from './../../tc-map.service'
import { NotifierService } from 'angular-notifier'

import * as moment from 'moment';

export interface DropDownSelection {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-tc-display',
  templateUrl: './tc-display.component.html',
  styleUrls: ['./tc-display.component.css']
})
export class TcDisplayComponent implements OnInit {
  
  constructor(private tcService: TcTrackService,
              private tcQueryService: TcQueryService,
              private arMapService: TcMapService,
              private notifierService: NotifierService ) { this.notifier = notifierService }
  private startDate: moment.Moment;
  private endDate: moment.Moment;
  private readonly notifier: NotifierService
  public formStartDate: FormControl
  public formEndDate: FormControl
  
  public startHour: number
  public endHour: number
  public MIN_DATE = new Date(2004, 0, 1, 0, 0, 0, 0)
  public MAX_DATE = new Date()
  public hours: DropDownSelection[] = [
    {value: 0, viewValue: '0:00'},
    {value: 6, viewValue: '6:00'},
    {value: 12, viewValue: '12:00'},
    {value: 18, viewValue: '18:00'},
  ];

  private reset_dates(): void {
    [this.startDate, this.endDate] = this.tcQueryService.get_tc_date_range()
    this.formStartDate = new FormControl( this.startDate.toDate() )
    this.formEndDate = new FormControl( this.endDate.toDate() )
    this.startHour = this.startDate.hour() 
    this.endHour = this.endDate.hour() 
  }

  ngOnInit() { 
    this.reset_dates()
    this.set_tc_tracks()
    this.tcQueryService.resetToStart.subscribe( (msg: string) => {
      this.reset_dates()
      this.set_tc_tracks()
    })
  }

  date_changed(startBool: Boolean): void {
    if (startBool) {
      this.tcQueryService.send_tc_start_date(this.startDate)
      this.formStartDate = new FormControl(this.startDate.toDate())
    }
    else {
      this.tcQueryService.send_tc_end_date(this.endDate)
      this.formEndDate = new FormControl(this.endDate.toDate())
    }
    this.tcQueryService.set_url()
    this.set_tc_tracks() //remove if you don't want to fire ar event
  }

  timeChange(hour: number, startBool: Boolean): void {
    if (startBool) {
      this.startHour = hour
      this.startDate.hour(this.startHour)
    }
    else {
      this.endHour = hour
      this.endDate.hour(this.endHour)
    }
    this.date_changed(startBool)
  }

  calendar_date_changed(calDate: Date, startBool: Boolean): void {
    if (startBool) {
      this.startDate = moment(calDate).hour(this.startHour)
    }
    else {
      this.endDate = moment(calDate).hour(this.endHour)
    }
    this.date_changed(startBool)
  }

  public incrementDay(increment: number, startBool: Boolean): void {
    if (startBool) {
      this.startDate = this.startDate.add(increment, 'd')
    }
    else {
      this.endDate = this.endDate.add(increment, 'd')
    }
    this.date_changed(startBool)
  }

  public incrementHour(increment: number, startBool: Boolean): void {
    if (startBool) {
      this.startDate = this.startDate.add(increment, 'h')
      this.startHour = this.startDate.hour()
    }
    else {
      this.endDate = this.endDate.add(increment, 'h')
      this.endHour = this.endDate.hour()
    }
    this.date_changed(startBool)
  }

  public set_tc_tracks(): void {
    this.tcQueryService.send_three_day_msg(false, false)
    // this.tcQueryService.clear_layers.emit('tc shapes being drawn')
    // this.tcQueryService.tcEvent.emit('tc shapes being drawn')
  }
    

}
