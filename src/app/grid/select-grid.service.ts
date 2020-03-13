import { Injectable } from '@angular/core';
import { GridGroup, ProducerGroup, MeasGroup, GridParamGroup, AvailableParams, ModelParam } from './../../typeings/grids'

@Injectable({
  providedIn: 'root'
})
export class SelectGridService {

  private readonly ksGrids: GridGroup[] = [
    // {grid: 'ksSpaceTempNoTrend', param: 'anomaly', viewValue: 'Space No Trend Anomaly'  },
    // {grid: 'ksSpaceTempTrend' , param: 'anomaly', viewValue: 'Space Trend Anomaly'  },
    // {grid: 'ksSpaceTempTrend2', param: 'anomaly', viewValue: 'Space Trend2 Anomaly'  },
    // {grid: 'ksSpaceTimeTempNoTrend', param: 'anomaly',viewValue: 'Space Time No Trend Anomaly'  },
    // {grid: 'ksSpaceTimeTempTrend', param: 'anomaly', viewValue: 'Space Time Trend Anomaly'  },
    // {grid: 'ksSpaceTimeTempTrend2', param: 'anomaly', viewValue: 'Space Time Trend2 Anomaly'  },
    // {grid: 'ksTempTrend', param: 'mean',viewValue: 'Trend Mean Field'  },
    // {grid: 'ksTempNoTrend', param: 'mean',viewValue: 'No Trend Mean Field'  },
    // {grid: 'ksTempTrend2', param: 'mean',viewValue: 'Trend 2 Mean Field'  },
    {grid: 'ksSpaceTempNoTrendTotal', param: 'total', viewValue: 'Space No Trend Total'  },
    {grid: 'ksSpaceTempTrendTotal', param: 'total', viewValue: 'Space Trend Total'  },
    {grid: 'ksSpaceTempTrend2Total', param: 'total', viewValue: 'Space Trend2 Total'  },
    {grid: 'ksSpaceTimeTempTrendTotal', param: 'total', viewValue: 'Space Time Trend Total'  },
    {grid: 'ksSpaceTimeTempTrend2Total', param: 'total', viewValue: 'Space Time Trend2 Total'  },
  ]

  private readonly rgGrids: GridGroup[] = [
    {grid: 'rgTempAnom', param: 'anomaly', viewValue: 'RG Anomaly'},
    {grid: 'rgTempTotal', param: 'total', viewValue: 'RG Total'}
  ]

  private readonly allAvailableGrids = this.rgGrids.concat(this.ksGrids)

  private readonly ksGridGroup: ProducerGroup = {producer: 'Kuusela-Stein', grids: this.ksGrids}
  private readonly rgGridGroup: ProducerGroup = {producer: 'Rommich-Gilson', grids: this.rgGrids}
  private readonly tempGridGroup: MeasGroup = {meas:'Temperature', producers: [this.rgGridGroup, this.ksGridGroup]}
  public readonly allGrids = [this.tempGridGroup]
  private readonly spaceTimeParams: ModelParam[]  = [{modelParamName: 'nResGrid', viewValue: 'N Profiles'},
                                                      {modelParamName: 'nll', viewValue: 'Neg log liklihood'},
                                                      {modelParamName: 'thetaLatOpt', viewValue: 'Lat weight'},
                                                      {modelParamName: 'thetaLongOpt', viewValue: 'Lon weight'},
                                                      {modelParamName: 'thetasOpt', viewValue: 'spread weight'},
                                                      {modelParamName: 'thetatOpt', viewValue: 'time weight'},
                                                    ]
  private readonly spaceParams: ModelParam[]  = [{modelParamName: 'nResGrid', viewValue: 'N Profiles'},
                                                {modelParamName: 'nll', viewValue: 'Neg log liklihood'},
                                                {modelParamName: 'sigmaOpt', viewValue: 'spread weight'},
                                                {modelParamName: 'theta1Opt', viewValue: 'first weight'},
                                                {modelParamName: 'theta2Opt', viewValue: 'second weight'},
                                                  ]
  public readonly ksParams: GridParamGroup[] = [
    {grid: 'ksSpaceTempNoTrend', param: 'param', viewValue: 'Space No Trend Anomaly', params: this.spaceParams  },
    {grid: 'ksSpaceTempTrend', param: 'param', viewValue: 'Space Trend Anomaly', params: this.spaceParams   },
    {grid: 'ksSpaceTempTrend2', param: 'param',viewValue: 'Space Trend2 Anomaly', params: this.spaceParams   },
    {grid: 'ksSpaceTimeTempNoTrend', param: 'param',viewValue: 'Space Time No Trend Anomaly', params: this.spaceTimeParams   },
    {grid: 'ksSpaceTimeTempTrend', param: 'param',viewValue: 'Space Time Trend Anomaly', params: this.spaceTimeParams   },
    {grid: 'ksSpaceTimeTempTrend2', param: 'param',viewValue: 'Space Time Trend2 Anomaly', params: this.spaceTimeParams   },
  ]
  private readonly ksParamGroup: ProducerGroup = {producer: 'Kuusela-Stein', grids: this.ksParams}
  private readonly tempParamGroup: MeasGroup = {meas: 'Temperature', producers: [this.ksParamGroup]}
  public readonly allGridParams: MeasGroup[] =  [this.tempParamGroup]
  public readonly params = [{param:'total', viewValue: 'Total (mean+anomaly)'},
                            {param:'anomaly', viewValue: 'Anomaly'},
                            //{param:'mean', viewValue: 'Mean'}
                          ] as AvailableParams[]

  public getAvailableGrids(param: string): GridGroup[] {
    //select grids that have the following params: 'anomaly', 'mean', 'total'
    let availableGrids = []
    for (let idx=0; idx < this.allAvailableGrids.length; idx++) {
      const grid = this.allAvailableGrids[idx]
      if (grid['param'] == param) {
        availableGrids.push(grid)
      }
    }
    return availableGrids
  }

  public checkIfGridAvailable(grid: string, param: string): boolean {
    let obj = this.allAvailableGrids.find(g => (g.grid === grid) && (g.param === param));
    let gridAvailable
    obj ? gridAvailable = true: gridAvailable = false
    console.log('grid: ', grid, 'param: ', param , 'obj: ', obj, 'gridAvailable: ', gridAvailable)
    return gridAvailable
  }

  public swtichGridOnParamChange(param: string): void{

  }

  constructor() { }
}
