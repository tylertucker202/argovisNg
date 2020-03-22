import { Component, OnInit } from '@angular/core';
import { BgcProfileData, CoreProfileData, StationParameters, ColorScaleSelection } from './../profiles'
import { GetProfilesService } from './../get-profiles.service'
import { ChartService } from './../chart.service'

@Component({
  selector: 'app-color-chart',
  templateUrl: './color-chart.component.html',
  styleUrls: ['./color-chart.component.css']
})
export class ColorChartComponent implements OnInit {

  constructor(private getProfileService: GetProfilesService,
              private chartService: ChartService) { }
  private graph: any
  private colorLabel: string = 'temp'
  private yLabel: string = 'pres'
  private platformNumber: string = '5903260'
  private readonly measField: string = 'bgcMeas'
  private readonly reduceMeas = 200
  private profileData: BgcProfileData[] |  CoreProfileData[]
  private statParams: StationParameters[]
  private layout: {}
  private bgcChart: boolean = true
  private revision: number = 0
  private graphComplete: boolean = false
  private statParamKey: string = 'station_parameters'
  private colorscaleSelections: ColorScaleSelection[] =  this.chartService.colorscaleSelections
  private cmapName: string
  ngOnInit(): void {
    if (this.bgcChart) { this.statParamKey = 'bgcMeasKeys'}
    this.makeChart()
  }

  // Upon click a new tab opens to the corresponding profile.
  onSelect(points: any): void {
    const xidx = points.pointNumber
    const profile_id = points.data['profile_ids'][xidx]
    const url = '/catalog/profiles/' + profile_id + '/page'
    //console.log(url)
    window.open(url,'_blank')
  } 

  makeChart(): void {
    this.layout = this.chartService.makeLayout(this.yLabel, this.colorLabel)
    this.getProfileService.getPlaformData(this.platformNumber, this.yLabel, this.colorLabel).subscribe( (profileData: BgcProfileData[] | CoreProfileData[]) => {
      this.profileData = profileData
      this.setChart(this.profileData)
      this.revision += 1;
      this.graphComplete=true
    })
  }

  setChart(profileData: BgcProfileData[] | CoreProfileData[], defaultColorScale=true) {
    const colorParams = this.chartService.getTraceParams(this.colorLabel)
    let colorscale = colorParams.colorscale
    if (defaultColorScale) { 
      this.cmapName = colorParams.colorscale 
    }
    else {
      colorscale = this.cmapName
    }
    console.log('color scale', colorscale)
    const dataArrays = this.chartService.makeColorChartDataArrays(profileData, this.yLabel, this.colorLabel, this.measField, this.reduceMeas, this.statParamKey, this.bgcChart)
    this.statParams = this.chartService.makeUniqueStationParameters(dataArrays['station_parameters'])
    const measurements = this.chartService.makeColorChartMeasurements(dataArrays, this.yLabel, this.colorLabel, colorParams.units, colorscale)
    const trace = this.chartService.makeColorChartTrace(measurements, this.colorLabel, this.bgcChart)

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
    this.graphComplete=true

  }

}
