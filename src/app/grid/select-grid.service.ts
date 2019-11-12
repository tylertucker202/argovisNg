import { Injectable } from '@angular/core';
import { GridGroup, ProducerGroup, MeasGroup, GridParamGroup } from './../../typeings/grids'

@Injectable({
  providedIn: 'root'
})
export class SelectGridService {

  private ksGrids: GridGroup[] = [
    {grid: 'ksSpaceTempNoTrend', param: 'anomaly', viewValue: 'Space No Trend Anomaly'  },
    {grid: 'ksSpaceTempTrend' , param: 'anomaly', viewValue: 'Space Trend Anomaly'  },
    {grid: 'ksSpaceTempTrendJG' , param: 'anomaly',  viewValue: 'JG Space Trend Anomaly'},
    {grid: 'ksSpaceTempTrend2', param: 'anomaly', viewValue: 'Space Trend2 Anomaly'  },
    //{grid: 'ksSpaceTimeTempNoTrend', param: 'anomaly',viewValue: 'Space Time No Trend Anomaly'  },
    {grid: 'ksSpaceTimeTempTrend', param: 'anomaly', viewValue: 'Space Time Trend Anomaly'  },
    {grid: 'ksSpaceTimeTempTrend2', param: 'anomaly', viewValue: 'Space Time Trend2 Anomaly'  },
    {grid: 'ksTempTrend', param: 'mean',viewValue: 'Trend Mean Field'  },
    {grid: 'ksTempTrendJG', param: 'mean',viewValue: 'JG Trend Mean Field'  },
    {grid: 'ksTempNoTrend', param: 'mean',viewValue: 'No Trend Mean Field'  },
    {grid: 'ksTempTrend2', param: 'mean',viewValue: 'Trend 2 Mean Field'  },
    {grid: 'ksSpaceTempNoTrendTotal', param: 'total', viewValue: 'Space No Trend Total'  },
    {grid: 'ksSpaceTempTrendTotal', param: 'total', viewValue: 'Space Trend Total'  },
    {grid: 'ksSpaceTempTrendJGTotal', param: 'total', viewValue: 'JG Space Trend Total'  },
    {grid: 'ksSpaceTempTrend2Total', param: 'total', viewValue: 'Space Trend2 Total'  },
    {grid: 'ksSpaceTimeTempTrendTotal', param: 'total', viewValue: 'Space Time Trend Total'  },
    {grid: 'ksSpaceTimeTempTrend2Total', param: 'total', viewValue: 'Space Time Trend2 Total'  },
  
  ]
  private rgGrids: GridGroup[] = [
    {grid: 'rgTempAnom', param: 'anomaly', viewValue: 'Anomaly'}
  ]

  private allAvailableGrids = this.rgGrids.concat(this.ksGrids)

  private ksGridGroup: ProducerGroup = {producer: 'Kuusela-Stein', grids: this.ksGrids}
  private rgGridGroup: ProducerGroup = {producer: 'Rommich-Gilson', grids: this.rgGrids}
  private tempGridGroup: MeasGroup = {meas:'Temperature', producers: [this.rgGridGroup, this.ksGridGroup]}
  public allGrids = [this.tempGridGroup]
  private spaceTimeParams  = ['nResGrid', 'nll', 'sigmaOpt', 'thetaLatOpt', 'thetaLongOpt', 'thetasOpt', 'thetatOpt']
  private spaceParams = ['aOpt', 'nResGrid', 'nll', 'sigmaOpt', 'theta1Opt', 'theta2Opt']
  private ksParams: GridParamGroup[] = [
    {grid: 'ksSpaceTempNoTrend', param: 'param', viewValue: 'Space No Trend Anomaly', params: this.spaceParams  },
    {grid: 'ksSpaceTempTrend', param: 'param', viewValue: 'Space Trend Anomaly', params: this.spaceParams   },
    {grid: 'ksSpaceTempTrendJG', param: 'param',viewValue: 'JG Space Trend Anomaly', params: this.spaceParams   },
    {grid: 'ksSpaceTempTrend2', param: 'param',viewValue: 'Space Trend2 Anomaly', params: this.spaceParams   },
    //{grid: 'ksSpaceTimeTempNoTrend', param: 'param',viewValue: 'Space Time No Trend Anomaly', params: this.spaceTimeParams   },
    {grid: 'ksSpaceTimeTempTrend', param: 'param',viewValue: 'Space Time Trend Anomaly', params: this.spaceTimeParams   },
    {grid: 'ksSpaceTimeTempTrend2', param: 'param',viewValue: 'Space Time Trend2 Anomaly', params: this.spaceTimeParams   },
  ]
  private ksParamGroup: any = {producer: 'Kuusela-Stein', grids: this.ksParams}
  private tempParamGroup: any = {meas: 'Temperature', producers: [this.ksParamGroup]}
  public allGridParams: any =  [this.tempParamGroup]
  public params = [{param:'total', viewValue: 'Total (mean+anomaly)'},
                   {param:'anomaly', viewValue: 'Anomaly'},
                   {param:'mean', viewValue: 'Mean'}]

  public getAvailableGrids(param: string): GridGroup[] {
    let availableGrids = []
    for (let idx=0; idx < this.allAvailableGrids.length; idx++) {
      const grid = this.allAvailableGrids[idx]
      if (grid['param'] == param) {
        availableGrids.push(grid)
      }
    }
    return availableGrids
  }

  constructor() { }
}
