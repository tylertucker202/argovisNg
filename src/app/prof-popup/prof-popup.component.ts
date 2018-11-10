import { Component, Input, OnInit } from '@angular/core';
import { QueryService} from './../query.service';
@Component({
  selector: 'app-prof-popup',
  templateUrl: './prof-popup.component.html',
  styleUrls: ['./prof-popup.component.css']
})
export class ProfPopupComponent {
  showBGC: boolean = false;
  show: boolean = false;
  constructor(private queryService: QueryService) {     
    if (this.bgc == 1) {
    this.showBGC = true;
    }
  }

  @Input() platform: string;
  @Input() bgc: Number;

  ngOnInit() {
    if (this.bgc == 1) {
      console.log('includes bgc')
      this.showBGC = true;
      }
  }



  showPlatformsProfiles() {
    this.queryService.triggerPlatformShow(this.platform)
  }

}
