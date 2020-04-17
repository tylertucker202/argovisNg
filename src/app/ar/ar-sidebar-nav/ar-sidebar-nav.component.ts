import { Component, OnInit } from '@angular/core';
import { SidebarNavComponent } from './../../home/sidebar-nav/sidebar-nav.component'
import { QueryService } from './../../home/services/query.service'
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-ar-sidebar-nav',
  templateUrl: './ar-sidebar-nav.component.html',
  styleUrls: ['./ar-sidebar-nav.component.css']
})
export class ArSidebarNavComponent extends SidebarNavComponent implements OnInit {

  constructor( public queryService: QueryService,
               public dialog: MatDialog ) {super(queryService, dialog)  }
  private arMode: boolean = true

  ngOnInit(): void {
    super.ngOnInit()
    //this.arMode = this.queryService.getArMode()
  }
  arModeChange(checked: boolean): void {
    this.arMode = checked
    const broadcastChange = false
    const clearOtherShapes = checked // remove other shape if checked
    this.queryService.sendArMode(this.arMode, broadcastChange, clearOtherShapes)
  }


}
