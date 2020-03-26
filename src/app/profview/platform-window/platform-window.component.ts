import { Component, OnInit } from '@angular/core'
import { ChartService } from './../chart.service'
import { GetProfilesService } from './../get-profiles.service'
import { StationParameters, PlatformMeta } from './../profiles'
import * as moment from 'moment';

@Component({
  selector: 'app-platform-window',
  templateUrl: './platform-window.component.html',
  styleUrls: ['./platform-window.component.css']
})
export class PlatformWindowComponent implements OnInit {

  constructor(private chartService: ChartService, private getProfilesService: GetProfilesService) { }

  private statParams: StationParameters[]
  private platformNumber: string = '5903260'
  private platMeta: PlatformMeta

  ngOnInit(): void {
    this.getProfilesService.getTestPlaformMetaData()
    .subscribe( (platMeta: PlatformMeta[]) => {
      this.platMeta = platMeta[0]
      this.platMeta['most_recent_date'] = moment(platMeta['most_recent_date']).format("dddd, MMMM Do YYYY, h:mm:ss a"); 
      this.platMeta['most_recent_date_added'] = moment(platMeta['most_recent_date_added']).format("dddd, MMMM Do YYYY, h:mm:ss a"); 
    })
    this.chartService.changeStatParams.subscribe( (msg: string) => {
      this.statParams = this.chartService.statParams
      console.log('msg: ', msg, this.statParams)
    })
  }

}
