import { Injectable } from '@angular/core';
import { GetProfilesService } from './get-profiles.service'
import { ProfileMeta, Profile } from './profiles'
import { Observable } from 'rxjs';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class ProfviewService {

  constructor(private getProfileService: GetProfilesService) { }

  public getMockProfileMetadata(): Observable<ProfileMeta[]> {
    let mockProfiles = this.getProfileService.getMockProfiles()
    mockProfiles.forEach( (mockProfile: ProfileMeta[]) => {
      mockProfile['measurements'] = undefined
      mockProfile['bgcMeas'] = undefined
    })
    return mockProfiles
  }

  public getTestProfileSelectionMetadata(): Observable<ProfileMeta[]> {
    let mockProfiles = this.getProfileService.getTestProfiles()
    mockProfiles.forEach( (mockProfile: ProfileMeta[]) => {
      mockProfile['measurements'] = undefined
      mockProfile['bgcMeas'] = undefined
    })
    return mockProfiles
  }

  public getTestPlatformSelectionMetadata(): Observable<ProfileMeta[]> {
    let mockProfiles = this.getProfileService.getTestPlaformProfileMetadata()
    return mockProfiles
  }

  // Virtual fields for table
  public make_profile_link (_id: string): string {
    return '/catalog/profiles/' + _id;
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
      row['date'] = moment(row['date']).format("dddd, MMMM Do YYYY, h:mm:ss a"); 
      const stat_params = row[statKey]
      row['formatted_station_parameters'] = this.make_formatted_station_parameters(stat_params)
    })
    return profileMeta
  }

  public make_jcomps_platform(platform_number: string): string {
    return 'http://www.jcommops.org/board/wa/Platform?ref=' + platform_number
  }

  public make_ifremer_profile(platform_number: string, cycle_number: number) {
    return 'http://www.ifremer.fr/co-argoFloats/cycle?detail=false&ptfCode='+platform_number+'&cycleNum='+cycle_number.toString()
  }

  public make_formatted_station_parameters(station_parameters) {
    return station_parameters.map(param => ' '+param)
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
}
