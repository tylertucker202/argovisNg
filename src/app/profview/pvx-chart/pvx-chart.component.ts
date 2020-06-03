import { Component, OnInit, Input, Output } from '@angular/core';
import { BgcProfileData, CoreProfileData, StationParameters, ColorScaleSelection } from './../profiles'
import { GetProfilesService } from './../get-profiles.service'
import { ChartService } from './../chart.service'
import { QueryProfviewService, ChartItems } from '../query-profview.service';


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
  private chartLabels: ChartItems
  @Input() id: string
  private revision: number = 0
  private readonly reduceMeas = 200

  ngOnInit(): void {
    this.queryProfviewService.urlParsed.subscribe( (msg: string) => {
      this.chartLabels = this.queryProfviewService.value_of_chart_labels(this.id) 
      this.statParamKey = this.queryProfviewService.statParamKey
      this.platform_number = this.queryProfviewService.platform_number
      this.measKey = this.queryProfviewService.measKey
      this.bgcPlatform = this.queryProfviewService.bgcPlatform
      this.makeChart()
    }, 
    error => {
      console.error('an error occured when checking if url parsed: ', error)
    })

    this.queryProfviewService.changeStatParams.subscribe( (msg: string) => {
      this.statParams = this.queryProfviewService.statParams
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
    this.getProfileService.getPlaformData(this.platform_number, this.chartLabels.x2, this.chartLabels.x1).subscribe( (profileData: BgcProfileData[] | CoreProfileData[] | any) => {
      this.profileData = profileData
      this.setChart(this.profileData)
      this.revision += 1;
    },
    error => {
      console.error('an error occured when making chart: ', error)
    })
  }

  setChart(profileData: BgcProfileData[] | CoreProfileData[]) {
    const xParams = this.chartService.getTraceParams(this.chartLabels.x1)
    const yParams = this.chartService.getTraceParams(this.chartLabels.x2)
    this.layout = this.chartService.makePvxLayout(this.chartLabels.x1, this.chartLabels.x2)

    const dataArrays = this.chartService.makePvxChartDataArrays(profileData, this.chartLabels.x2, this.chartLabels.x1, this.measKey, this.reduceMeas, this.statParamKey, this.bgcPlatform)
    const trace = this.chartService.makePvxChartTrace(dataArrays, this.chartLabels.x1, this.bgcPlatform, xParams['units'], yParams['units'])
    this.graph = { data: trace,
      layout: this.layout,
      updateOnlyWithRevision: true
    }
  }


  yLabelChange(yLabel: string): void {
    this.chartLabels.x2 = yLabel
    this.graph = false // destroy plotly-plot element and rebuild it entirely. needed for some browsers (ahem, chrome) don't update colorbar.
    this.makeChart()
    this.queryProfviewService.set_chart_labels(this.id, this.chartLabels)
    this.queryProfviewService.setURL()
  }

  xLabelChange(xLabel: string): void {
    this.chartLabels.x1 = xLabel
    this.graph = false // destroy plotly-plot element and rebuild it entirely. needed for some browsers (ahem, chrome) don't update colorbar.
    this.makeChart()
    this.queryProfviewService.set_chart_labels(this.id, this.chartLabels)
    this.queryProfviewService.setURL()
  }

  downloadChartData(): void {
    let url = '/catalog/bgc_platform_data/'
    url += this.platform_number 
    url += '?xaxis=' + this.chartLabels.x1
    url += '&yaxis=' + this.chartLabels.x2
    window.open(url,'_blank')
  }
}
