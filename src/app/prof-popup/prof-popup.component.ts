import { Component, Input } from '@angular/core';
import { QueryService} from './../query.service';
@Component({
  selector: 'app-prof-popup',
  templateUrl: './prof-popup.component.html',
  styleUrls: ['./prof-popup.component.css']
})
export class ProfPopupComponent {

  constructor(private queryService: QueryService) { }

  @Input() platform: string;

  showPlatformsProfiles() {
    this.queryService.triggerPlatformShow(this.platform)
  }

}
