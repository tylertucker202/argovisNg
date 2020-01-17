import { Component, OnInit, Input } from '@angular/core';
import { QueryService } from '../services/query.service'
import {MatDialog} from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { ArDisplayComponent } from './ar-display/ar-display.component'

export interface Projections {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-sidebar-nav',
  templateUrl: './sidebar-nav.component.html',
  styleUrls: ['./sidebar-nav.component.css']
})

export class SidebarNavComponent implements OnInit {

  private date = new FormControl(new Date());

  constructor( private queryService: QueryService,
               public dialog: MatDialog ) { }

  @Input() private includeRT: boolean;
  @Input() private onlyBGC: boolean;
  @Input() private onlyDeep: boolean;
  @Input() private display3Day: boolean;
  @Input() private proj: string;
  
  private arMode: boolean
  private platformInput: string;
  private projections: Projections[] = [
    {value: 'WM', viewValue: 'Web mercator'},
    {value: 'SSP', viewValue: 'Southern stereo projection'},
    {value: 'NSP', viewValue: 'Northern stereo projection'}
  ];

  ngOnInit() {
    this.arMode = this.queryService.getArMode();
    this.queryService.urlBuild
    .subscribe(msg => {
      //toggle if states have changed    
      this.includeRT = this.queryService.getRealtimeToggle()
      this.onlyBGC = this.queryService.getBGCToggle()
      this.onlyDeep = this.queryService.getDeepToggle()

      this.display3Day = this.queryService.getThreeDayToggle()
      this.proj = this.queryService.getProj()

      let displayDate = new Date(this.queryService.getGlobalDisplayDate())
      displayDate.setDate(displayDate.getDate())
      displayDate.setMinutes( displayDate.getMinutes() + displayDate.getTimezoneOffset() );
      this.date = new FormControl(displayDate)
    })
  }

  realtimeChange(checked: boolean): void {
    this.includeRT = checked
    this.queryService.sendRealtimeMsg(this.includeRT);
  }

  displayGlobalChange(checked: boolean): void {
    this.display3Day = checked
    this.queryService.sendThreeDayMsg(this.display3Day);
  }

  bgcChange(checked: boolean): void {
    this.onlyBGC = checked
    this.queryService.sendBGCToggleMsg(this.onlyBGC);
  }

  deepChange(checked: boolean): void {
    this.onlyDeep = checked
    this.queryService.sendDeepToggleMsg(this.onlyDeep);
  }

  arModeChange(checked: boolean): void {
    this.arMode = checked
    const broadcastChange = false
    const clearOtherShapes = checked // remove other shape if checked
    this.queryService.sendArMode(this.arMode, broadcastChange, clearOtherShapes)
  }

  clearProfiles(): void {
    this.queryService.triggerClearLayers();
  }

  resetToStart(): void {
    this.queryService.triggerResetToStart();
  }

  mapProjChange(proj: string): void {
    this.proj = proj
    this.queryService.sendProj(proj)
  }



  displayPlatformInputChanged(platformInput: string): void {
    this.platformInput = platformInput
    if (platformInput.length >= 5){
       this.queryService.triggerShowPlatform(platformInput)
    }
  }

  displayGlobalDateChanged(date: Date): void {
    this.date = new FormControl(date)
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const dateStr = year + '-' + month + '-' + day
    this.queryService.sendGlobalDate(dateStr)
  }

  openARDialog(): void {
    console.log('inside AR dialog')
    this.queryService.clearLayers.emit('inside AR Dialog')
    const dialogRef = this.dialog.open(ArDisplayComponent, {
      width: '300px',
      data: {}
    });
  }
}
