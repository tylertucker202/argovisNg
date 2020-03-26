import { Component, OnInit, Input } from '@angular/core';
import { BgcProfileData, CoreProfileData, StationParameters, ColorScaleSelection } from './../profiles'
import { GetProfilesService } from './../get-profiles.service'
import { ChartService } from './../chart.service'
import { QueryProfviewService } from '../query-profview.service';

@Component({
  selector: 'app-color-chart',
  templateUrl: './color-chart.component.html',
  styleUrls: ['./color-chart.component.css']
})
export class ColorChartComponent implements OnInit {

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
  private colorscaleSelections: ColorScaleSelection[] =  this.chartService.colorscaleSelections
  private cmapName: string
  private yAxisTitle: string
  @Input() colorLabel: string
  private yLabel: string = 'pres'
  private revision: number = 0
  private readonly reduceMeas = 200
  ngOnInit(): void {
    this.statParamKey = this.queryProfviewService.statParamKey
    this.platform_number = this.queryProfviewService.platform_number
    this.measKey = this.queryProfviewService.measKey
    this.bgcPlatform = this.queryProfviewService.bgcPlatform
    this.statParams = this.queryProfviewService.statParams

    this.queryProfviewService.changeStatParams.subscribe( (msg: string) => {
      this.statParams = this.queryProfviewService.statParams
    })
    
    this.makeChart()

    const yParams = this.chartService.getTraceParams(this.yLabel)
    this.yAxisTitle = yParams.title
  }

  // Upon click a new tab opens to the corresponding profile.
  onSelect(points: any): void {
    const xidx = points.pointNumber
    const profile_id = points.data['profile_ids'][xidx]
    const url = '/catalog/profiles/' + profile_id + '/page'
    window.open(url,'_blank')
  } 

  makeChart(): void {
    this.getProfileService.getPlaformData(this.platform_number, this.yLabel, this.colorLabel).subscribe( (profileData: BgcProfileData[] | CoreProfileData[]) => {
      this.profileData = profileData
      this.setChart(this.profileData)
      this.revision += 1;
    })
  }

  setChart(profileData: BgcProfileData[] | CoreProfileData[], defaultColorScale=true) {
    const colorParams = this.chartService.getTraceParams(this.colorLabel)
    this.layout = this.chartService.makeLayout(this.yAxisTitle)
    this.chartTitle = colorParams.title
    let colorscale = colorParams.colorscale
    if (defaultColorScale) { 
      this.cmapName = colorParams.colorscale 
    }
    else {
      colorscale = this.cmapName
    }
    const dataArrays = this.chartService.makeColorChartDataArrays(profileData, this.yLabel, this.colorLabel, this.measKey, this.reduceMeas, this.statParamKey, this.bgcPlatform)
    const measurements = this.chartService.makeColorChartMeasurements(dataArrays, this.yLabel, this.colorLabel, colorParams.units, colorscale)
    const trace = this.chartService.makeColorChartTrace(measurements, this.colorLabel, this.bgcPlatform)

    this.graph = { data: trace,
      layout: this.layout,
      updateOnlyWithRevision: true
    }
  }

  cLabelChange(colorLabel: string): void {
    this.colorLabel = colorLabel
    this.makeChart()
  }

  colorscaleChange(cmapName: string): void {
    this.cmapName = cmapName
    const defaultColorScale = false
    this.setChart(this.profileData, defaultColorScale)
    this.revision += 1;
  }

}
