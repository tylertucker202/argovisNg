import { Component, OnInit, Injector } from '@angular/core';
import { SidebarNavComponent } from '../../home/sidebar-nav/sidebar-nav.component'
import { ArQueryService } from '../ar-query.service'
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-ar-sidebar-nav',
  templateUrl: './ar-sidebar-nav.component.html',
  styleUrls: ['./ar-sidebar-nav.component.css']
})
export class ArSidebarNavComponent extends SidebarNavComponent implements OnInit {
  public arQueryService: ArQueryService
  public dialog: MatDialog
  public displayGlobally: boolean
  constructor( public injector: Injector ) { super(injector)
                                             this.arQueryService = this.injector.get(ArQueryService) }

  ngOnInit(): void {
    super.ngOnInit()
  }

  setSubscriptions() {
    this.arQueryService.urlBuild
    .subscribe(msg => {
      //toggle if states have changed 
      this.includeRT = this.arQueryService.get_realtime_toggle()
      this.onlyBGC = this.arQueryService.get_bgc_toggle()
      this.onlyDeep = this.arQueryService.get_deep_toggle()
      this.displayGlobally = this.arQueryService.get_display_globally()
      this.proj = this.arQueryService.getProj()
    })
  }

  displayGlobalChange(checked: boolean): void {
    this.displayGlobally = checked
    this.arQueryService.send_display_globally(this.displayGlobally, true)
  }

  clearProfiles(): void {
    this.arQueryService.trigger_clear_layers();
  }

  resetToStart(): void {
    this.arQueryService.trigger_reset_to_start();
  }

  realtimeChange(checked: boolean): void {
    this.includeRT = checked
    this.arQueryService.sendRealtimeMsg(this.includeRT);
  }

  bgcChange(checked: boolean): void {
    this.onlyBGC = checked
    this.arQueryService.sendBGCToggleMsg(this.onlyBGC);
  }

  deepChange(checked: boolean): void {
    this.onlyDeep = checked
    this.arQueryService.sendDeepToggleMsg(this.onlyDeep);
  }

}
