import { Component, OnInit } from '@angular/core'
import { ChartService } from './../chart.service'
import { GetProfilesService } from './../get-profiles.service'
import { StationParameters, PlatformMeta } from './../profiles'
import { QueryProfviewService } from './../query-profview.service'
import * as moment from 'moment';

@Component({
  selector: 'app-platform-window',
  templateUrl: './platform-window.component.html',
  styleUrls: ['./platform-window.component.css']
})
export class PlatformWindowComponent implements OnInit {

  constructor(private chartService: ChartService, private getProfilesService: GetProfilesService, private queryProfviewService: QueryProfviewService) { }

  public statParams: StationParameters[]
  public statParamsList: string
  public platform_number: string
  public platMeta: PlatformMeta
  public dateFormat: string = "MMM Do YYYY"
  public revision: number = 0

  ngOnInit(): void {
    this.queryProfviewService.urlParsed.subscribe( (msg: string) => {
      this.platform_number = this.queryProfviewService.platform_number

      if (this.revision <= 0 ){
        this.getProfilesService.getPlaformMetaData(this.platform_number)
        .subscribe( (platMeta: PlatformMeta[]) => {
          this.platMeta = platMeta[0]
          this.platMeta['most_recent_date'] = moment(this.platMeta['most_recent_date']).format(this.dateFormat); 
          this.platMeta['most_recent_date_added'] = moment(this.platMeta['most_recent_date_added']).format(this.dateFormat);
          this.platMeta['jcommopsLink'] = this.queryProfviewService.make_jcommops_platform(this.platMeta['platform_number'].toString())
          this.platMeta['fleetMonitoringLink'] = this.queryProfviewService.make_fleet_monitoring_platform(this.platMeta['platform_number'].toString())
        })
      }
      this.revision += 1
    })

    this.queryProfviewService.changeStatParams.subscribe( (msg: string) => {
      this.statParams = this.queryProfviewService.statParams
      let statParamsList = ''
      this.statParams.forEach( (statParam: StationParameters) => {
        statParamsList += ', ' + statParam.value
      })
      this.statParamsList = statParamsList.substring(2)
      this.revision += 1
    })
  }

}
