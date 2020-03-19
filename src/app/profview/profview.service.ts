import { Injectable } from '@angular/core';
import { GetProfilesService } from './get-profiles.service'
import { ProfileMeta, Profile } from './profiles'
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class ProfviewService {

  constructor(private getProfileService: GetProfilesService) { }

  public getMockProfileMetadata(): Observable<ProfileMeta[]> {
    let mockProfiles = this.getProfileService.getMockProfiles()
    mockProfiles.forEach( (mockProfile: any) => {
      mockProfile['measurements'] = undefined
      mockProfile['bgcMeas'] = undefined
    })
    return mockProfiles
  }

  public getTestProfileMetadata(): Observable<ProfileMeta[]> {
    let mockProfiles = this.getProfileService.getTestProfiles()
    mockProfiles.forEach( (mockProfile: any) => {
      mockProfile['measurements'] = undefined
      mockProfile['bgcMeas'] = undefined
    })
    return mockProfiles
  }
}
