import { Component, OnInit, Input } from '@angular/core';
import { QueryService } from '../query.service'

@Component({
  selector: 'app-sidebar-nav',
  templateUrl: './sidebar-nav.component.html',
  styleUrls: ['./sidebar-nav.component.css']
})
export class SidebarNavComponent implements OnInit {

  constructor(private queryService: QueryService) { }

  @Input() checked = true;

  ngOnInit() {
    this.queryService.sendToggleMsg(this.checked)
  }

  realtimeChange(event: any): void {
    this.checked = event.checked
    this.queryService.sendToggleMsg(this.checked);
  }

}
