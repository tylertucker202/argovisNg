import { Component, Input, OnInit } from '@angular/core';
import { QueryService} from '../services/query.service';
@Component({
  selector: 'app-prof-popup',
  templateUrl: './prof-popup.component.html',
  styleUrls: ['./prof-popup.component.css']
})
export class ProfPopupComponent {
  showBGC: boolean = false;
  show: boolean = false;
  constructor(private queryService: QueryService) {     
    if (this.bgc) {
    this.showBGC = true;
    }
  }

  @Input() platform: string;
  @Input() bgc: boolean;
  @Input() lat: string;
  @Input() long: string;
  @Input() profileId: string;
  @Input() unknownPos: boolean;

  private introMsg = {}

  ngOnInit() {
    this.introMsg = "Hello, i'm " + this.profileId + "!"
    if (this.unknownPos) {
      this.introMsg += " My whereabouts are unknown!"
    }
    if (this.bgc) {
      console.log('includes bgc')
      this.showBGC = true;
      }
  }



  showPlatformsProfiles() {
    this.queryService.triggerPlatformShow(this.platform)
  }

}
