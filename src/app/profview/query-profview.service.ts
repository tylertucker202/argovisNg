import { Injectable, EventEmitter, Output } from '@angular/core';
import { GetProfilesService } from './get-profiles.service'
import { ProfileMeta, StationParameters } from './profiles'
import { ActivatedRoute, Router } from '@angular/router'
import { Observable } from 'rxjs';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class QueryProfviewService {

  @Output() changeStatParams: EventEmitter<string> = new EventEmitter
  @Output() urlParsed: EventEmitter<string> = new EventEmitter
  public platform_number: string = "5903260"
  public topChart: string = 'temp'
  public bottomChart: string = 'psal'
  public bgcPlatform: boolean = true
  public statParamKey: string = 'bgcMeasKeys'
  public statParams: StationParameters[]
  public measKey: string = 'bgcMeas'

  constructor(private route: ActivatedRoute,
              private getProfileService: GetProfilesService,
              private router: Router) { this.router.urlUpdateStrategy = 'eager' }

  // Virtual fields for table
  public make_profile_link (_id: string): string {
    return '/catalog/profiles/' + _id + '/bgcPage';
  }

  public make_core_data_mode(DATA_MODE: string, PARAMETER_DATA_MODE): string {
    let core_data_mode
    if (DATA_MODE) {
      core_data_mode = DATA_MODE
    }
    else if (PARAMETER_DATA_MODE.length > 0) {
      core_data_mode = PARAMETER_DATA_MODE[0]
    }
    else {
      core_data_mode = 'Unknown'
    }
    return core_data_mode
  }

  public applyFormatting( profileMeta: ProfileMeta[], statKey: string): ProfileMeta[] {
    profileMeta.forEach( (row: ProfileMeta) => {
      row['lat_str'] = this.make_str_lat(row['lat'])
      row['lon_str'] = this.make_str_lat(row['lon'])
      row['date'] = moment(row['date']).format("YYYY-M-D");
    })
    return profileMeta
  }

  public makeUniqueStationParameters( profiles: ProfileMeta[], statParamsKey: string): void {
    let statParamSet = new Set();
    let uStatParam = [] as string[]
    profiles.forEach(prof => {
      const station_parameters = prof[statParamsKey]
      if (station_parameters) { 
        station_parameters.forEach( param => {
          if(!statParamSet.has(param)) {
            statParamSet.add(param);
            uStatParam.push(param)
          }
        })
      }
    })
    uStatParam = uStatParam.filter( elem => elem !== 'pres')
    let statParams = [] as StationParameters[]
    uStatParam.forEach( (statParam: string) => {
        statParams.push({value: statParam, viewValue: statParam})
    })
    this.statParams = statParams
    this.changeStatParams.emit('station param change')
  }

  public make_jcommops_platform(platform_number: string): string {
    return 'http://www.jcommops.org/board/wa/Platform?ref=' + platform_number
  }

  public make_fleet_monitoring_platform(platform_number: string): string {
    return 'https://fleetmonitoring.euro-argo.eu/float/' + platform_number
  }

  public round_to_three(x) {
    return x.toFixed(3);
  }

  public make_str_lat (lat: number): string {
    let strLat: string
    if (lat > 0) {
      strLat = Math.abs(lat).toFixed(3).toString() + ' N';
    }
    else {
        strLat = Math.abs(lat).toFixed(3).toString() + ' S';
    }
    return strLat
  }

  public make_str_lon(lon: number): string {
    let strLon: string
    if (lon > 0) {
      strLon = Math.abs(lon).toFixed(3).toString() + ' E';
    }
    else {
        strLon = Math.abs(lon).toFixed(3).toString() + ' W';
    }
    return strLon
  }

  public make_date_formatted(date: Date): string {
    return moment.utc(date).format('YYYY-MM-DD');
  }

  public setParamsFromURL(): void{
    this.route.queryParams.subscribe(params => {
      Object.keys(params).forEach(key => {
        this.setMapState(key, params[key])
      });
    });
    this.urlParsed.emit('url parsed. safe to build chart and window')
  }

  public setURL(): void {

    const queryParams = {
                         'platform_number': this.platform_number,
                         'topChart': this.topChart, 
                         'bottomChart': this.bottomChart,
                         'bgcPlatform': JSON.stringify(this.bgcPlatform),
                        }
    this.router.navigate(
      [], 
      {
        relativeTo: this.route,
        queryParams: queryParams,
        //queryParamsHandling: "merge"
      });
  }

  public setMapState(this, key: string, value: string): void {
    switch(key) {
      case 'platform_number': {
        this.platform_number = value
        break
      }
      case 'topChart': {
        this.topChart = value
        break
      }
      case 'bottomChart': {
        this.bottomChart = value
        break
      }
      case 'bgcPlatform': {
        const bgcPlatform = JSON.parse(value)
        this.bgcPlatform = bgcPlatform
        if (!bgcPlatform) {
          this.statParamsKey = 'measurements'
          this.measKey = 'station_parameters'
        }
        else{
          this.statParamsKey = 'bgcMeasKeys'
          this.measKey = 'bgcMeas'
        }
        break
      }
      default: {
        console.log('key not found. not doing anything: ', key)
        break;
      }
    }
  }
}
