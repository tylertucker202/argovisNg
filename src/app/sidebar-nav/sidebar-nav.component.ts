import { Component, OnInit, Input, Inject } from '@angular/core';
import { QueryService } from '../query.service'
import { DOCUMENT } from '@angular/common';

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

  private url: string;
  private proj: string;

  constructor(private queryService: QueryService,
              @Inject(DOCUMENT) private document: Document) { }

  @Input() checked = true;

  ngOnInit() {
    this.queryService.sendToggleMsg(this.checked)
    this.url = this.document.location.search.split('?map=')[0];
    this.proj = this.document.location.search.split('?map=')[1];
  }

  realtimeChange(event: any): void {
    this.checked = event.checked
    this.queryService.sendToggleMsg(this.checked);
  }

  mapProjChange(proj: string): void {
    const newUrl = this.url + '?map=' + proj
    window.location.assign(newUrl)
  }
  projections: Projections[] = [
    {value: 'WM', viewValue: 'Web mercator'},
    {value: 'SSP', viewValue: 'Southern stereo projection'},
    {value: 'NSP', viewValue: 'Northern stereo projection'}
  ];
}
