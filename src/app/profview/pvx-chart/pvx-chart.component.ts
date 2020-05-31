import { Component, OnInit, Input, Output } from '@angular/core';
import { BgcProfileData, CoreProfileData, StationParameters, ColorScaleSelection } from './../profiles'
import { GetProfilesService } from './../get-profiles.service'
import { ChartService } from './../chart.service'
import { QueryProfviewService } from '../query-profview.service';


@Component({
  selector: 'app-pvx-chart',
  templateUrl: './pvx-chart.component.html',
  styleUrls: ['./pvx-chart.component.css']
})
export class PvxChartComponent implements OnInit {
  constructor(private getProfileService: GetProfilesService,
              private chartService: ChartService,
              private queryProfviewService: QueryProfviewService) { }
  private graph: any
  private chartTitle: string
  private platform_number: string
  private measKey: string
  private profileData: BgcProfileData[] |  CoreProfileData[]
  private statParams: StationParameters[]
  private layout: {}
  private bgcPlatform: boolean
  private statParamKey: string
  private yAxisTitle: string
  private xLabel: string
  @Input() axis: string
  private yLabel: string
  private revision: number = 0
  private readonly reduceMeas = 200

  ngOnInit(): void {
    console.log('initing pvx chart axis: ', this.axis)
    this.queryProfviewService.urlParsed.subscribe( (msg: string) => {
      this.xLabel = 'temp' //to be read in by url otherwise use a default set by chart id
      this.yLabel = 'pres' //to be read in url. otherwise, use a default set by chart id.
      this.statParamKey = this.queryProfviewService.statParamKey
      this.platform_number = this.queryProfviewService.platform_number
      this.measKey = this.queryProfviewService.measKey
      this.bgcPlatform = this.queryProfviewService.bgcPlatform
      console.log('inside init pvx. url parsed')
      this.makeChart()
    }, 
    error => {
      console.error('an error occured when checking if url parsed: ', error)
    })

    this.queryProfviewService.changeStatParams.subscribe( (msg: string) => {
      this.statParams = this.queryProfviewService.statParams
      // this.statParams.push({value:'pres', viewValue: 'pressure'}) //add pres again
    }, 
    error => {
      console.error('an error occured when listening to changeStatParams: ', error)
    })
  }

  // Upon click a new tab opens to the corresponding profile.
  onSelect(points: any): void {
    const xidx = points.pointNumber
    const profile_id = points.data['profile_ids'][xidx]
    const url = '/catalog/profiles/' + profile_id + '/bgcPage'
    window.open(url,'_blank')
  } 

  makeChart(): void {
    this.getProfileService.getPlaformData(this.platform_number, this.yLabel, this.xLabel).subscribe( (profileData: BgcProfileData[] | CoreProfileData[] | any) => {
      console.log('inside makeChart. profile data is had')
      this.profileData = profileData
      this.setChart(this.profileData)
      this.revision += 1;
    },
    error => {
      console.error('an error occured when making chart: ', error)
    })
  }

  setChart(profileData: BgcProfileData[] | CoreProfileData[]) {
    const xParams = this.chartService.getTraceParams(this.xLabel)
    const yParams = this.chartService.getTraceParams(this.yLabel)
    this.layout = this.chartService.makePvxLayout(this.xLabel, this.yLabel)

    const dataArrays = this.chartService.makePvxChartDataArrays(profileData, this.yLabel, this.xLabel, this.measKey, this.reduceMeas, this.statParamKey, this.bgcPlatform)
    const measurements = this.chartService.makePvxChartMeasurements(dataArrays, this.yLabel, this.xLabel, xParams['units'], yParams['units'])
    const trace = this.chartService.makePvxChartTrace(measurements, this.xLabel, this.bgcPlatform)
    console.log('inide setChart, trace:', trace)
    this.graph = { data: trace,
      layout: this.layout,
      updateOnlyWithRevision: true
    }
  }


  yLabelChange(yLabel: string): void {
    this.yLabel = yLabel
    this.graph = false // destroy plotly-plot element and rebuild it entirely. needed for some browsers (ahem, chrome) don't update colorbar.
    this.makeChart()
    this.queryProfviewService.setURL()
  }

  xLabelChange(xLabel: string): void {
    this.xLabel = xLabel
    this.graph = false // destroy plotly-plot element and rebuild it entirely. needed for some browsers (ahem, chrome) don't update colorbar.
    this.makeChart()
    this.queryProfviewService.setURL()
  }

  downloadChartData(): void {
    let url = '/catalog/bgc_platform_data/'
    url += this.platform_number 
    url += '?xaxis=' + this.xLabel
    url += '&yaxis=' + this.yLabel
    window.open(url,'_blank')
  }
}
