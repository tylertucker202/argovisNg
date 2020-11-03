import { TcQueryService } from './../tc-query.service';
import { SidebarNavComponent } from './../../home/sidebar-nav/sidebar-nav.component';
import { Component, OnInit, Injector } from '@angular/core';
@Component({
  selector: 'app-tc-sidebar-nav',
  templateUrl: './tc-sidebar-nav.component.html',
  styleUrls: ['./tc-sidebar-nav.component.css']
})
export class TsSidebarNavComponent extends SidebarNavComponent implements OnInit {
  public tcQueryService: TcQueryService
  
  constructor( public injector: Injector ) { super(injector)
    this.tcQueryService = this.injector.get(TcQueryService) }

  ngOnInit(): void {
  }

}
