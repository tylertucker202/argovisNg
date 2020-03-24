import { Injectable } from '@angular/core';
import { BgcProfileData, CoreProfileData, StationParameters, ColorScaleSelection } from './profiles'
import * as moment from 'moment';
import { quickselect } from 'd3';
import { Cmap, cmaps } from './colorscales'

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
  public readonly cmaps: Cmap[] = cmaps


  public colorscaleSelections: ColorScaleSelection[] = this.makeColorScaleSelections()
  

  public makeLayout(yLabel: string) {
    const layout = {
      height: 175, 
      width: 1000,
      margin: {
        l: 5,
        r: 5,
        b: 25,
        t: 25,
        pad: 5
      },
      yaxis: {
          showticklabels: true,
          autorange: 'reversed', //scattergl currently does not show tick labels when axis is reversed
          type: "linear", 
          title: yLabel,
          automargin: true,
      },
      xaxis: {
          autorange: true, 
          type: "date", 
          title: "Date",
          automargin: true,
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
