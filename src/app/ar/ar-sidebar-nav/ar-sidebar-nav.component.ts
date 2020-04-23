import { Component, OnInit, Injector } from '@angular/core';
import { SidebarNavComponent } from './../../home/sidebar-nav/sidebar-nav.component'
import { ArQueryService } from './../ar-query.service'
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
      this.includeRT = this.arQueryService.getRealtimeToggle()
      this.onlyBGC = this.arQueryService.getBGCToggle()
      this.onlyDeep = this.arQueryService.getDeepToggle()
      this.displayGlobally = this.arQueryService.getDisplayGlobally()
      this.proj = this.arQueryService.getProj()

      let displayDate = new Date(this.arQueryService.getGlobalDisplayDate())
      displayDate.setDate(displayDate.getDate())
      displayDate.setMinutes( displayDate.getMinutes() + displayDate.getTimezoneOffset() );
      this.date = new FormControl(displayDate)
    })
  }

  displayGlobalChange(checked: boolean): void {
    this.displayGlobally = checked
    this.arQueryService.sendDisplayGlobally(this.displayGlobally, true)
  }

  clearProfiles(): void {
    this.arQueryService.triggerClearLayers();
  }

  resetToStart(): void {
    this.arQueryService.triggerResetToStart();
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

  mapProjChange(proj: string): void {
    this.proj = proj
    this.arQueryService.sendProj(proj)
  }


}
