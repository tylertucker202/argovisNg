import { Injectable } from '@angular/core';
import { BgcProfileData, CoreProfileData, StationParameters, ColorScaleSelection } from './profiles'
import * as moment from 'moment';
import { quickselect } from 'd3';

export interface TraceParam {
  short_name: string
  long_name: string
  units: string
  long_units: string
  title: string
  colorscale: string
  color: string
  wavelength?: string
}
@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() { }
  public readonly cmaps = [{name: 'thermal',
  cmap: [[0.0, 'rgb(3, 35, 51)'],
   [0.1111111111111111, 'rgb(18, 50, 113)'],
   [0.2222222222222222, 'rgb(73, 54, 159)'],
   [0.3333333333333333, 'rgb(115, 73, 146)'],
   [0.4444444444444444, 'rgb(154, 88, 136)'],
   [0.5555555555555556, 'rgb(197, 101, 119)'],
   [0.6666666666666666, 'rgb(234, 120, 87)'],
   [0.7777777777777777, 'rgb(251, 157, 61)'],
   [0.8888888888888888, 'rgb(248, 203, 67)'],
   [1.0, 'rgb(231, 250, 90)']]},
 {name: 'haline',
  cmap: [[0.0, 'rgb(41, 24, 107)'],
   [0.1111111111111111, 'rgb(37, 44, 162)'],
   [0.2222222222222222, 'rgb(12, 83, 147)'],
   [0.3333333333333333, 'rgb(31, 109, 138)'],
   [0.4444444444444444, 'rgb(51, 133, 136)'],
   [0.5555555555555556, 'rgb(67, 159, 132)'],
   [0.6666666666666666, 'rgb(89, 185, 120)'],
   [0.7777777777777777, 'rgb(136, 208, 96)'],
   [0.8888888888888888, 'rgb(202, 222, 104)'],
   [1.0, 'rgb(253, 238, 153)']]},
 {name: 'solar',
  cmap: [[0.0, 'rgb(51, 19, 23)'],
   [0.1111111111111111, 'rgb(86, 30, 34)'],
   [0.2222222222222222, 'rgb(120, 40, 35)'],
   [0.3333333333333333, 'rgb(151, 59, 27)'],
   [0.4444444444444444, 'rgb(172, 85, 20)'],
   [0.5555555555555556, 'rgb(190, 115, 19)'],
   [0.6666666666666666, 'rgb(203, 146, 25)'],
   [0.7777777777777777, 'rgb(214, 180, 39)'],
   [0.8888888888888888, 'rgb(221, 215, 56)'],
   [1.0, 'rgb(224, 253, 74)']]},
 {name: 'ice',
  cmap: [[0.0, 'rgb(3, 5, 18)'],
   [0.1111111111111111, 'rgb(29, 29, 59)'],
   [0.2222222222222222, 'rgb(51, 50, 103)'],
   [0.3333333333333333, 'rgb(62, 75, 150)'],
   [0.4444444444444444, 'rgb(62, 106, 176)'],
   [0.5555555555555556, 'rgb(74, 137, 188)'],
   [0.6666666666666666, 'rgb(97, 167, 199)'],
   [0.7777777777777777, 'rgb(132, 198, 211)'],
   [0.8888888888888888, 'rgb(182, 224, 228)'],
   [1.0, 'rgb(234, 252, 253)']]},
 {name: 'gray',
  cmap: [[0.0, 'rgb(0, 0, 0)'],
   [0.1111111111111111, 'rgb(21, 21, 21)'],
   [0.2222222222222222, 'rgb(48, 47, 47)'],
   [0.3333333333333333, 'rgb(74, 73, 73)'],
   [0.4444444444444444, 'rgb(99, 99, 98)'],
   [0.5555555555555556, 'rgb(126, 126, 125)'],
   [0.6666666666666666, 'rgb(154, 154, 153)'],
   [0.7777777777777777, 'rgb(185, 185, 184)'],
   [0.8888888888888888, 'rgb(218, 218, 217)'],
   [1.0, 'rgb(254, 254, 253)']]},
 {name: 'oxy', 
  cmap: [[0.0, 'rgb(63, 5, 5)'],
  [0.1111111111111111, 'rgb(111, 5, 15)'],
  [0.2222222222222222, 'rgb(84, 83, 83)'],
  [0.3333333333333333, 'rgb(111, 110, 110)'],
  [0.4444444444444444, 'rgb(139, 138, 137)'],
  [0.5555555555555556, 'rgb(170, 170, 169)'],
  [0.6666666666666666, 'rgb(202, 202, 201)'],
  [0.7777777777777777, 'rgb(239, 238, 237)'],
  [0.8888888888888888, 'rgb(232, 220, 47)'],
  [1.0, 'rgb(220, 174, 25)']]},
 {name: 'deep',
  cmap: [[0.0, 'rgb(253, 253, 204)'],
   [0.1111111111111111, 'rgb(195, 232, 175)'],
   [0.2222222222222222, 'rgb(135, 212, 163)'],
   [0.3333333333333333, 'rgb(92, 185, 163)'],
   [0.4444444444444444, 'rgb(77, 156, 160)'],
   [0.5555555555555556, 'rgb(67, 128, 154)'],
   [0.6666666666666666, 'rgb(61, 99, 148)'],
   [0.7777777777777777, 'rgb(65, 69, 130)'],
   [0.8888888888888888, 'rgb(57, 46, 85)'],
   [1.0, 'rgb(39, 26, 44)']]},
 {name: 'dense',
  cmap: [[0.0, 'rgb(230, 240, 240)'],
   [0.1111111111111111, 'rgb(183, 217, 228)'],
   [0.2222222222222222, 'rgb(143, 192, 226)'],
   [0.3333333333333333, 'rgb(118, 163, 228)'],
   [0.4444444444444444, 'rgb(116, 131, 223)'],
   [0.5555555555555556, 'rgb(121, 96, 199)'],
   [0.6666666666666666, 'rgb(118, 66, 164)'],
   [0.7777777777777777, 'rgb(106, 39, 120)'],
   [0.8888888888888888, 'rgb(85, 22, 74)'],
   [1.0, 'rgb(54, 14, 36)']]},
 {name: 'algae',
  cmap: [[0.0, 'rgb(214, 249, 207)'],
   [0.1111111111111111, 'rgb(179, 224, 167)'],
   [0.2222222222222222, 'rgb(143, 201, 131)'],
   [0.3333333333333333, 'rgb(100, 180, 98)'],
   [0.4444444444444444, 'rgb(43, 160, 81)'],
   [0.5555555555555556, 'rgb(6, 135, 77)'],
   [0.6666666666666666, 'rgb(17, 110, 68)'],
   [0.7777777777777777, 'rgb(25, 84, 55)'],
   [0.8888888888888888, 'rgb(24, 60, 38)'],
   [1.0, 'rgb(17, 36, 20)']]},
 {name: 'matter',
  cmap: [[0.0, 'rgb(253, 237, 176)'],
   [0.1111111111111111, 'rgb(249, 198, 139)'],
   [0.2222222222222222, 'rgb(244, 159, 109)'],
   [0.3333333333333333, 'rgb(234, 120, 88)'],
   [0.4444444444444444, 'rgb(218, 83, 82)'],
   [0.5555555555555556, 'rgb(191, 54, 91)'],
   [0.6666666666666666, 'rgb(158, 35, 98)'],
   [0.7777777777777777, 'rgb(120, 26, 97)'],
   [0.8888888888888888, 'rgb(83, 22, 84)'],
   [1.0, 'rgb(47, 15, 61)']]},
 {name: 'turbid',
  cmap: [[0.0, 'rgb(232, 245, 171)'],
   [0.1111111111111111, 'rgb(217, 213, 130)'],
   [0.2222222222222222, 'rgb(205, 182, 96)'],
   [0.3333333333333333, 'rgb(191, 151, 71)'],
   [0.4444444444444444, 'rgb(173, 124, 60)'],
   [0.5555555555555556, 'rgb(148, 101, 58)'],
   [0.6666666666666666, 'rgb(121, 82, 55)'],
   [0.7777777777777777, 'rgb(90, 65, 49)'],
   [0.8888888888888888, 'rgb(62, 48, 39)'],
   [1.0, 'rgb(34, 30, 27)']]},
 {name: 'speed',
  cmap: [[0.0, 'rgb(254, 252, 205)'],
   [0.1111111111111111, 'rgb(235, 220, 145)'],
   [0.2222222222222222, 'rgb(211, 192, 84)'],
   [0.3333333333333333, 'rgb(170, 171, 32)'],
   [0.4444444444444444, 'rgb(122, 155, 5)'],
   [0.5555555555555556, 'rgb(69, 136, 23)'],
   [0.6666666666666666, 'rgb(24, 114, 39)'],
   [0.7777777777777777, 'rgb(13, 88, 44)'],
   [0.8888888888888888, 'rgb(24, 61, 36)'],
   [1.0, 'rgb(23, 35, 18)']]},
 {name: 'amp',
  cmap: [[0.0, 'rgb(241, 236, 236)'],
   [0.1111111111111111, 'rgb(228, 203, 196)'],
   [0.2222222222222222, 'rgb(217, 171, 156)'],
   [0.3333333333333333, 'rgb(207, 138, 114)'],
   [0.4444444444444444, 'rgb(197, 106, 77)'],
   [0.5555555555555556, 'rgb(185, 70, 44)'],
   [0.6666666666666666, 'rgb(166, 34, 36)'],
   [0.7777777777777777, 'rgb(133, 14, 41)'],
   [0.8888888888888888, 'rgb(96, 14, 33)'],
   [1.0, 'rgb(60, 9, 17)']]},
 {name: 'tempo',
  cmap: [[0.0, 'rgb(254, 245, 244)'],
   [0.1111111111111111, 'rgb(215, 220, 203)'],
   [0.2222222222222222, 'rgb(174, 198, 169)'],
   [0.3333333333333333, 'rgb(125, 178, 143)'],
   [0.4444444444444444, 'rgb(71, 159, 130)'],
   [0.5555555555555556, 'rgb(22, 135, 124)'],
   [0.6666666666666666, 'rgb(20, 109, 114)'],
   [0.7777777777777777, 'rgb(27, 81, 99)'],
   [0.8888888888888888, 'rgb(26, 56, 83)'],
   [1.0, 'rgb(20, 29, 67)']]},
 {name: 'rain',
  cmap: [[0.0, 'rgb(238, 237, 242)'],
   [0.1111111111111111, 'rgb(220, 207, 195)'],
   [0.2222222222222222, 'rgb(194, 183, 145)'],
   [0.3333333333333333, 'rgb(145, 167, 125)'],
   [0.4444444444444444, 'rgb(93, 151, 112)'],
   [0.5555555555555556, 'rgb(30, 131, 110)'],
   [0.6666666666666666, 'rgb(3, 107, 108)'],
   [0.7777777777777777, 'rgb(26, 80, 98)'],
   [0.8888888888888888, 'rgb(37, 53, 77)'],
   [1.0, 'rgb(33, 26, 56)']]},
 {name: 'phase',
  cmap: [[0.0, 'rgb(167, 119, 12)'],
   [0.1111111111111111, 'rgb(202, 90, 59)'],
   [0.2222222222222222, 'rgb(221, 52, 123)'],
   [0.3333333333333333, 'rgb(207, 47, 208)'],
   [0.4444444444444444, 'rgb(160, 93, 243)'],
   [0.5555555555555556, 'rgb(87, 130, 223)'],
   [0.6666666666666666, 'rgb(30, 147, 167)'],
   [0.7777777777777777, 'rgb(15, 153, 107)'],
   [0.8888888888888888, 'rgb(104, 145, 25)'],
   [1.0, 'rgb(167, 119, 12)']]},
 {name: 'topo',
  cmap: [[0.0, 'rgb(39, 26, 44)'],
   [0.1111111111111111, 'rgb(65, 69, 130)'],
   [0.2222222222222222, 'rgb(67, 127, 154)'],
   [0.3333333333333333, 'rgb(92, 185, 163)'],
   [0.4444444444444444, 'rgb(193, 232, 174)'],
   [0.5555555555555556, 'rgb(25, 61, 27)'],
   [0.6666666666666666, 'rgb(86, 101, 52)'],
   [0.7777777777777777, 'rgb(164, 138, 63)'],
   [0.8888888888888888, 'rgb(213, 188, 128)'],
   [1.0, 'rgb(248, 253, 228)']]},
 {name: 'balance',
  cmap: [[0.0, 'rgb(23, 28, 66)'],
   [0.1111111111111111, 'rgb(40, 65, 161)'],
   [0.2222222222222222, 'rgb(35, 121, 186)'],
   [0.3333333333333333, 'rgb(116, 169, 189)'],
   [0.4444444444444444, 'rgb(202, 211, 215)'],
   [0.5555555555555556, 'rgb(227, 203, 195)'],
   [0.6666666666666666, 'rgb(208, 138, 115)'],
   [0.7777777777777777, 'rgb(184, 69, 44)'],
   [0.8888888888888888, 'rgb(133, 14, 41)'],
   [1.0, 'rgb(60, 9, 17)']]},
 {name: 'delta',
  cmap: [[0.0, 'rgb(16, 31, 63)'],
   [0.1111111111111111, 'rgb(31, 72, 154)'],
   [0.2222222222222222, 'rgb(40, 129, 165)'],
   [0.3333333333333333, 'rgb(108, 181, 179)'],
   [0.4444444444444444, 'rgb(208, 224, 213)'],
   [0.5555555555555556, 'rgb(235, 219, 143)'],
   [0.6666666666666666, 'rgb(170, 172, 32)'],
   [0.7777777777777777, 'rgb(68, 135, 23)'],
   [0.8888888888888888, 'rgb(13, 88, 44)'],
   [1.0, 'rgb(23, 35, 18)']]},
 {name: 'curl',
  cmap: [[0.0, 'rgb(20, 29, 67)'],
   [0.1111111111111111, 'rgb(27, 82, 99)'],
   [0.2222222222222222, 'rgb(21, 134, 124)'],
   [0.3333333333333333, 'rgb(126, 178, 143)'],
   [0.4444444444444444, 'rgb(214, 220, 203)'],
   [0.5555555555555556, 'rgb(238, 210, 196)'],
   [0.6666666666666666, 'rgb(219, 140, 119)'],
   [0.7777777777777777, 'rgb(183, 73, 95)'],
   [0.8888888888888888, 'rgb(124, 27, 94)'],
   [1.0, 'rgb(51, 13, 53)']]},
 {name: 'diff',
  cmap: [[0.0, 'rgb(7, 34, 63)'],
   [0.1111111111111111, 'rgb(40, 81, 109)'],
   [0.2222222222222222, 'rgb(99, 124, 141)'],
   [0.3333333333333333, 'rgb(160, 171, 180)'],
   [0.4444444444444444, 'rgb(223, 223, 225)'],
   [0.5555555555555556, 'rgb(226, 220, 212)'],
   [0.6666666666666666, 'rgb(176, 166, 142)'],
   [0.7777777777777777, 'rgb(129, 116, 75)'],
   [0.8888888888888888, 'rgb(80, 75, 30)'],
   [1.0, 'rgb(28, 34, 6)']]},
 {name: 'tarn',
  cmap: [[0.0, 'rgb(22, 35, 13)'],
   [0.1111111111111111, 'rgb(68, 80, 16)'],
   [0.2222222222222222, 'rgb(145, 110, 41)'],
   [0.3333333333333333, 'rgb(211, 151, 103)'],
   [0.4444444444444444, 'rgb(238, 217, 201)'],
   [0.5555555555555556, 'rgb(231, 223, 201)'],
   [0.6666666666666666, 'rgb(150, 177, 152)'],
   [0.7777777777777777, 'rgb(61, 134, 128)'],
   [0.8888888888888888, 'rgb(23, 84, 108)'],
   [1.0, 'rgb(15, 30, 79)']]}]


  public colorscaleSelections: ColorScaleSelection[] = this.makeColorScaleSelections()
  

  public makeLayout(yLabel: string, colorLabel: string) {

    const cParams = this.getTraceParams(colorLabel)
    const yParams = this.getTraceParams(yLabel)
    const layout = {
      title: cParams.title,  
      height: 300, 
      width: 1000,
      yaxis: {
          showticklabels: true,
          autorange: 'reversed', //scattergl currently does not show tick labels when axis is reversed
          type: "linear", 
          title: yParams.title
      },
      xaxis: {
          autorange: true, 
          type: "date", 
          title: "Date"
      }, 
      hovermode: "closest", 
      showlegend: true,
    }
    return layout
  }

  makeColorChartText(pres: number, date: Date, text: string, value: number, units: string, cycle: number, qc?: number) {
    let box = "<br>" + text + value.toString() + " " + units
    + "<br>date: " + date.toString()
    + "<br>pressure: " + pres.toString() + " dbar"
    + "<br>cycle: " + cycle.toString()
    if (qc) { box += "<br>qc: " + qc }
    box += "<br>click to see profile page"

    return(box)
  }

  makeUniqueStationParameters(strArray: string[]): StationParameters[] {
    const s = new Set();
    const uStatParam = [];
    strArray.forEach(el => {
      if(!s.has(el)) {
        s.add(el);
        uStatParam.push(el)
      }
    })
    let statParams = []
    uStatParam.forEach( (statParam: string) => {
      statParams.push({value: statParam, viewValue: statParam})
    })

    // remove pres from list
    statParams = statParams.filter(e => e.value !== 'pres')
    return statParams
  }

  makeColorScaleSelections(): ColorScaleSelection[] {
    const cmapNames = this.cmaps.map(cmap => cmap.name)
    let colorScaleSelections = []
    cmapNames.forEach( (cmapName: string) => {
      colorScaleSelections.push({value: cmapName, viewValue: cmapName})
    })
    return colorScaleSelections
  }
  

  collateProfileMeasurements = function(profileData: BgcProfileData[] | CoreProfileData[], yLabel: string, colorLabel: string, includeQC?: boolean) {
    let collatedProfiles = {};
    const num_measurements = profileData.length;
    collatedProfiles[yLabel] = new Array(num_measurements)
    collatedProfiles[colorLabel] = new Array(num_measurements)
    const colorQCLabel = colorLabel + '_qc'
    if (includeQC) {
      collatedProfiles[colorQCLabel] = new Array(num_measurements)
    }

    for (var i = 0; i < num_measurements; ++i) {
        collatedProfiles[yLabel][i] = profileData[i][yLabel]
        collatedProfiles[colorLabel][i] = profileData[i][colorLabel]
        if (includeQC) {
          collatedProfiles[colorQCLabel][i] = profileData[i][colorQCLabel]
        }
    }
    return collatedProfiles;
}

  reduceGPSMeasurements = function(profileData: BgcProfileData | CoreProfileData, maxLength: number, measField: string) {
    if (profileData.POSITIONING_SYSTEM === 'GPS') {
      const mLen = profileData[measField].length
      if (mLen > maxLength) {
        //reduce array length to so that only every delta element is plotted
        const delta = Math.floor( mLen / maxLength )
        let reducedMeasurements = []
        for (let jdx = 0; jdx < mLen; jdx+=delta) {
          reducedMeasurements.push(profileData[measField][jdx])
        }
        return reducedMeasurements
      }
      else {
        return profileData[measField]
      }
    }
    else {
      return profileData[measField]
    }
  }

  roundArray(value){ return(Number(value).toFixed(3)) }

  makeColorChartDataArrays( profileData: BgcProfileData[] | CoreProfileData[],
                            yLabel: string, colorLabel: string, measField: string,
                            reduceMeas: number, statParamsKey: string, includeQC?: boolean) {
    let yMeas = []
    let cMeas = []
    let cQc = [] //todo: if requested, include qc
    let time = []
    let cycles = []
    let ids = []
    let stat_params = []
    let _ids = []
    const colorQCLabel = colorLabel+'_qc'
    for(let idx=0; idx < profileData.length; idx++) {
        const pdat = profileData[idx]
        if (!pdat[measField]) { continue }
        let meas = this.reduceGPSMeasurements(pdat, reduceMeas, measField)
        meas = this.collateProfileMeasurements(meas, yLabel, colorLabel, includeQC)
        yMeas = yMeas.concat(meas[yLabel])
        cMeas = cMeas.concat(meas[colorLabel])
        if (includeQC) { cQc = cQc.concat(meas[colorQCLabel]) }
        const _id = pdat._id
        //const data_mode = profile.core_data_mode
        const timeStr = moment.utc(pdat.date).format('YYYY-MM-DD HH:mm')
        const cycle = pdat.cycle_number
        const station_parameters = pdat[statParamsKey]
        stat_params = stat_params.concat(station_parameters)
        ids.push(_id)
        const plen = meas[yLabel].length
        const id_array = Array.apply(null, Array(plen)).map(String.prototype.valueOf,_id)
        const time_array = Array.apply(null, Array(plen)).map(String.prototype.valueOf,timeStr)
        const cycle_array = Array.apply(null, Array(plen)).map(Number.prototype.valueOf,cycle)
        _ids = _ids.concat(id_array)
        time = time.concat(time_array)
        cycles = cycles.concat(cycle_array)
    }

    let dataArrays  = {}
    dataArrays[colorLabel] = cMeas
    if (includeQC) { dataArrays[colorQCLabel] = cQc }
    dataArrays[yLabel] = yMeas
    dataArrays['ids'] = ids
    dataArrays['_ids'] = _ids
    dataArrays['cycle'] = cycles
    dataArrays['time'] = time
    dataArrays['station_parameters'] = stat_params
    return (dataArrays)
  }



  makeColorChartMeasurements(dataArrays, yLabel: string, colorLabel: string, units: string, cmapName: string) {
      const measurements =  {
          xvalues: dataArrays.time,
          yvalues: dataArrays[yLabel].map(this.roundArray),
          cvalues: dataArrays[colorLabel].map(this.roundArray),
          cqc: dataArrays[colorLabel+"_qc"],
          text: colorLabel + ': ',
          yaxis: 'y2',
          xaxis: 'x1',
          units: units,
          cycle: dataArrays.cycle,
          colorscale: this.getColorScale(cmapName),
          id: dataArrays._ids,
          //'data_modes: dataArrays.data_modesForTemp,
          colorbar: {
                  //title: "Temp. [Celsius]", 
                  len: 1, 
                  yanchor: "middle",
                  titleside: "right",
                  xpad: 10,
                  }
          }

  return measurements
  }
  makeColorChartTrace(meas, key: string, includeQC?: boolean) {
      let hovorText = []
      if (includeQC) {
        for(let idx=0; idx < meas.cvalues.length; idx++){
          let pointText = this.makeColorChartText(meas.yvalues[idx], meas.xvalues[idx], meas.text, meas.cvalues[idx], meas.units, meas.cycle[idx], meas.cqc[idx])
          hovorText.push(pointText)
      }
      }
      else {
        for(let idx=0; idx < meas.cvalues.length; idx++){
            let pointText = this.makeColorChartText(meas.yvalues[idx], meas.xvalues[idx], meas.text, meas.cvalues[idx], meas.units, meas.cycle[idx])
            hovorText.push(pointText)
        }
    }
      const scatterTrace = {
          y: meas.yvalues,
          x: meas.xvalues,
          text: hovorText,
          hoverinfo: 'text',
          showlegend: false,
          type: 'scattergl',
          mode: 'markers',
          cycle: meas.cycle,
          profile_ids: meas.id,
          marker: { color: meas.cvalues,
                      size: 5,
                      symbol: 'dot',
                      opacity: 1,
                      reversescale: false,
                      colorscale: meas.colorscale,
                      colorbar: meas.colorbar,
                  },
          name: key, 
      }
      return [scatterTrace]
  }

  public getTraceParams(paramKey: string): TraceParam {
    let traceParam = {} as TraceParam
    const baseKey = paramKey.replace(/[0-9]/g, '')
    const waveLength = paramKey.replace(/[a-z_]/g, '')
    switch (baseKey) {
      case 'temp':
        traceParam['short_name'] = 'temp'
        traceParam['long_name'] = 'sea water temperature'
        traceParam['units'] = 'C'
        traceParam['long_units'] = 'Celcius'
        traceParam['title'] = "Temperature [Celsius]"
        traceParam['colorscale'] = 'thermal'
        traceParam['color'] = 'rgb(220,50,50)'
        break;
      case 'psal':
        traceParam['short_name'] = 'psal'
        traceParam['long_name'] = 'salinity'
        traceParam['units'] = 'psu'
        traceParam['long_units'] = 'pounds per square inch'
        traceParam['title'] = "Salinity [psu]"
        traceParam['colorscale'] = 'haline'
        traceParam['color'] = 'rgb(133,212,227)'
        break;
      case 'pres':
        traceParam['short_name'] = 'pres'
        traceParam['long_name'] = 'sea water pressure'
        traceParam['units'] = 'dbar'
        traceParam['long_units'] = 'decibar'
        traceParam['title'] = "Pressure [dbar]"
        traceParam['colorscale'] = 'deep'
        traceParam['color'] = 'rgb(133,212,227)'
        break;
      case 'cndc':
        traceParam['short_name'] = 'cndc'
        traceParam['long_name'] = 'conductivity'
        traceParam['units'] = 'mohms/m'
        traceParam['long_units'] = 'miliohms per meter'
        traceParam['title'] = "Electrical Conductivity >[mohms/m]"
        traceParam['colorscale'] = 'amp' 
        traceParam['color'] = 'rgb(242,231,55)'
        break;
      case 'bbp':
        traceParam['short_name'] = 'bbp' + waveLength
        traceParam['long_name'] = 'particle back scattering at ' + waveLength + ' nanometers'
        traceParam['units'] = '1/m'
        traceParam['long_units'] = 'per meter'
        traceParam['title'] = 'Particle backscattering at ' + waveLength + ' nanometers [1/m]'
        traceParam['colorscale'] = 'matter' 
        traceParam['color'] = 'rgb(27,51,105)'
        traceParam['waveLength'] = waveLength
        break;
      case 'cp':
        traceParam['short_name'] = 'cp' + waveLength
        traceParam['long_name'] = 'particle beam attenuation at ' + waveLength + ' nanometers'
        traceParam['units'] = '1/m'
        traceParam['long_units'] = 'per meter'
        traceParam['title'] = 'Particle beam attenuation at ' + waveLength + ' nanometers [1/m]'
        traceParam['color']
        traceParam['colorscale'] = 'matter' 
        traceParam['color'] = 'rgb(189,200,202)'
        traceParam['waveLength'] = waveLength
        break;
      case 'doxy':
        traceParam['short_name'] = 'doxy'
        traceParam['long_name'] = 'dissolved oxygen'
        traceParam['units'] = 'uMol/kg'
        traceParam['long_units'] = 'micromole per kilogram'
        traceParam['title'] = 'Dissolved Oxygen [micromole/kg]'
        traceParam['colorscale'] = 'oxy' 
        traceParam['color'] = 'rgb(242,231,55)'
        break;
      case 'chla':
        traceParam['short_name'] = 'chla'
        traceParam['long_name'] = 'chlorophill-a'
        traceParam['units'] = 'mg/m3'
        traceParam['long_units'] = 'miligram per cubic meter'
        traceParam['title'] = 'Chlorophyll-A [mg/m3]'
        traceParam['colorscale'] = 'algae' 
        traceParam['color'] = 'rgb(237,113,62)'
        break;
      case 'cdom':
        traceParam['short_name'] = 'cdom'
        traceParam['long_name'] = 'concentration of coloured dissolved organic matter in sea water'
        traceParam['units'] = 'ppb'
        traceParam['long_units'] = 'parts per billion'
        traceParam['title'] = 'Concentration of coloured dissolved <br>organic matter in sea water [ppb]'
        traceParam['colorscale'] = 'algae' 
        traceParam['color'] = 'rgb(133,212,227)'
        break;
      case 'nitrate':
        traceParam['short_name'] = 'nitrate'
        traceParam['long_name'] = 'nitrate'
        traceParam['units'] = 'uMol/kg'
        traceParam['long_units'] = 'micromole per kilogram'
        traceParam['title'] = 'Nitrate [micromole/kg]'
        traceParam['colorscale'] = 'algae' 
        traceParam['color'] = 'rgb(40,177,161)'
        break;
      case 'turbidity':
        traceParam['short_name'] = 'turbidity'
        traceParam['long_name'] = 'sea water turbidity'
        traceParam['units'] = 'ntu'
        traceParam['long_units'] = 'nephelometric turbidity units'
        traceParam['title'] = 'Sea water turbidity [ntu]'
        traceParam['colorscale'] = 'turbid' 
        traceParam['color'] = 'rgb(27,51,105)'
        break;
      case 'bisulfide':
        traceParam['short_name'] = 'bisulfide'
        traceParam['long_name'] = 'bisulfide'
        traceParam['units'] = 'uMol/kg'
        traceParam['long_units'] = 'micromole per kilogram'
        traceParam['title'] = 'Bisulfide [micromole/kg]'
        traceParam['colorscale'] = 'solar' 
        traceParam['color'] = 'rgb(242,231,55)'
        break;
      case 'ph_in_situ_total':
        traceParam['short_name'] = 'pH'
        traceParam['long_name'] = 'sea water ph reported on total scale'
        traceParam['units'] = ''
        traceParam['long_units'] = ''
        traceParam['title'] = 'pH in situ total [ ]'
        traceParam['colorscale'] = 'gray' 
        traceParam['color'] = 'rgb(242,231,55)'
        break;
      case 'down_irradiance':
        traceParam['short_name'] = 'down irradiance'
        traceParam['long_name'] = 'downwelling irradiance at' + waveLength + ' nanometers'
        traceParam['units'] = 'W/m^2/nm'
        traceParam['long_units'] = 'Watts per meter squared per nanometers'
        traceParam['title'] = 'Downwelling irradiance at ' + waveLength + ' nanometers [W/m^2/nm]'
        traceParam['colorscale'] = 'matter' 
        traceParam['color'] = 'rgb(66,50,49)'
        traceParam['waveLength'] = waveLength
        break;
      case 'up_irradiance':
        traceParam['short_name'] = 'up irradiance'
        traceParam['long_name'] = 'upwelling irradiance at' + waveLength + ' nanometers'
        traceParam['units'] = 'W/m^2/nm'
        traceParam['long_units'] = 'Watts per meter squared per nanometers'
        traceParam['title'] = 'Upwelling irradiance at ' + waveLength + ' nanometers [W/m^2/nm]'
        traceParam['colorscale'] = 'matter' 
        traceParam['color'] = 'rgb(222,189,153)'
        traceParam['waveLength'] = waveLength
        break;
      case 'downwelling_par':
        traceParam['short_name'] = 'down par'
        traceParam['long_name'] = 'downwelling photosynthetic available radiation <br> [uMol Quanta/m^2/sec]'
        traceParam['units'] = ' uMol Quanta/m^2/sec'
        traceParam['long_units'] = 'micromole quanta per meters squared per second'
        traceParam['title'] = 'Downwelling photosynthetic available radiation <br> [uMol Quanta/m^2/sec]'
        traceParam['colorscale'] = 'solar' 
        traceParam['color'] = 'rgb(73,112,109)'
        break;
      default:
        traceParam['short_name'] = 'not listed'
        traceParam['long_name'] = 'not listed'
        traceParam['units'] = ''
        traceParam['long_units'] = ''
        traceParam['title'] = ''
        traceParam['colorscale'] = '' 
        traceParam['color'] = 'rgb(66,50,49)'
      }
    return traceParam
  }

  public getColorScale(cmapName: string) {
    const isColorscale = function(cmap) { 
      return cmap.name === cmapName;
    }
    const cmap = this.cmaps.find(isColorscale) 
    return cmap.cmap
  }


}
