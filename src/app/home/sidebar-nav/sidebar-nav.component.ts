import { Component, OnInit, Input, Injector } from '@angular/core';
import { QueryService } from '../services/query.service'
import {MatDialog} from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import moment from 'moment';

export interface Projections {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-sidebar-nav',
  templateUrl: './sidebar-nav.component.html',
  styleUrls: ['./sidebar-nav.component.css']
})

export class SidebarNavComponent implements OnInit {

  public date = new FormControl(new Date());
  public queryService: QueryService
  public dialog: MatDialog 
  constructor( public injector: Injector ) { 
                                             this.queryService = this.injector.get(QueryService)
                                             this.dialog = this.injector.get(MatDialog)
                                           }

  @Input() public includeRT: boolean
  @Input() public onlyBGC: boolean
  @Input() public onlyDeep: boolean
  @Input() public threeDayToggle: boolean
  @Input() public proj: string
  public platformInput: string
  public projections: Projections[] = [
    {value: 'WM', viewValue: 'Web mercator'},
    {value: 'SSP', viewValue: 'Southern stereo projection'},
    {value: 'NSP', viewValue: 'Northern stereo projection'}
  ];

  ngOnInit() {
    this.setSubscriptions()
  }

  setSubscriptions() {
    this.queryService.urlBuild
    .subscribe(msg => {
      //toggle if states have changed    
      this.includeRT = this.queryService.get_realtime_toggle()
      this.onlyBGC = this.queryService.get_bgc_toggle()
      this.onlyDeep = this.queryService.get_deep_toggle()
      this.threeDayToggle = this.queryService.get_three_day_toggle()
      this.proj = this.queryService.get_proj()

      let displayDate = new Date(this.queryService.get_global_display_date())
      displayDate.setDate(displayDate.getDate())
      displayDate.setMinutes( displayDate.getMinutes() + displayDate.getTimezoneOffset() );
      this.date = new FormControl(displayDate)
    })
  }

  realtime_changed(checked: boolean): void {
    this.includeRT = checked
    this.queryService.send_realtime_msg(this.includeRT);
  }

  display_global_change(checked: boolean): void {
    this.threeDayToggle = checked
    this.queryService.send_three_day_msg(this.threeDayToggle);
  }

  bgc_change(checked: boolean): void {
    this.onlyBGC = checked
    this.queryService.send_bgc_toggle_msg(this.onlyBGC);
  }

  deep_change(checked: boolean): void {
    this.onlyDeep = checked
    this.queryService.send_deep_toggle_msg(this.onlyDeep);
  }

  clear_profiles(): void {
    this.queryService.trigger_clear_layers();
  }

  resetToStart(): void {
    this.queryService.trigger_reset_to_start();
  }

  mapProjChange(proj: string): void {
    this.proj = proj
    this.queryService.send_proj(proj)
  }

  displayPlatformInputChanged(platformInput: string): void {
    this.platformInput = platformInput
    if (platformInput.length >= 5){
       this.queryService.trigger_show_platform(platformInput)
    }
  }

  displayGlobaldate_changed(date: moment.Moment): void {
    this.date = new FormControl(date)
    const dateStr = date.format('YYYY-MM-DD')
    this.queryService.send_global_date(dateStr)
  }

}
