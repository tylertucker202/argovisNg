import { TcQueryService } from './../tc-query.service';
import { SidebarNavComponent } from './../../home/sidebar-nav/sidebar-nav.component';
import { Component, OnInit, Injector } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-tc-sidebar-nav',
  templateUrl: './tc-sidebar-nav.component.html',
  styleUrls: ['./tc-sidebar-nav.component.css']
})
export class TsSidebarNavComponent extends SidebarNavComponent implements OnInit {
  public tcQueryService: TcQueryService
  public globalStorms: boolean
  constructor( public injector: Injector) { super(injector)
    this.tcQueryService = this.injector.get(TcQueryService) }

    ngOnInit() {
      this.includeRT = this.tcQueryService.get_realtime_toggle()
      this.onlyBGC = this.tcQueryService.get_bgc_toggle()
      this.onlyDeep = this.tcQueryService.get_deep_toggle()
      this.globalStorms = this.tcQueryService.get_global_storms_toggle()
      this.setSubscriptions()
    }
  
    setSubscriptions() {
      this.tcQueryService.urlBuild
      .subscribe(msg => {
        //toggle if states have changed 
        this.globalStorms = this.tcQueryService.get_global_storms_toggle()   
        this.includeRT = this.tcQueryService.get_realtime_toggle()
        this.onlyBGC = this.tcQueryService.get_bgc_toggle()
        this.onlyDeep = this.tcQueryService.get_deep_toggle()
        this.proj = this.tcQueryService.get_proj()
  
        let displayDate = new Date(this.tcQueryService.get_global_display_date())
        displayDate.setDate(displayDate.getDate())
        displayDate.setMinutes( displayDate.getMinutes() + displayDate.getTimezoneOffset() );
        this.date = new FormControl(displayDate)
      })
    }

  realtime_changed(checked: boolean): void {
    this.includeRT = checked
    this.tcQueryService.send_realtime_msg(this.includeRT);
  }

  global_storms_change(checked: boolean): void {
    this.globalStorms = checked
    this.tcQueryService.send_global_storms_msg(this.globalStorms);
  }

  bgc_change(checked: boolean): void {
    this.onlyBGC = checked
    this.tcQueryService.send_bgc_toggle_msg(this.onlyBGC);
  }

  deep_change(checked: boolean): void {
    this.onlyDeep = checked
    this.tcQueryService.send_deep_toggle_msg(this.onlyDeep);
  }

  clear_profiles(): void {
    this.tcQueryService.trigger_clear_layers();
  }

  reset_to_start(): void {
    this.tcQueryService.trigger_reset_to_start();
  }

}
