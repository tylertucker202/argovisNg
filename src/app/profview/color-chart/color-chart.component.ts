import { Component, OnInit, Input, Output } from '@angular/core';
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
  private colorLabel: string
  @Input() axis: string
  private yLabel: string = 'pres'
  private revision: number = 0
  private readonly reduceMeas = 200
  @Output() colorbarDomain: [number, number] = [0, 1]
  @Output() colorscale: [number, string][] = this.chartService.getColorScale('thermal')

  ngOnInit(): void {
    this.queryProfviewService.urlParsed.subscribe( (msg: string) => {
      this.colorLabel = this.queryProfviewService[this.axis] 
      this.statParamKey = this.queryProfviewService.statParamKey
      this.platform_number = this.queryProfviewService.platform_number
      this.measKey = this.queryProfviewService.measKey
      this.bgcPlatform = this.queryProfviewService.bgcPlatform
      this.makeChart()
      const yParams = this.chartService.getTraceParams(this.yLabel)
      this.yAxisTitle = yParams.title
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
    this.getProfileService.getPlaformData(this.platform_number, this.yLabel, this.colorLabel).subscribe( (profileData: BgcProfileData[] | CoreProfileData[] | any) => {
      this.profileData = profileData
      const defaultColorScale = true
      this.setChart(this.profileData, defaultColorScale)
      this.revision += 1;
    },
    error => {
      console.error('an error occured when making chart: ', error)
    })
  }

  setChart(profileData: BgcProfileData[] | CoreProfileData[], defaultColorScale=false, defaultColorbarDomain=true) {
    const colorParams = this.chartService.getTraceParams(this.colorLabel)
    this.layout = this.chartService.makeLayout(this.yAxisTitle)
    this.chartTitle = colorParams.title
    let cmapName = colorParams.cmapName
    if (defaultColorScale) { 
      this.cmapName = colorParams.cmapName 
    }
    else {
      cmapName = this.cmapName
    }
    const dataArrays = this.chartService.makeColorChartDataArrays(profileData, this.yLabel, this.colorLabel, this.measKey, this.reduceMeas, this.statParamKey, this.bgcPlatform)
    const measurements = this.chartService.makeColorChartMeasurements(dataArrays, this.yLabel, this.colorLabel, colorParams.units, cmapName)
    if (defaultColorbarDomain || !this.colorbarDomain){
      this.colorbarDomain = this.getMinMax(dataArrays[this.colorLabel])
    }
    this.colorscale = measurements.colorscale
    // console.log("colorbarDomain:", this.colorbarDomain)
    const trace = this.chartService.makeColorChartTrace(measurements, this.colorLabel, this.bgcPlatform, this.colorbarDomain)

    this.graph = { data: trace,
      layout: this.layout,
      updateOnlyWithRevision: true
    }
  }

  getMinMax(darray: number[], round=1): [number, number] {
    let min = Math.min(...darray)
    let max = Math.max(...darray)

    min = parseFloat(Number(min).toFixed(round))
    max = parseFloat(Number(max).toFixed(round))
    return [min, max]
  }

  cLabelChange(colorLabel: string): void {
    this.colorLabel = colorLabel
    this.queryProfviewService[this.axis] = this.colorLabel
    this.graph = false // destroy plotly-plot element and rebuild it entirely. needed for some browsers (ahem, chrome) don't update colorbar.
    this.makeChart()
    this.queryProfviewService.setURL()
  }

  colorscaleChange(cmapName: string): void {
    this.cmapName = cmapName
    const defaultColorScale = false
    const defaultColorbarDomain = false
    this.setChart(this.profileData, defaultColorScale, defaultColorbarDomain)
    this.revision += 1;
  }

  updateDomain(domain: [number, number]): void {
    this.colorbarDomain = domain
    const defaultColorScale = false
    const defaultColorbarDomain = false
    this.setChart(this.profileData, defaultColorScale, defaultColorbarDomain)
    this.revision += 1
  }

  downloadChartData(): void {
    let url = '/catalog/bgc_platform_data/'
    url += this.platform_number 
    url += '?yaxis=' + this.yLabel
    url += '&xaxis=' + this.colorLabel
    window.open(url,'_blank')
  }
  
  resetColorbarScale(): void {
    const defaultColorScale = true
    const defaultColorbarDomain = true
    this.setChart(this.profileData, defaultColorScale, defaultColorbarDomain)
    this.revision += 1
  }
}
